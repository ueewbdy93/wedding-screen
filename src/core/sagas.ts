import lodash from 'lodash';
import { eventChannel } from 'redux-saga';
import { Server, Socket } from 'socket.io';
import {
  call, fork, put, race, select, take, takeEvery, takeLatest,delay,
} from 'redux-saga/effects';
import { createStandardAction, getType, ActionType } from 'typesafe-actions';
import { v4 as uuidV4 } from 'uuid';
import { config } from '../config-helper';
import db from '../db';
import { ICommentState } from './comments';
import { addComment, removeComments, setCurrentRoundStartTime } from './comments/actions';
import { IComment } from './comments/types';
import {
  addPlayer,
  resetPlayerVote,
  setPlayers,
  setQuestionIndex,
  setStage,
  updatePlayerVote,
} from './game/actions';
import {
  IPlayer,
  PlayerState,
  PlayerVote,
  Stage,
} from './game/types';
import { setMode } from './root-action';
import { IRootState } from './root-reducer';
import { Mode } from './root-types';
import { nextSlide } from './slide/actions';

const ROOM_ADM = 'ADM';

/**
 * Get process start time in milli-sencond
 */
function getProcessUptime() {
  return process.uptime() * 1000;
}

/**
 * A new comment from client
 */
const CLIENT_ADD_COMMENT = '@@CLIENT_ADD_COMMENT';
const clientAddComment = createStandardAction(CLIENT_ADD_COMMENT)<{content: string}>();

/**
 * A new comment from admin
 */
const ADMIN_INSERT_COMMENT = '@@ADMIN_INSERT_COMMENT';
const adminAddComment = createStandardAction(ADMIN_INSERT_COMMENT)<{content: string}>();

function* handleNewCommentSaga(io: Server, content: string) {
  const curRoundStartTime:number = yield select(
    (s: IRootState) => s.comment.currentRoundStartTime);
  const comment: IComment = {
    content,
    offset: getProcessUptime() - curRoundStartTime,
    createAt: Date.now(),
  };
  // broadcast to all client
  io.emit('SLIDE_CHANGE', { newComment: { ...comment, id: uuidV4() } });
  io.to(ROOM_ADM).emit('ADMIN_CHANGE', { newComment: { ...comment, id: uuidV4() } });
  yield put(addComment(comment));
  // save into db
  yield fork(db.insertComment, comment);
}

/**
 * Receive new comment from client
 * @param io
 */
function* handleClientCommentSaga(io: Server) {
  yield takeEvery<ActionType<typeof clientAddComment>>(getType(clientAddComment), function*(clientAction) {
    yield call(handleNewCommentSaga, io, clientAction.payload.content);
  });
}

function* commentWorkerSaga(io: Server) {
  const commentState: ICommentState = yield select((s: IRootState) => s.comment);
  const { currentRoundStartTime, comments } = commentState;
  if (comments.length === 0) {
    return;
  }
  const sortedComment = [...comments].sort((a, b) => a.offset - b.offset);
  sortedComment.sort((a, b) => a.offset - b.offset);
  yield race({
    clearComments: take('@@ADMIN_CLEAR_COMMENT'),
    sendComments: call(function*() {
      for (const comment of sortedComment) {
        // Calculate time to show next comment
        const now = getProcessUptime();
        const d = comment.offset - (now - currentRoundStartTime);
        yield delay(Math.max(0, d));
        // Broadcast comment to clients
        io.emit('SLIDE_CHANGE', { newComment: { ...comment, id: uuidV4() } });
      }
    }),
  });
}

/**
 * Tell client to show next picture every <config.slide.intervalMS> milliseconds
 */
function* slideWorkerSaga(io: Server) {
  const images: string[] = yield select((s: IRootState) => s.slide.images);
  while (true) {
    const curRoundStartTime = getProcessUptime();
    yield put(setCurrentRoundStartTime({offset: curRoundStartTime}));
    yield fork(commentWorkerSaga, io);
    for (const image of images) {
      yield delay(config.slide.intervalMs);
      yield put(nextSlide({ image }));
      io.emit('SLIDE_CHANGE', { curImage: image });
    }
  }
}

