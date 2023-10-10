
import { combineReducers } from 'redux';
import { getType, ActionType } from 'typesafe-actions';
import { ActionTypes as CommentsActionTypes, commentsReducer, ICommentState } from './comments';
import { ActionTypes as GameActionTypes, gameReducer, GameState } from './game';
import { setMode } from './root-action';
import { Mode } from './root-types';
import {
  ActionTypes as SlideActionTypes,
  slideReducer,
  SlideState,
} from './slide';

export type RootAction = CommentsActionTypes |
  SlideActionTypes |
  GameActionTypes |
  ActionType< {setMode: typeof setMode}>;

export interface IRootState {
  comment: ICommentState;
  slide: SlideState;
  game: GameState;
  mode: Mode;
}

export const rootReducer = combineReducers({
  comment: commentsReducer,
  slide: slideReducer,
  game: gameReducer,
  mode: (state = Mode.Slide, action: RootAction) => {
    switch (action.type) {
      case getType(setMode):
        return action.payload;
      default:
        return state;
    }
  },
});
