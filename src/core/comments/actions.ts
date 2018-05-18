import { createAction } from 'typesafe-actions';


const ADD_COMMENT = 'ADD_COMMENT';
const REMOVE_COMMENTS = 'REMOVE_COMMENTS';

export const addComment = createAction(
  ADD_COMMENT,
  (comment: string) => ({
    type: ADD_COMMENT,
    payload: {
      comment,
    },
  }),
);

export const removeComments = createAction(
  REMOVE_COMMENTS,
  (comment: string) => ({
    type: REMOVE_COMMENTS,
    payload: {
      comment,
    },
  }),
);
