import lodash from 'lodash';
import { delay, eventChannel, takeEvery, takeLatest } from 'redux-saga';
import { call, fork, put, race, select, take } from 'redux-saga/effects';
import { createAction, getType } from 'typesafe-actions';
import uuid from 'uuid';
import { config } from '../config';
import { setCurrentRoundStartTime } from './comments/actions';
import {
  addPlayer,
  nextQuestion,
  resetPlayerAnswers,
  setQuestionIndex,
  setRank,
  setStage,
  updatePlayerAnswer,
  updatePlayerScore,
} from './game/actions';
import { GameState, Player, PlayerAnswers, Question, Stage } from './game/types';
import logger from './logger';
import { setMode } from './root-action';
import { RootState } from './root-reducer';
import { Mode } from './root-types';
import { nextSlide } from './slide/actions';
import {
  insertComment,
  listComment,
  clearComment,
  insertQuestions,
  insertVote,
  listVote,
} from '../db';
import { start } from 'repl';

const ROOM_ADM = 'ADM';

/**
 * Get process start time in milli-sencond
 */
function getProcessUptime() {
  return process.uptime() * 1000;
}

const CLIENT_CHECK_PLAYER = '@@CLIENT_CHECK_PLAYER';
const clientCheckPlayer = createAction(
  CLIENT_CHECK_PLAYER,
  (id: string, name: string) => ({
    type: CLIENT_CHECK_PLAYER,
    payload: {
      id,
      name,
    },
  }),
);

const CLIENT_ADD_PLAYER = '@@CLIENT_ADD_PLAYER';
const clientAddPlayer = createAction(
  CLIENT_ADD_PLAYER,
  (name: string) => ({
    type: CLIENT_ADD_PLAYER,
    payload: {
      name,
    },
  }),
);

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
  const newComment = {
    id: uuid.v1(),
    content: content,
    offset: getProcessUptime() - curRoundStartTime,
    createAt: Date.now()
  };
  // broadcast to all client
  io.local.emit('SLIDE_CHANGE', { newComment });
  io.to(ROOM_ADM).emit('ADMIN_CHANGE', { newComment });
  // save into db
  yield call(insertComment, newComment.content, newComment.offset, newComment.createAt)
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

/**
 * Replay comments every slideshow round
 * @param io 
 */
function* commentWorkerSaga(io: SocketIO.Server) {
  while (true) {
    const curRoundStartTime = getProcessUptime();
    yield put(setCurrentRoundStartTime(curRoundStartTime));
    const allComment: ResolvedType<typeof listComment> = yield call(listComment);
    if (allComment.length === 0) {
      // wait until next round
      yield delay(config.slide.oneRoundMs);
    } else {
      for (const comment of allComment) {
        // Calculate time to show next comment
        const d = comment.offset - (getProcessUptime() - curRoundStartTime);
        yield delay(Math.max(0, d));
        // Broadcast comment to clients
        io.local.emit('SLIDE_CHANGE', { newComment: { ...comment, id: uuid.v1() } });
      }
      // Calculate the rest time to next round
      const d = config.slide.oneRoundMs - (getProcessUptime() - curRoundStartTime);
      yield delay(Math.max(0, d));
    }
  }
}

/**
 * Tell client to show next picture every <config.slide.intervalMS> milliseconds
 */
function* slideWorkerSaga(io: SocketIO.Server) {
  while (true) {
    yield delay(config.slide.intervalMs);
    yield put(nextSlide());
    const currentSlideIndex = yield select<RootState>((s) => s.slide.index);
    io.local.emit('SLIDE_CHANGE', { index: currentSlideIndex });
  }
}

const ADMIN_CHANGE_MODE = '@@ADMIN_CHANGE_MODE';
const adminChangeMode = createAction(
  ADMIN_CHANGE_MODE,
  () => ({
    type: ADMIN_CHANGE_MODE,
  }),
);

const ADMIN_LIST_COMMENT = '@@ADMIN_LIST_COMMENT';
const adminListComment = createAction(
  ADMIN_LIST_COMMENT,
  () => ({
    type: ADMIN_LIST_COMMENT,
  }),
);

const ADMIN_CLEAR_COMMENT = '@@ADMIN_CLEAR_COMMENT';
const adminClearComment = createAction(
  ADMIN_CLEAR_COMMENT,
  () => ({
    type: ADMIN_CLEAR_COMMENT,
  }),
);

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

