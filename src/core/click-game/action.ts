import { createStandardAction } from "typesafe-actions";
import { IModel, IClickEvent, IPlayer } from "./model";

export const setClickGameState = createStandardAction("CLICK_GAME/SET_STATE")<
  IModel["state"]
>();

export const addClickGamePlayer = createStandardAction(
  "CLICK_GAME/ADD_PLAYER"
)<IPlayer>();

export const addPlayerClicks = createStandardAction(
  "CLICK_GAME/ADD_CLICKS"
)<IClickEvent>();
