import { createAction } from 'typesafe-actions';
import uuid from 'uuid';
import { Player, Stage } from './types';

const NEXT_QUESTION = 'NEXT_QUESTION';
const SET_QUESTION_INDEX = 'SET_QUESTION_INDEX';

export const nextQuestion = createAction(
  NEXT_QUESTION,
  () => ({
    type: NEXT_QUESTION,
  }),
);

export const setQuestionIndex = createAction(
  SET_QUESTION_INDEX,
  (index: number) => ({
    type: SET_QUESTION_INDEX,
    payload: {
      index,
    },
  }),
);

const ADD_PLAYER = 'ADD_PLAYER';
const UPDATE_PLAYER_SCORE = 'UPDATE_PLAYER_SCORE';
export const addPlayer = createAction(
  ADD_PLAYER,
  (id, name) => ({
    type: ADD_PLAYER,
    payload: {
      name,
      id,
      score: 0,
    },
  }),
);

const RESET_PLAYER_ANSWERS = 'RESET_PLAYER_ANSWERS';
export const resetPlayerAnswers = createAction(
  RESET_PLAYER_ANSWERS,
  () => ({
    type: RESET_PLAYER_ANSWERS,
  }),
);

export const updatePlayerScore = createAction(
  UPDATE_PLAYER_SCORE,
  (players: Player[]) => ({
    type: UPDATE_PLAYER_SCORE,
    payload: players,
  }),
);

const SET_RANK = 'SET_RANK';
export const setRank = createAction(
  SET_RANK,
  (rank: Player[]) => ({
    type: SET_RANK,
    payload: { rank },
  }),
);

const UPDATE_PLAYER_ANSWER = 'UPDATE_PLAYER_ANSWER';
export const updatePlayerAnswer = createAction(
  UPDATE_PLAYER_ANSWER,
  (playerID: string, optionID: string, questionIndex: number, createTime: number) => ({
    type: UPDATE_PLAYER_ANSWER,
    payload: {
      playerID,
      optionID,
      questionIndex,
      createTime,
    },
  }),
);

const SET_STAGE = 'SET_STAGE';
export const setStage = createAction(
  SET_STAGE,
  (stage: Stage) => ({
    stage,
    type: SET_STAGE,
  }),
);
