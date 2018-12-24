import { combineReducers } from 'redux';
import GameReducer from './game';
import SlideReducer from './slide';
import CommonReducer from './common';

export default combineReducers({
  common: CommonReducer,
  game: GameReducer,
  slide: SlideReducer
});
