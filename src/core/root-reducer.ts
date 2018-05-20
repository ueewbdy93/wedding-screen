
import { combineReducers, Reducer } from 'redux';
import { getType } from 'typesafe-actions';
import { $Call } from 'utility-types';
import { commentsReducer, ActionTypes as CommentsActionTypes, CommentState } from './comments';
import { gameReducer, ActionTypes as GameActionTypes, GameState } from './game';
import { setMode } from './root-action';
import { Mode } from './root-types';
import {
  slideReducer,
  Actions as SlideAction,
  ActionTypes as SlideActionTypes,
  SlideState,
} from './slide';

interface StoreEnhancerState { }
export type RootAction = CommentsActionTypes |
  SlideActionTypes |
  GameActionTypes |
  $Call<typeof setMode>;

export interface RootState extends StoreEnhancerState {
  comment: CommentState;
  slide: SlideState;
  game: GameState;
  mode: Mode;
}

export const rootReducer: Reducer<RootState, RootAction> = combineReducers<RootState, any>({
  comment: commentsReducer,
  slide: slideReducer,
  game: gameReducer,
  mode: (state = Mode.Slide, action: RootAction) => {
    switch (action.type) {
      case getType(setMode):
        return action.mode;
      default:
        return state;
    }
  },
});