const ADMIN_NEXT_QUESTION = '@@ADMIN_START_QUESTION';
const adminNextQuestion = createStandardAction(ADMIN_NEXT_QUESTION)();

const ADMIN_START_ANSWER = '@@ADMIN_START_ANSWER';
const adminStartAnswer = createStandardAction(ADMIN_START_ANSWER)();

const ADMIN_REVEAL_ANSWER = '@@ADMIN_REVEAL_ANSWER';
const adminRevealAnswer = createStandardAction(ADMIN_REVEAL_ANSWER)();

const ADMIN_SHOW_SCORE = '@@ADMIN_SHOW_SCORE';
const adminShowScore = createStandardAction(ADMIN_SHOW_SCORE)();

function* syncPlayerVotes(io: Server) {
  while (true) {
    yield delay(800);
    const playerVotes = yield select((s: IRootState) => s.game.playerVotes);
    io.to(ROOM_ADM).emit('ADMIN_CHANGE', { playerVotes });
  }
}

function* gameRound(io: Server) {
  const questionLength = config.game.questions.length;
  for (let i = 0; i < questionLength; i += 1) {
    const question = config.game.questions[i];
    yield take(getType(adminNextQuestion));
    yield put(setQuestionIndex({index: i}));
    yield put(setStage(Stage.START_QUESTION));
    yield put(resetPlayerVote());

    io.emit('GAME_CHANGE', {
      stage: Stage.START_QUESTION,
      selectedOption: null,
      answers: null,
      options: [],
      question: {
        text: question.text,
        id: question.id,
      },
      questionIndex: i,
      vote: null,
      curVote: null,
      playerVotes: {},
    });

    io.to(ROOM_ADM).emit('ADMIN_CHANGE', { question });

    yield take(getType(adminStartAnswer));
    yield put(setStage(Stage.START_ANSWER));

    io.emit('GAME_CHANGE', {
      stage: Stage.START_ANSWER,
      options: question.options,
    });

    const startAnswerTime = Date.now();
    const gameInterval = config.game.intervalMs;
    yield race({
      timeout: delay(gameInterval),
      forceTimeout: take(getType(adminRevealAnswer)),
      syncPlayerVotes: call(syncPlayerVotes, io),
      playerAnswer: call(function*() {
        while (true) {
          const action: ActionType<typeof playerAnswer> = yield take(getType(playerAnswer));

          const { playerID, answerID } = action.payload;
          const playerVote = {
            playerId: playerID,
            questionId: question.id,
            optionId: answerID,
            time: Math.max(0, Date.now() - startAnswerTime),
            isAnswer: question.answers.indexOf(answerID) !== -1,
          };
          yield put(updatePlayerVote(playerVote));
          action.socket.emit('GAME_CHANGE', { curVote: playerVote });
        }
      }),
    });

    yield put(setStage(Stage.REVEAL_ANSWER));

    io.emit('GAME_CHANGE', {
      stage: Stage.REVEAL_ANSWER,
      answers: question.answers,
    });

    const [playerVotes, players]: [{ [key: string]: PlayerVote }, ReadonlyArray<IPlayer>]
      = yield select((s: IRootState) => ([s.game.playerVotes, s.game.players]));
    io.to(ROOM_ADM).emit('ADMIN_CHANGE', { playerVotes });
    io.emit('GAME_CHANGE', { playerVotes });

    // calculate score
    const newPlayers = players.map((player: Readonly<IPlayer>) => {
      const playerVote = playerVotes[player.id];
      const newPlayer = { ...player, timeBonus: 0 };
      if (playerVote === undefined) {
        newPlayer.incorrectCount = (i + 1) - newPlayer.correctCount;
        newPlayer.correctRate = newPlayer.correctCount / (i + 1);
        newPlayer.results[i] = false;
        return newPlayer;
      }
      newPlayer.results[i] = playerVote.isAnswer;
      if (playerVote.isAnswer) {
        // time bonus would be 0~1000 based on the answering time
        const timeBonus = Math.min(
          Math.max(
            Math.round((gameInterval - playerVote.time) / gameInterval * 1000), 0,
          ), 1000);
        newPlayer.score += (1000 + timeBonus);
        newPlayer.timeBonus = timeBonus;
        newPlayer.correctCount += 1;
      }
      newPlayer.incorrectCount = (i + 1) - newPlayer.correctCount;
      newPlayer.time = playerVote.time;
      newPlayer.correctRate = newPlayer.correctCount / (i + 1);
      return newPlayer;
    });
    newPlayers.sort((a, b) => b.score - a.score);
    newPlayers.forEach((player, j) => {
      const rank = j + 1;
      if (rank > player.rank) {
        player.state = PlayerState.DOWN;
      } else if (rank < player.rank) {
        player.state = PlayerState.UP;
      } else {
        player.state = PlayerState.EQUAL;
      }
      player.rank = rank;
    });
    yield fork(
      db.insertPlayerVotes,
      Object.keys(playerVotes).map((key) => playerVotes[key]));
    yield fork(db.updatePlayers, newPlayers);
    yield put(setPlayers(newPlayers));
    io.emit('GAME_CHANGE', { players: newPlayers });

    yield take(getType(adminShowScore));
    yield put(setStage(Stage.SCORE));
    io.emit('GAME_CHANGE', { stage: Stage.SCORE });
  }
  return true;
}