function* calculateScoreSaga(io: SocketIO.Server, questionIndex: number, startAnswerTime: number) {
  const { players, answer, playerAnswers } = yield select<RootState>((s) => ({
    players: s.game.players,
    answer: s.game.questions[questionIndex].answer,
    playerAnswers: s.game.playerAnswers[questionIndex],
  }));

  const newPlayers: Player[] = players.map((player: Player) => {
    if (!playerAnswers || !playerAnswers[player.id]) {
      return player;
    }
    const { optionID, createTime } = playerAnswers[player.id];
    if (optionID !== answer.id) {
      return player;
    }
    const weight = Math.min(config.game.intervalMs, Math.max(0, createTime - startAnswerTime));
    const newScore = Math.floor((config.game.intervalMs - weight) / 10);
    return { ...player, score: player.score + newScore };
  });
  yield put(updatePlayerScore(newPlayers));
  yield put(setRank(newPlayers.sort((a, b) => b.score - a.score)));
}

function* gameRound(io: SocketIO.Server) {
  for (let i = 0; i < config.game.questions.length; i += 1) {
    yield take(getType(adminNextQuestion));
    yield put(nextQuestion());
    yield put(setStage(Stage.START_QUESTION));

    const { questions, questionIndex } = yield select<RootState>((s) => s.game);
    io.local.emit('GAME_CHANGE', {
      stage: Stage.START_QUESTION,
      selectedOption: null,
      answer: null,
      options: [],
      question: {
        text: questions[questionIndex].text,
        id: questions[questionIndex].id,
      },
      vote: null
    });

    yield take(getType(adminStartAnswer));
    yield put(setStage(Stage.START_ANSWER));

    io.local.emit('GAME_CHANGE', {
      stage: Stage.START_ANSWER,
      options: questions[questionIndex].options,
    });

    const startAnswerTime = Date.now();
    yield race({
      timeout: delay(config.game.intervalMs),
      forceTimeout: take(getType(adminRevealAnswer)),
      playerAnswer: call(function* () {
        while (true) {
          const action = yield take(getType(playerAnswer));

          const { playerID, answerID } = action.payload;
          // add score for player
          yield put(updatePlayerAnswer(playerID, answerID, questionIndex, Date.now()));
          action.socket.emit('GAME_CHANGE', { selectedOption: answerID });
          io.local.emit('GAME_CHANGE', { vote: { optionId: answerID, playerID: playerID } });
        }
      }),
    });

    yield put(setStage(Stage.REVEAL_ANSWER));

    io.local.emit('GAME_CHANGE', {
      stage: Stage.REVEAL_ANSWER,
      answer: questions[questionIndex].answer,
    });

    const playerAnswers: PlayerAnswers[]
      = yield select<RootState>((s) => (s.game.playerAnswers[questionIndex]));
    io.local.emit('ADMIN_CHANGE', { playerAnswers });

    yield call(calculateScoreSaga, io, questionIndex, startAnswerTime);

    yield take(getType(adminShowScore));
    yield put(setStage(Stage.SCORE));

    const [players, rank]: [Player[], Player[]]
      = yield select<RootState>((s) => ([
        s.game.players,
        s.game.rank,
      ]));
    io.local.emit('GAME_CHANGE', {
      rank,
      players,
      stage: Stage.SCORE,
    });
  }
  const game: GameState = yield select<RootState>((s) => s.game);
  logger.info('The final game state', JSON.stringify(game));
}

function* addPlayerSaga(io: SocketIO.Server) {
  yield takeEvery('@@CLIENT_ADD_PLAYER', function* (action: any) {
    const { payload: name, socket } = action;
    const id = uuid.v1();
    yield put(addPlayer(id, name));
    const {
      players,
      stage,
      questions,
      questionIndex,
      rank,
      playerAnswers,
    } = yield select<RootState>((s) => s.game);
    io.local.emit('GAME_CHANGE', { players });
    const question = questionIndex === -1 ? {} : questions[questionIndex];
    const selectedOption = questionIndex !== -1 &&
      playerAnswers[questionIndex] &&
      playerAnswers[questionIndex][id] ?
      playerAnswers[questionIndex][id].optionID : null;
    socket.emit('GAME_CHANGE', {
      stage,
      players,
      rank,
      selectedOption,
      player: players.find((p: Player) => p.id === id),
      question: { text: question.text, id: question.id },
      options: question.options,
      answer: question.answer,
    });
  });
}

