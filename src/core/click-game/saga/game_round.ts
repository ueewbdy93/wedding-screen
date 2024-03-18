import { Server } from "socket.io";
import { createStandardAction, getType } from "typesafe-actions";
import { put, race, take, delay } from "redux-saga/effects";
import { setClickGameState } from "../action";

const adminSetClickGameStatePlaying = createStandardAction(
  "@@ADMIN_SET_CLICK_GAME_STATE_PLAYING"
)();
const adminSetClickGameStatePlaying2 = createStandardAction(
  "@@ADMIN_SET_CLICK_GAME_STATE_PLAYING2"
)();
const adminSetClickGameStateEnd = createStandardAction(
  "@@ADMIN_SET_CLICK_GAME_STATE_END"
)();
const adminSetClickGameStateRegistering = createStandardAction(
  "@@ADMIN_SET_CLICK_GAME_STATE_REGISTERING"
)();

export function* gameRound(io: Server) {
  while (true) {
    yield take(getType(adminSetClickGameStatePlaying));
    yield put(setClickGameState("playing"));
    io.emit("set game state to playing");

    yield race({
      timeout: delay(60000),
      adminSetEnd: take(getType(adminSetClickGameStatePlaying2)),
    });
    yield put(setClickGameState("playing2"));
    io.emit("set game state to playing2");

    yield take(getType(adminSetClickGameStateEnd));
    yield put(setClickGameState("end"));
    io.emit("set game state to end");

    yield take(getType(adminSetClickGameStateRegistering));
    yield put(setClickGameState("registering"));
    io.emit("reset game action to everyone"); //
  }
}
