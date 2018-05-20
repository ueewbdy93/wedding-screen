import lodash from 'lodash';
import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import { config } from '../../config';
import { addPlayer, nextQuestion, setQuestionIndex, setStage, updatePlayerScore } from './actions';
import { ActionTypes, GameState, Stage } from './types';

export const gameReducer = combineReducers<GameState, ActionTypes>({
  players: (state = [], action) => {
    switch (action.type) {
      case getType(addPlayer):
        return state.concat(action.payload);
      case getType(updatePlayerScore): {
        const playerIndex = state.findIndex((p) => p.id === action.payload.playerID);
        if (playerIndex !== -1) {
          const player = { ...state[playerIndex] };
          player.score = action.payload.score;
          return [...state.slice(0, playerIndex), player, ...state.slice(playerIndex + 1)];
        }
        return state;
      }
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
  questions: (state = config.game.questions, action) => {
    return state;
  },
  questionIndex: (state = 0, action) => {
    switch (action.type) {
      case getType(nextQuestion):
        return (state + 1) % 10;
      case getType(setQuestionIndex):
        return action.payload.index;
      default:
        return state;
    }
  },
  rank: (state = [], action) => {
    return state;
  },
});
