import lodash from 'lodash';
import { delay, eventChannel, takeEvery } from 'redux-saga';
import { call, fork, put, race, select, take } from 'redux-saga/effects';
import { createAction, getType } from 'typesafe-actions';
import uuid from 'uuid';
import { config } from '../config';
import { addComment, removeComments, setCurrentRoundStartOffset } from './comments/actions';
import { Comment } from './comments/types';
import { nextQuestion, setQuestionIndex, setStage, updatePlayerScore } from './game/actions';
import { Player, Question, Stage } from './game/types';
import { setMode } from './root-action';
import { RootState } from './root-reducer';
import { Mode } from './root-types';
import { nextSlide } from './slide/actions';

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
    if (allComment.length > 0) {
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

function* gameRound(io: SocketIO.Server) {
  for (let i = 0; i < config.game.questions.length; i += 1) {
    yield take(getType(adminNextQuestion));
    yield put(nextQuestion());
    yield put(setStage(Stage.START_QUESTION));

    const { questions, questionIndex } = yield select<RootState>((s) => s.game);
    io.local.emit('GAME_CHANGE', {
      stage: Stage.START_QUESTION,
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

    const startTime = process.uptime();
    const { timeout, forceTimeout, answer } = yield race({
      timeout: delay(config.game.intervalMs),
      forceTimeout: take(getType(adminRevealAnswer)),
      playerAnswer: call(function* () {
        while (true) {
          const action: $Call<typeof playerAnswer> = yield take(getType(playerAnswer));

          const { playerID, answerID } = action.payload;
          // add score for player

          const { player, question }: { player?: Player, question: Question }
            = yield select<RootState>((s) => {
              const player = s.game.players.find((p) => p.id === playerID);
              const question = s.game.questions[s.game.questionIndex];
              return { player, question };
            });

          if (player === undefined) {
            continue;
          }

          let score = player.score;
          if (answerID === question.answer.id) {
            score += config.game.intervalMs - (process.uptime() - startTime) * 1000;
          }

          yield put(updatePlayerScore(player.id, score));
        }
      }),
    });

    yield put(setStage(Stage.REVEAL_ANSWER));

    io.local.emit('GAME_CHANGE', {
      stage: Stage.REVEAL_ANSWER,
      answer: questions[questionIndex].answer,
    });

    yield take(getType(adminShowScore));
    yield put(setStage(Stage.SCORE));

    const { rank } = yield select<RootState>((s) => s.game);
    io.local.emit('GAME_CHANGE', {
      rank,
      stage: Stage.SCORE,
    });
  }

  const { rank } = yield select<RootState>((s) => s.game);
  yield put(setStage(Stage.FINAL));
  io.local.emit('GAME_CHANGE', {
    rank,
    stage: Stage.FINAL,
  });
}

function* gameSaga(io: SocketIO.Server) {
  while (true) {
    yield take(getType(adminChangeMode));
    yield put(setMode(Mode.Game));
    yield put(setQuestionIndex(-1));
    io.local.emit('GAME_CHANGE', { stage: Stage.JOIN });
    io.local.emit('MODE_CHANGE', { mode: Mode.Game });
    yield race({
      changeMode: take(getType(adminChangeMode)),
      game: call(gameRound, io),
    });
    yield put(setMode(Mode.Slide));
    io.local.emit('MODE_CHANGE', { mode: Mode.Slide });
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
      const { type, payload } = yield take(channel);
      if (type === 'NEW_PLAYER') {
        const { socket }: { socket: SocketIO.Socket } = payload;
        const subState = yield select<RootState>((s) => {
          const ret = lodash.pick(s, ['mode', 'slide', 'game']);
          return ret;
        });
        socket.emit('SLIDE_CHANGE', subState.slide);
        const { questions, questionIndex } = subState.game;
        socket.emit('GAME_CHANGE', {});
        socket.emit('MODE_CHANGE', { mode: subState.mode });
      } else {
        yield put({ type, payload });
      }
    }
  };
}


function createChannel(io: SocketIO.Server) {
  return eventChannel((emit) => {
    io.on('connection', (socket) => {
      emit({ type: 'NEW_PLAYER', payload: { socket } });

      socket.on('action', (action) => {
        emit(action);
      });
    });

    const unsubscribe = () => {
      io.close();
    };
    return unsubscribe;
  });
}
