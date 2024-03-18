import { combineReducers } from "redux";
import { getType, ActionType } from "typesafe-actions";
import {
  ActionTypes as CommentsActionTypes,
  commentsReducer,
} from "./comments";
import * as clickGameActions from "./click-game/action";
import clickGameReducer from "./click-game/reducer";
import { ActionTypes as GameActionTypes, gameReducer } from "./game";
import { setMode } from "./root-action";
import { Mode } from "./root-types";
import { ActionTypes as SlideActionTypes, slideReducer } from "./slide";

export type RootAction =
  | CommentsActionTypes
  | SlideActionTypes
  | GameActionTypes
  | ActionType<{ setMode: typeof setMode }>
  | ActionType<typeof clickGameActions>;

export const rootReducer = combineReducers({
  comment: commentsReducer,
  slide: slideReducer,
  game: gameReducer,
  clickGame: clickGameReducer,
  mode: (state: Mode = Mode.Slide, action: RootAction) => {
    switch (action.type) {
      case getType(setMode):
        return action.payload;
      default:
        return state;
    }
  },
});
