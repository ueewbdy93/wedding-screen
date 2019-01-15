import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import { config } from '../../config-helper';
import { nextSlide } from './actions';
import { ActionTypes } from './types';

export interface ISlideState {
  readonly images: ReadonlyArray<string>;
  readonly curImage: string;
}

const initImages: ReadonlyArray<string> = config.slide.images;

export const slideReducer = combineReducers<ISlideState, ActionTypes>({
  // tslint:disable-next-line:variable-name
  images: (state = initImages, _action) => {
    return state;
  },
  curImage: (state = initImages[0], action) => {
    switch (action.type) {
      case getType(nextSlide):
        return action.payload.image;
      default:
        return state;
    }
  },
});
