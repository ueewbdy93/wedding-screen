import lodash from 'lodash';
import { delay, eventChannel, takeEvery, takeLatest } from 'redux-saga';
import { call, fork, put, race, select, take } from 'redux-saga/effects';
import { createAction, getType } from 'typesafe-actions';
import uuid from 'uuid';
import { config } from '../config';
import db from '../db';
import { CommentState } from './comments';
import { addComment, removeComments, setCurrentRoundStartTime } from './comments/actions';
import { Comment } from './comments/types';
import {
  addPlayer,
  resetPlayerVote,
  setPlayers,
  setQuestionIndex,
  setStage,
  updatePlayerVote,
} from './game/actions';
import {
  Player,
  PlayerState,
  PlayerVote,
  Stage,
} from './game/types';
import { setMode } from './root-action';
import { RootState } from './root-reducer';
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
const clientAddComment = createAction(
  CLIENT_ADD_COMMENT,
  (content: string) => ({
    type: CLIENT_ADD_COMMENT,
    payload: {
      content,
    },
  }),
);

/**
 * A new comment from admin
 */
const ADMIN_INSERT_COMMENT = '@@ADMIN_INSERT_COMMENT';
const adminAddComment = createAction(
  ADMIN_INSERT_COMMENT,
  (content: string) => ({
    type: ADMIN_INSERT_COMMENT,
    payload: {
      content,
    },
  }),
);

function* handleNewCommentSaga(io: SocketIO.Server, content: string) {
  const curRoundStartTime = yield select<RootState>(
    (s) => s.comment.currentRoundStartTime);
  const comment: Comment = {
    content,
    offset: getProcessUptime() - curRoundStartTime,
    createAt: Date.now(),
  };
  // broadcast to all client
  io.local.emit('SLIDE_CHANGE', { newComment: { ...comment, id: uuid.v1() } });
  io.to(ROOM_ADM).emit('ADMIN_CHANGE', { newComment: { ...comment, id: uuid.v1() } });
  yield put(addComment(comment));
  // save into db
  yield fork(db.insertComment, comment);
}

/**
 * Receive new comment from client
 * @param io
 */
function* handleClientCommentSaga(io: SocketIO.Server) {
  yield takeEvery<$Call<typeof clientAddComment>>(CLIENT_ADD_COMMENT, function* (clientAction) {
    yield call(handleNewCommentSaga, io, clientAction.payload.content);
  });
}

function* commentWorkerSaga(io: SocketIO.Server) {
  const commentState: CommentState = yield select<RootState>((s) => s.comment);
  const { currentRoundStartTime, comments } = commentState;
  if (comments.length === 0) {
    return;
  }
  const sortedComment = [...comments].sort((a, b) => a.offset - b.offset);
  sortedComment.sort((a, b) => a.offset - b.offset);
  yield race({
    clearComments: take('@@ADMIN_CLEAR_COMMENT'),
    sendComments: call(function* () {
      for (const comment of sortedComment) {
        // Calculate time to show next comment
        const now = getProcessUptime();
        const d = comment.offset - (now - currentRoundStartTime);
        yield delay(Math.max(0, d));
        // Broadcast comment to clients
        io.local.emit('SLIDE_CHANGE', { newComment: { ...comment, id: uuid.v1() } });
      }
    }),
  });
}

/**
 * Tell client to show next picture every <config.slide.intervalMS> milliseconds
 */
function* slideWorkerSaga(io: SocketIO.Server) {
  const total: number = yield select<RootState>((s) => s.slide.pictures.length);
  while (true) {
    const curRoundStartTime = getProcessUptime();
    yield put(setCurrentRoundStartTime(curRoundStartTime));
    yield fork(commentWorkerSaga, io);
    for (let i = 0; i < total; i += 1) {
      yield delay(config.slide.intervalMs);
      yield put(nextSlide());
      const currentSlideIndex = yield select<RootState>((s) => s.slide.index);
      io.local.emit('SLIDE_CHANGE', { index: currentSlideIndex });
    }
  }
}

const ADMIN_NEXT_QUESTION = '@@ADMIN_START_QUESTION';
const adminNextQuestion = createAction(
  ADMIN_NEXT_QUESTION,
  () => ({
    type: ADMIN_NEXT_QUESTION,
  }),
);
const ADMIN_START_ANSWER = '@@ADMIN_START_ANSWER';
const adminStartAnswer = createAction(
  ADMIN_START_ANSWER,
  () => ({
    type: ADMIN_START_ANSWER,
  }),
);
const ADMIN_REVEAL_ANSWER = '@@ADMIN_REVEAL_ANSWER';
const adminRevealAnswer = createAction(
  ADMIN_REVEAL_ANSWER,
  () => ({
    type: ADMIN_REVEAL_ANSWER,
  }),
);
const ADMIN_SHOW_SCORE = '@@ADMIN_SHOW_SCORE';
const adminShowScore = createAction(
  ADMIN_SHOW_SCORE,
  () => ({
    type: ADMIN_SHOW_SCORE,
  }),
);

