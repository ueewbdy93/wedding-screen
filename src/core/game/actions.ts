import { createAction } from 'typesafe-actions';
import uuid from 'uuid';
import { Stage } from './types';

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
  (name) => ({
    type: ADD_PLAYER,
    payload: {
      name,
      id: uuid.v1(),
      score: 0,
    },
  }),
);

export const updatePlayerScore = createAction(
  UPDATE_PLAYER_SCORE,
  (playerID: string, score: number) => ({
    type: UPDATE_PLAYER_SCORE,
    payload:{
      playerID,
      score,
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
