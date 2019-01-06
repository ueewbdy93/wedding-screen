import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import { config } from '../../config-helper';
import {
  addPlayer,
  resetPlayerVote,
  setPlayers,
  setQuestionIndex,
  setStage,
  updatePlayerVote,
} from './actions';
import { ActionTypes, GameState, Stage } from './types';

export const gameReducer = combineReducers<GameState, ActionTypes>({
  // tslint:disable-next-line:variable-name
  intervalMs: (state = config.game.intervalMs, _action) => {
    return state;
  },
  playerVotes: (state = {}, action) => {
    switch (action.type) {
      case getType(updatePlayerVote): {
        return {
          ...state,
          [action.payload.playerId]: action.payload,
        };
      }
      case getType(resetPlayerVote): {
        return {};
      }
      default:
        return state;
    }
  },
  players: (state = [], action) => {
    switch (action.type) {
      case getType(addPlayer):
        return state.concat(action.payload);
      case getType(setPlayers):
        return action.payload;
      default:
        return state;
    }
  },
  stage: (state = Stage.JOIN, action) => {
    switch (action.type) {
      case getType(setStage):
        return action.stage;
      default:
        return state;
    }
  },
  questionIndex: (state = 0, action) => {
    switch (action.type) {
      case getType(setQuestionIndex):
        return action.payload.index;
      default:
        return state;
    }
  },
});