interface IAddPlayerAction {
  type: '@@CLIENT_ADD_PLAYER';
  socket: any;
  payload: string;
}
function* addPlayerSaga(io: Server) {
  yield takeEvery('@@CLIENT_ADD_PLAYER', function*(action: IAddPlayerAction) {
    const { payload: name, socket } = action;
    const id: string = uuidV4();
    const player: IPlayer = {
      name,
      id,
      score: 0,
      timeBonus: 0,
      rank: 999,
      correctCount: 0,
      incorrectCount: 0,
      correctRate: 0,
      time: 0,
      state: PlayerState.NEW,
      results: Array(config.game.questions.length).fill(null),
      createAt: Date.now(),
    };
    yield put(addPlayer(player));
    const {
      players,
      stage,
      questionIndex,
      playerVotes,
    } = yield select((s: IRootState) => s.game);
    const question = config.game.questions[questionIndex] || {};
    socket.emit('GAME_CHANGE', {
      stage,
      players,
      questionIndex,
      playerVotes,
      curVote: playerVotes[id] || null,
      vote: null,
      player: players.find((p: IPlayer) => p.id === id),
      question: { text: question.text, id: question.id },
      options: question.options,
      answers: question.answers,
    });
    socket.broadcast.emit('GAME_CHANGE', { players });
  });
}

function* checkPlayerSaga() {
  yield takeEvery('@@CLIENT_CHECK_PLAYER', function*(action: any) {
    const { payload: { id }, socket } = action;
    const players: ReadonlyArray<IPlayer> = yield select((s: IRootState) => s.game.players);
    const player = players.find((p) => p.id === id);
    if (player !== undefined) {
      const {
        // tslint:disable-next-line:no-shadowed-variable
        players,
        stage,
        questionIndex,
        playerVotes,
      } = yield select((s: IRootState) => s.game);
      const question = config.game.questions[questionIndex] || {};
      socket.emit('GAME_CHANGE', {
        stage,
        players,
        player,
        questionIndex,
        playerVotes,
        question: { text: question.text, id: question.id },
        options: question.options,
        answers: question.answers,
        vote: null,
        curVote: playerVotes[id] || null,
      });
    } else {
      socket.emit('GAME_CHANGE', { player: null });
    }
  });
}

function* resetGameSaga(io: Server) {
  yield put(setPlayers([]));
  yield put(resetPlayerVote());
  yield fork(db.clearPlayerVotes);
  yield fork(db.clearPlayers);
  yield put(setQuestionIndex({index: 0}));
  yield put(setStage(Stage.JOIN));

  io.emit('GAME_CHANGE', {
    players: [],
    stage: Stage.JOIN,
    question: null,
    options: null,
    answers: null,
    vote: null,
    curVote: null,
    questionIndex: 0,
    playerVotes: {},
  });

  io.to(ROOM_ADM).emit('ADMIN_CHANGE', { playerVotes: {} });
}

