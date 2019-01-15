import { createAction } from 'typesafe-actions';

const NEXT_SLIDE = 'NEXT_SLIDE';

export const nextSlide = createAction(
  NEXT_SLIDE,
  (image: string) => ({
    type: NEXT_SLIDE,
    payload: { image },
  }),
);
