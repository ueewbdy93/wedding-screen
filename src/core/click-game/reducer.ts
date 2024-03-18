import { combineReducers } from "redux";
import { ActionType, getType } from "typesafe-actions";

import { IModel } from "./model";
import * as actions from "./action";

export default combineReducers<IModel, ActionType<typeof actions>>({
  state(state = "registering", action) {
    switch (action.type) {
      case getType(actions.setClickGameState):
        return action.payload;
      default:
        return state;
    }
  },
  players(state = [], action) {
    switch (action.type) {
      case getType(actions.addClickGamePlayer): {
        return state.concat(action.payload);
      }
      case getType(actions.setClickGameState): {
        if (action.payload === "registering") {
          return [];
        }
        return state;
      }
      default:
        return state;
    }
  },
  clickEvents(state = [], action) {
    switch (action.type) {
      case getType(actions.addPlayerClicks): {
        return state.concat(action.payload);
      }
      case getType(actions.setClickGameState): {
        if (action.payload === "registering") {
          return [];
        }
        return state;
      }
      default:
        return state;
    }
  },
});