function* syncPlayerVotes(io: SocketIO.Server) {
  while (true) {
    yield delay(800);
    const playerVotes = yield select<RootState>((s) => s.game.playerVotes);
    io.to(ROOM_ADM).emit('ADMIN_CHANGE', { playerVotes });
  }
}

function* gameRound(io: SocketIO.Server) {
  const questionLength = config.game.questions.length;
  for (let i = 0; i < questionLength; i += 1) {
    const question = config.game.questions[i];
    yield take(getType(adminNextQuestion));
    yield put(setQuestionIndex(i));
    yield put(setStage(Stage.START_QUESTION));
    yield put(resetPlayerVote());

    io.local.emit('GAME_CHANGE', {
      stage: Stage.START_QUESTION,
      selectedOption: null,
      answer: null,
      options: [],
      question: {
        text: question.text,
        id: question.id,
      },
      vote: null,
      curVote: null,
    });

    io.to(ROOM_ADM).emit('ADMIN_CHANGE', { question });

    yield take(getType(adminStartAnswer));
    yield put(setStage(Stage.START_ANSWER));

    io.local.emit('GAME_CHANGE', {
      stage: Stage.START_ANSWER,
      options: question.options,
    });

    const startAnswerTime = Date.now();
    const gameInterval = config.game.intervalMs;
    yield race({
      timeout: delay(gameInterval),
      forceTimeout: take(getType(adminRevealAnswer)),
      syncPlayerVotes: call(syncPlayerVotes, io),
      playerAnswer: call(function* () {
        while (true) {
          const action = yield take(getType(playerAnswer));

          const { playerID, answerID } = action.payload;
          const playerVote = {
            playerId: playerID,
            questionId: question.id,
            optionId: answerID,
            time: Math.max(0, Date.now() - startAnswerTime),
            isAnswer: question.answer.id === answerID,
          };
          yield put(updatePlayerVote(playerVote));
          action.socket.emit('GAME_CHANGE', { curVote: playerVote });
        }
      }),
    });

    yield put(setStage(Stage.REVEAL_ANSWER));

    io.local.emit('GAME_CHANGE', {
      stage: Stage.REVEAL_ANSWER,
      answer: question.answer,
    });

    const [playerVotes, players]: [{ [key: string]: PlayerVote }, ReadonlyArray<Player>]
      = yield select<RootState>((s) => ([s.game.playerVotes, s.game.players]));
    io.to(ROOM_ADM).emit('ADMIN_CHANGE', { playerVotes });

    // calculate score
    const newPlayers = players.map((player: Readonly<Player>) => {
      const playerVote = playerVotes[player.id];
      const newPlayer = { ...player };
      if (playerVote === undefined) {
        newPlayer.incorrectCount = (i + 1) - newPlayer.correctCount;
        newPlayer.correctRate = newPlayer.correctCount / (i + 1);
        return newPlayer;
      }
      if (playerVote.isAnswer) {
        const score = Math.max(Math.round((gameInterval - playerVote.time) / 10), 0);
        newPlayer.score += score;
        newPlayer.correctCount += 1;
      }
      newPlayer.incorrectCount = (i + 1) - newPlayer.correctCount;
      newPlayer.time = playerVote.time;
      newPlayer.correctRate = newPlayer.correctCount / (i + 1);
      return newPlayer;
    });
    newPlayers.sort((a, b) => b.score - a.score);
    newPlayers.forEach((player, i) => {
      const rank = i + 1;
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
    io.local.emit('GAME_CHANGE', { players: newPlayers });

    yield take(getType(adminShowScore));
    yield put(setStage(Stage.SCORE));
    io.local.emit('GAME_CHANGE', { stage: Stage.SCORE });
  }
  return true;
}

type addPlayerAction = {
  type: '@@CLIENT_ADD_PLAYER',
  socket: any;
  payload: string;
};
function* addPlayerSaga(io: SocketIO.Server) {
  yield takeEvery('@@CLIENT_ADD_PLAYER', function* (action: addPlayerAction) {
    const { payload: name, socket } = action;
    const id: string = uuid.v4();
    const player: Player = {
      name,
      id,
      score: 0,
      rank: 999,
      correctCount: 0,
      incorrectCount: 0,
      correctRate: 0,
      time: 0,
      state: PlayerState.NEW,
      createAt: Date.now(),
    };
    yield put(addPlayer(player));
    const {
      players,
      stage,
      questionIndex,
      playerVotes,
    } = yield select<RootState>((s) => s.game);
    io.local.emit('GAME_CHANGE', { players });
    const question = config.game.questions[questionIndex] || {};
    socket.emit('GAME_CHANGE', {
      stage,
      players,
      curVote: playerVotes[id] || null,
      vote: null,
      player: players.find((p: Player) => p.id === id),
      question: { text: question.text, id: question.id },
      options: question.options,
      answer: question.answer,
    });
  });
}

function* checkPlayerSaga() {
  yield takeEvery('@@CLIENT_CHECK_PLAYER', function* (action: any) {
    const { payload: { id }, socket } = action;
    const players: ReadonlyArray<Player> = yield select<RootState>((s) => s.game.players);
    const player = players.find((player) => player.id === id);
    if (player !== undefined) {
      const {
        players,
        stage,
        questionIndex,
        playerVotes,
      } = yield select<RootState>((s) => s.game);
      const question = config.game.questions[questionIndex] || {};
      socket.emit('GAME_CHANGE', {
        stage,
        players,
        player,
        question: { text: question.text, id: question.id },
        options: question.options,
        answer: question.answer,
        vote: null,
        curVote: playerVotes[id] || null,
      });
    } else {
      socket.emit('GAME_CHANGE', { player: null });
    }
  });
}

function* resetGameSaga(io: SocketIO.Server) {
  yield put(setPlayers([]));
  yield put(resetPlayerVote());
  yield fork(db.clearPlayerVotes);
  yield fork(db.clearPlayers);
  yield put(setQuestionIndex(0));
  yield put(setStage(Stage.JOIN));

  io.local.emit('GAME_CHANGE', {
    players: [],
    stage: Stage.JOIN,
    question: null,
    options: null,
    answer: null,
    vote: null,
    curVote: null,
  });

  io.to(ROOM_ADM).emit('ADMIN_CHANGE', { playerVotes: {} });
}

function* gameSaga(io: SocketIO.Server) {
  yield fork(addPlayerSaga, io);
  yield fork(checkPlayerSaga, io);
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
const playerAnswer = createAction(
  PLAYER_ANSWER,
  (playerID: string, answerID: string) => ({
    type: PLAYER_ANSWER,
    payload: {
      playerID,
      answerID,
    },
  }),
);

function* handleAdminCommandSaga(io: SocketIO.Server) {
  yield fork(
    function* (io) {
      // clear comments
      yield takeLatest('@@ADMIN_CLEAR_COMMENT', function* () {
        yield fork(db.clearComment);
        yield put(removeComments());
        io.to(ROOM_ADM).emit('ADMIN_CHANGE', { comments: [] });
      });
    },
    io,
  );

  yield fork(
    function* (io) {
      // insert new comments
      yield takeEvery<$Call<typeof adminAddComment>>(ADMIN_INSERT_COMMENT, function* (action) {
        yield call(handleNewCommentSaga, io, action.payload.content);
      });
    },
    io,
  );

  yield fork(
    function* (io) {
      yield takeLatest(
        '@@ADMIN_CHANGE_MODE',
        function* (action: { type: any, payload: Mode }) {
          yield put(setMode(action.payload));
          io.local.emit('MODE_CHANGE', { mode: action.payload });
        });
    },
    io,
  );

}

function* handleAdminLogin() {
  yield takeEvery('@@ADMIN_LOGIN', function* (action: any) {
    const {
      players,
      stage,
      questionIndex,
      playerVotes,
    } = yield select<RootState>((s) => s.game);
    const question = config.game.questions[questionIndex] || {};
    action.socket.emit('GAME_CHANGE', {
      stage,
      players,
      vote: null,
      curVote: null,
      question: { text: question.text, id: question.id },
      options: question.options,
      answer: question.answer,
    });
    const { comments } = yield select<RootState>((s) => s.comment);
    action.socket.emit('ADMIN_CHANGE', {
      comments,
      playerVotes,
    });
  });
}

export default function createRootSaga(io: SocketIO.Server) {
  return function* rootSaga() {
    yield call(db.insertQuestions, config.game.questions);
    yield fork(handleClientCommentSaga, io);
    yield fork(slideWorkerSaga, io);
    yield fork(gameSaga, io);
    yield fork(handleAdminLogin);
    yield fork(handleAdminCommandSaga, io);

    const channel = createChannel(io);
    while (true) {
      const { type, payload, socket }: { type: any, payload: any, socket: SocketIO.Socket }
        = yield take(channel);
      if (type === 'NEW_PLAYER') {
        // 新的connection
        const subState: Pick<RootState, 'mode' | 'slide' | 'game'> =
          yield select<RootState>((s) => {
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


function createChannel(io: SocketIO.Server) {
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
