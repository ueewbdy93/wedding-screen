import { createAction } from 'typesafe-actions';
import { IComment } from './types';

const ADD_COMMENT = 'ADD_COMMENT';
const REMOVE_COMMENTS = 'REMOVE_COMMENTS';
const SET_CURRENT_ROUND_START_OFFSET = 'SET_CURRENT_ROUND_START_TIME';

export const addComment = createAction(
  ADD_COMMENT,
  (comment: IComment) => ({
    type: ADD_COMMENT,
    payload: comment,
  }),
);

export const removeComments = createAction(
  REMOVE_COMMENTS,
  () => ({
    type: REMOVE_COMMENTS,
  }),
);

export const setCurrentRoundStartTime = createAction(
  SET_CURRENT_ROUND_START_OFFSET,
  (offset: number) => ({
    type: SET_CURRENT_ROUND_START_OFFSET,
    payload: {
      offset,
    },
  }),
);