function* gameSaga(io: Server) {
  yield fork(addPlayerSaga, io);
  yield fork(checkPlayerSaga);
  while (true) {
    yield call(resetGameSaga, io);
    const result = yield race({
      game: call(gameRound, io),
      resetGame: take('@@ADMIN_RESET_GAME'),
    });
    if (result.game) {
      yield take('@@ADMIN_RESET_GAME');
    }
  }
}

const PLAYER_ANSWER = '@@CLIENT_PLAYER_ANSWER';
const playerAnswer = createStandardAction(PLAYER_ANSWER)<{playerID: string; answerID: string}>();

function* handleAdminCommandSaga(io: Server) {
  yield fork(
    // tslint:disable-next-line:no-shadowed-variable
    function*(io) {
      // clear comments
      yield takeLatest('@@ADMIN_CLEAR_COMMENT', function*() {
        yield fork(db.clearComment);
        yield put(removeComments());
        io.to(ROOM_ADM).emit('ADMIN_CHANGE', { comments: [] });
      });
    },
    io,
  );

  yield fork(
    // tslint:disable-next-line:no-shadowed-variable
    function*(io) {
      // insert new comments
      yield takeEvery<ActionType<typeof adminAddComment>>(getType(adminAddComment), function*(action) {
        console.log('adminAddComment', action.payload.content);
        yield call(handleNewCommentSaga, io, action.payload.content);
      });
    },
    io,
  );

  yield fork(
    // tslint:disable-next-line:no-shadowed-variable
    function*(io) {
      yield takeLatest(
        '@@ADMIN_CHANGE_MODE',
        function*(action: { type: any, payload: Mode }) {
          yield put(setMode(action.payload));
          io.emit('MODE_CHANGE', { mode: action.payload });
        });
    },
    io,
  );

}

function* handleAdminLogin() {
  yield takeEvery('@@ADMIN_LOGIN', function*(action: any) {
    const {
      players,
      stage,
      questionIndex,
      playerVotes,
    } = yield select((s: IRootState) => s.game);
    const question = config.game.questions[questionIndex] || {};
    action.socket.emit('GAME_CHANGE', {
      stage,
      players,
      questionIndex,
      vote: null,
      curVote: null,
      question: { text: question.text, id: question.id },
      options: question.options,
      answers: question.answers,
      playerVotes: {},
    });
    const { comments } = yield select((s: IRootState) => s.comment);
    action.socket.emit('ADMIN_CHANGE', {
      comments,
      playerVotes,
    });
  });
}

export default function createRootSaga(io: Server) {
  return function* rootSaga() {
    yield call(db.init);
    yield call(db.insertQuestions, config.game.questions);
    yield fork(handleClientCommentSaga, io);
    yield fork(slideWorkerSaga, io);
    yield fork(gameSaga, io);
    yield fork(handleAdminLogin);
    yield fork(handleAdminCommandSaga, io);

    const channel = createChannel(io);
    while (true) {
      const { type, payload, socket }: { type: any, payload: any, socket: Socket }
        = yield take(channel);
      if (type === 'NEW_PLAYER') {
        // 新的connection
        const subState: Pick<IRootState, 'mode' | 'slide' | 'game'> =
          yield select((s: IRootState) => {
            const ret = lodash.pick(s, ['mode', 'slide', 'game']);
            return ret;
          });
        socket.emit('SLIDE_CHANGE', subState.slide);
        socket.emit('GAME_CHANGE', { intervalMs: subState.game.intervalMs });
        socket.emit('MODE_CHANGE', { mode: subState.mode });
      } else {
        yield put({ type, payload, socket });
      }
    }
  };
}

function createChannel(io: Server) {
  return eventChannel((emit) => {
    io.on('connection', (socket) => {
      emit({ socket, type: 'NEW_PLAYER' });

      socket.on('action', (action) => {
        if (action.type.startsWith('@@CLIENT_')) {
          emit({ ...action, socket });
        }
      });

      socket.on('admin', (action) => {
        const { password, type, payload } = action;
        const isValid = password === config.admin.password;
        socket.emit('ADMIN_CHANGE', { login: isValid });
        if (isValid) {
          socket.join(ROOM_ADM);
          emit({ type, payload, socket });
        }
      });
    });

    const unsubscribe = () => {
      io.close();
    };
    return unsubscribe;
  });
}
