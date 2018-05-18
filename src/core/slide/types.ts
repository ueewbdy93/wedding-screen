import { $Call } from 'utility-types';
import { nextSlide } from './actions';

export type ActionTypes = $Call<
  typeof nextSlide
>;
