
import { combineReducers } from 'redux';
import { $Call } from 'utility-types';
import { commentsReducer, ActionTypes as CommentsActionTypes, CommentState } from './comments';
import {
  slideReducer,
  Actions as SlideAction,
  ActionTypes as SlideActionTypes,
  SlideState,
} from './slide';

interface StoreEnhancerState { }
export type RootAction = CommentsActionTypes | SlideActionTypes;



export interface RootState extends StoreEnhancerState {
  comments: CommentState;
  slide: SlideState;
}

export const rootReducer = combineReducers<RootState, any>({
  comments: commentsReducer,
  slide: slideReducer,
});

