import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import { config } from '../../config';
import { nextSlide } from './actions';
import { ActionTypes } from './types';

export type SlideState = {
  readonly pictures: ReadonlyArray<string>,
  readonly index: number,
};

const initPictures: ReadonlyArray<string> = config.slide.urls;


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
