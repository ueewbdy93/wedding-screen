import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import { config } from '../../config';
import { nextSlide } from './actions';
import { ActionTypes } from './types';

type picture = { origin: string, blur: string };

export type SlideState = {
  readonly pictures: ReadonlyArray<picture>,
  readonly index: number,
};

const initPictures: ReadonlyArray<picture> = config.slide.urls;


export const slideReducer = combineReducers<SlideState, ActionTypes>({
  pictures: (state = initPictures, action) => {
    return state;
  },
  index: (state = 0, action) => {
    switch (action.type) {
      case getType(nextSlide):
        return (state + 1) % initPictures.length;
      default:
        return state;
    }
  },
});
