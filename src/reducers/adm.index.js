import { combineReducers } from 'redux';
import GameReducer from './game';
import SlideReducer from './slide';
import CommonReducer from './common';
import AdmReducer from './adm';

export default combineReducers({
  common: CommonReducer,
  game: GameReducer,
  slide: SlideReducer,
  admin: AdmReducer
});
