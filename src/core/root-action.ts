import { createAction } from 'typesafe-actions';
import { Mode } from './root-types';
export { Actions as CommentActions } from './comments';
export { Actions as GameActions } from './game';
export { Actions as SlideAction } from './slide';

const SET_MODE = 'SET_MODE';
export const setMode = createAction(
  SET_MODE,
  (mode: Mode) => ({
    mode,
    type: SET_MODE,
  }),
);
