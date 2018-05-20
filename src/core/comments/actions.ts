import { createAction } from 'typesafe-actions';


const ADD_COMMENT = 'ADD_COMMENT';
const REMOVE_COMMENTS = 'REMOVE_COMMENTS';
const SET_CURRENT_ROUND_START_OFFSET = 'SET_CURRENT_ROUND_START_TIME';

export const addComment = createAction(
  ADD_COMMENT,
  (id: string, content: string, offsetSec: number) => ({
    type: ADD_COMMENT,
    payload: {
      id,
      content,
      offsetSec,
    },
  }),
);

export const removeComments = createAction(
  REMOVE_COMMENTS,
  () => ({
    type: REMOVE_COMMENTS,
  }),
);


export const setCurrentRoundStartOffset = createAction(
  SET_CURRENT_ROUND_START_OFFSET,
  (offset:number) => ({
    type: SET_CURRENT_ROUND_START_OFFSET,
    payload: {
      offset,
    },
  }),
);
