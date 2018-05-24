import lodash from 'lodash';
import { delay, eventChannel, takeEvery } from 'redux-saga';
import { call, fork, put, race, select, take } from 'redux-saga/effects';
import { createAction, getType } from 'typesafe-actions';
import uuid from 'uuid';
import { config } from '../config';
import { addComment, removeComments, setCurrentRoundStartOffset } from './comments/actions';
import { Comment } from './comments/types';
import {
  addPlayer,
  nextQuestion,
  resetPlayerAnswers,
  setQuestionIndex,
  setRank,
  setStage,
  updatePlayerScore,
  updatePlayerSelectedOption,
} from './game/actions';
import { GameState, Player, PlayerAnswers, Question, Stage } from './game/types';
import logger from './logger';
import { setMode } from './root-action';
import { RootState } from './root-reducer';
import { Mode } from './root-types';
import { nextSlide } from './slide/actions';

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

function* handleClientCommentSaga(io: SocketIO.Server) {
  const ADD_COMMENT = getType(addComment);
  yield takeEvery<$Call<typeof clientAddComment>>(CLIENT_ADD_COMMENT, function* (clientAction) {
    const currentRoundStartOffset = yield select<RootState>(
      (s) => s.comment.currentRoundStartOffset);
    const action = addComment(
      uuid.v1(),
      clientAction.payload.content,
      process.uptime() - currentRoundStartOffset);
    io.local.emit('SLIDE_CHANGE', { newComment: action.payload }); // broadcast to all client
    yield put(action);
  });
}

function* commentWorkerSaga() {
  while (true) {
    yield put(setCurrentRoundStartOffset(process.uptime()));

    const allComment: ReadonlyArray<Comment> = yield select<RootState>((s) => s.comment.comments);
    if (allComment.length === 0) {
      // delay for next round
      yield delay(config.slide.oneRoundMs);
    } else {
      yield put(removeComments());
      const currRoundStartOffsetSec = yield select<RootState>(
        (s) => s.comment.currentRoundStartOffset);
      for (const comment of allComment) {
        const d = (currRoundStartOffsetSec + comment.offsetSec - process.uptime()) * 1000;
        yield delay(d);
        yield put(clientAddComment(comment.content));
      }

      // (currRoundStartOffsetSec + config.slide.oneRoundMs / 1000 - process.uptime()) * 1000
      const d = (currRoundStartOffsetSec - process.uptime()) * 1000 + config.slide.oneRoundMs;
      yield delay(d);
    }
  }
}

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
  const { players, answer, selectedOption } = yield select<RootState>((s) => ({
    players: s.game.players,
    answer: s.game.questions[questionIndex].answer,
    selectedOption: s.game.selectedOption[questionIndex],
  }));

  const newPlayers: Player[] = players.map((player: Player) => {
    if (!selectedOption || !selectedOption[player.id]) {
      return player;
    }
    const { optionID, createTime } = selectedOption[player.id];
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
          yield put(updatePlayerSelectedOption(playerID, answerID, questionIndex, Date.now()));
          action.socket.emit('GAME_CHANGE', { selectedOption: answerID });
        }
      }),
    });

    yield put(setStage(Stage.REVEAL_ANSWER));

    io.local.emit('GAME_CHANGE', {
      stage: Stage.REVEAL_ANSWER,
      answer: questions[questionIndex].answer,
    });

    yield call(calculateScoreSaga, io, questionIndex, startAnswerTime);

    yield take(getType(adminShowScore));
    yield put(setStage(Stage.SCORE));

    const [players, rank]: [Player[], Player[]] = yield select<RootState>((s) => ([
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
      selectedOption,
    } = yield select<RootState>((s) => s.game);
    io.local.emit('GAME_CHANGE', { players });
    const question = questionIndex === -1 ? {} : questions[questionIndex];
    const selectedOptionId = questionIndex !== -1 &&
      selectedOption[questionIndex] &&
      selectedOption[questionIndex][id] ?
      selectedOption[questionIndex][id].optionID : null;
    socket.emit('GAME_CHANGE', {
      stage,
      players,
      rank,
      player: players.find((p: Player) => p.id === id),
      question: { text: question.text, id: question.id },
      options: question.options,
      answer: question.answer,
      selectedOption: selectedOptionId,
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
        selectedOption,
      } = yield select<RootState>((s) => s.game);
      const question = questionIndex === -1 ? {} : questions[questionIndex];
      const selectedOptionId = questionIndex !== -1 &&
        selectedOption[questionIndex] &&
        selectedOption[questionIndex][id] ?
        selectedOption[questionIndex][id].optionID : null;
      socket.emit('GAME_CHANGE', {
        stage,
        players,
        rank,
        player: players.find((p: Player) => p.id === id),
        question: { text: question.text, id: question.id },
        options: question.options,
        answer: question.answer,
        selectedOption: selectedOptionId,
      });
    } else {
      socket.emit('GAME_CHANGE', { player: null });
    }
  });
}

function* resetGameSaga(io: SocketIO.Server) {
  const [players, selectedOption]: [Player[], PlayerAnswers[]] = yield select<RootState>((s) => (
    [s.game.players, s.game.selectedOption]
  ));
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
  });
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

export default function createRootSaga(io: SocketIO.Server) {
  return function* rootSaga() {
    yield fork(handleClientCommentSaga, io);
    yield fork(commentWorkerSaga);
    yield fork(slideWorkerSaga, io);
    yield fork(gameSaga, io);

    const channel = createChannel(io);
    while (true) {
      const { type, payload, socket }: { type: any, payload: any, socket: SocketIO.Socket }
        = yield take(channel);
      if (type === 'NEW_PLAYER') {
        const subState = yield select<RootState>((s) => {
          const ret = lodash.pick(s, ['mode', 'slide', 'game']);
          return ret;
        });
        socket.emit('SLIDE_CHANGE', subState.slide);
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
        const { password, type, payload } = action;
        socket.emit('ADMIN_CHANGE', { login: password === config.admin.password });
        if (type !== '@@ADMIN_LOGIN') {
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
