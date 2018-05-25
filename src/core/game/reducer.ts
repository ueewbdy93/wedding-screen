import lodash from 'lodash';
import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import { config } from '../../config';
import {
  addPlayer,
  nextQuestion,
  resetPlayerAnswers,
  setQuestionIndex,
  setRank,
  setStage,
  updatePlayerAnswer,
  updatePlayerScore,
} from './actions';
import { ActionTypes, GameState, PlayerAnswer, PlayerAnswers, Stage } from './types';

export const gameReducer = combineReducers<GameState, ActionTypes>({
  playerAnswers: (state = Array(config.game.questions.length).fill({}), action) => {
    switch (action.type) {
      case getType(resetPlayerAnswers):
        return Array(config.game.questions.length).fill({});
      case getType(updatePlayerAnswer): {
        const { questionIndex, playerID } = action.payload;
        const playerAnswers = state[questionIndex];
        return [
          ...state.slice(0, questionIndex),
          { ...playerAnswers, [playerID]: action.payload },
          ...state.slice(questionIndex + 1),
        ];
      }
      default:
        return state;
    }
  },
  players: (state = [], action) => {
    switch (action.type) {
      case getType(addPlayer):
        return state.concat(action.payload);
      case getType(updatePlayerScore):
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
  questions: (state = config.game.questions, action) => {
    return state;
  },
  questionIndex: (state = 0, action) => {
    switch (action.type) {
      case getType(nextQuestion):
        return (state + 1) % config.game.questions.length;
      case getType(setQuestionIndex):
        return action.payload.index;
      default:
        return state;
    }
  },
  rank: (state = [], action) => {
    switch (action.type) {
      case getType(setRank):
        return action.payload.rank;
    }
    return state;
  },
});
