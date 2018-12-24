
import { combineReducers, Reducer } from 'redux';
import { getType } from 'typesafe-actions';
import { $Call } from 'utility-types';
import { ActionTypes as CommentsActionTypes, commentsReducer, ICommentState } from './comments';
import { ActionTypes as GameActionTypes, gameReducer, GameState } from './game';
import { setMode } from './root-action';
import { Mode } from './root-types';
import {
  ActionTypes as SlideActionTypes,
  slideReducer,
  SlideState,
} from './slide';

// tslint:disable-next-line:no-empty-interface
interface IStoreEnhancerState { }
export type RootAction = CommentsActionTypes |
  SlideActionTypes |
  GameActionTypes |
  $Call<typeof setMode>;

export interface IRootState extends IStoreEnhancerState {
  comment: ICommentState;
  slide: SlideState;
  game: GameState;
  mode: Mode;
}

export const rootReducer: Reducer<IRootState, RootAction> = combineReducers<IRootState, any>({
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
