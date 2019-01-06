import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import { config } from '../../config-helper';
import { nextSlide } from './actions';
import { ActionTypes } from './types';

export interface ISlideState {
  readonly pictures: ReadonlyArray<string>;
  readonly index: number;
}

const initPictures: ReadonlyArray<string> = config.slide.urls;

export const slideReducer = combineReducers<ISlideState, ActionTypes>({
  // tslint:disable-next-line:variable-name
  pictures: (state = initPictures, _action) => {
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
