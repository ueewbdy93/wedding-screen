import { createAction } from 'typesafe-actions';

const NEXT_SLIDE = 'NEXT_SLIDE';

export const nextSlide = createAction(
  NEXT_SLIDE,
  () => ({
    type: NEXT_SLIDE,
  }),
);