function* checkPlayerSaga() {
  yield takeEvery('@@CLIENT_CHECK_PLAYER', function* (action: any) {
    const { payload: { name, id }, socket } = action;
    const players: ReadonlyArray<Player> = yield select<RootState>((s) => s.game.players);
    if (players.find((player) => player.id === id)) {
      const {
        players,
        stage,
        questions,
        questionIndex,
        rank,
        playerAnswers,
      } = yield select<RootState>((s) => s.game);
      const question = questionIndex === -1 ? {} : questions[questionIndex];
      const selectedOption = questionIndex !== -1 &&
        playerAnswers[questionIndex] &&
        playerAnswers[questionIndex][id] ?
        playerAnswers[questionIndex][id].optionID : null;
      socket.emit('GAME_CHANGE', {
        stage,
        players,
        rank,
        selectedOption,
        player: players.find((p: Player) => p.id === id),
        question: { text: question.text, id: question.id },
        options: question.options,
        answer: question.answer,
      });
    } else {
      socket.emit('GAME_CHANGE', { player: null });
    }
  });
}

function* resetGameSaga(io: SocketIO.Server) {
  const [players]: [Player[]] = yield select<RootState>((s) => ([s.game.players]));
  const newPlayers = players.map((player) => ({ ...player, score: 0 }));
  yield put(updatePlayerScore(newPlayers));
  yield put(setRank(newPlayers.sort((a, b) => b.score - a.score)));
  yield put(resetPlayerAnswers());
  yield put(setQuestionIndex(-1));
  yield put(setStage(Stage.JOIN));

  io.local.emit('GAME_CHANGE', {
    players,
    stage: Stage.JOIN,
    rank: [],
    question: null,
    options: null,
    answer: null,
    vote: null
  });

  io.local.emit('ADMIN_CHANGE', {
    playerAnswers: {}
  })
}

function* gameSaga(io: SocketIO.Server) {
  yield fork(addPlayerSaga, io);
  yield fork(checkPlayerSaga, io);
  while (true) {
    yield take(getType(adminChangeMode));
    yield put(setMode(Mode.Game));
    yield call(resetGameSaga, io);
    io.local.emit('MODE_CHANGE', { mode: Mode.Game });
    const { changeMode } = yield race({
      changeMode: take(getType(adminChangeMode)),
      game: call(gameRound, io),
    });
    if (changeMode) {
      yield put(setMode(Mode.Slide));
      io.local.emit('MODE_CHANGE', { mode: Mode.Slide });
    } else {
      yield take(getType(adminChangeMode));
      yield put(setMode(Mode.Slide));
      io.local.emit('MODE_CHANGE', { mode: Mode.Slide });
    }
  }
}

const PLAYER_ANSWER = '@@PLAYER_ANSWER';
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
  yield fork(function* () {
    // clear comments
    yield takeLatest(ADMIN_CLEAR_COMMENT, function* () {
      yield call(clearComment);
      const comments = yield call(listComment);
      io.to(ROOM_ADM).emit('ADMIN_CHANGE', {
        comments
      });
    })
  }, io);

  yield fork(function* () {
    // insert new comments
    yield takeEvery<$Call<typeof adminAddComment>>(ADMIN_INSERT_COMMENT, function* (action) {
      yield call(handleNewCommentSaga, io, action.payload.content);
    });
  }, io);

}

function* handleAdminLogin() {
  yield takeEvery('@@ADMIN_LOGIN', function* (action: any) {
    const {
      players,
      stage,
      questions,
      questionIndex,
      rank,
      playerAnswers,
    } = yield select<RootState>((s) => s.game);
    const question = questions[questionIndex] || {};
    action.socket.emit('GAME_CHANGE', {
      stage,
      players,
      rank,
      selectedOption: null,
      question: { text: question.text, id: question.id },
      options: question.options,
      answer: question.answer,
    });
    const comments = yield call(listComment);
    action.socket.emit('ADMIN_CHANGE', {
      playerAnswers: playerAnswers[questionIndex] || {},
      comments
    });
  });
}

export default function createRootSaga(io: SocketIO.Server) {
  return function* rootSaga() {
    // yield call(insertQuestions, config.game.questions);
    yield fork(handleClientCommentSaga, io);
    yield fork(commentWorkerSaga, io);
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
        const subState = yield select<RootState>((s) => {
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
        if (action.type === CLIENT_ADD_COMMENT) {
          logger.info('client add comment', action.payload.content);
        }
        emit({ ...action, socket });
      });

      socket.on('admin', (action) => {
        socket.join(ROOM_ADM);
        const { password, type, payload } = action;
        const isValid = password === config.admin.password;
        socket.emit('ADMIN_CHANGE', { login: isValid });
        if (isValid) {
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