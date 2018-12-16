import { createAction } from 'typesafe-actions';
import { Player, PlayerVote, Stage } from './types';

const SET_QUESTION_INDEX = 'SET_QUESTION_INDEX';
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
export const addPlayer = createAction(
  ADD_PLAYER,
  (player) => ({
    type: ADD_PLAYER,
    payload: player,
  }),
);

const SET_PLAYERS = 'SET_PLAYERS';
export const setPlayers = createAction(
  SET_PLAYERS,
  (players: Player[]) => ({
    type: SET_PLAYERS,
    payload: players,
  }),
);

const UPDATE_PLAYER_VOTE = 'UPDATE_PLAYER_VOTE';
export const updatePlayerVote = createAction(
  UPDATE_PLAYER_VOTE,
  (playerVote: PlayerVote) => ({
    type: UPDATE_PLAYER_VOTE,
    payload: playerVote,
  }),
);

const RESET_PLAYER_VOTE = 'RESET_PLAYER_VOTE';
export const resetPlayerVote = createAction(
  RESET_PLAYER_VOTE,
  () => ({ type: RESET_PLAYER_VOTE }),
);

const SET_STAGE = 'SET_STAGE';
export const setStage = createAction(
  SET_STAGE,
  (stage: Stage) => ({
    stage,
    type: SET_STAGE,
  }),
);
