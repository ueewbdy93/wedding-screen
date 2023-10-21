import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./root-reducer";

export const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["socket"],
        ignoredActions: [
          "@@CLIENT_ADD_COMMENT",
          "@@CLIENT_CHECK_PLAYER",
          "@@CLIENT_PLAYER_ANSWER",
          "@@ADMIN_LOGIN",
          "@@ADMIN_CHANGE_MODE",
          "@@ADMIN_START_QUESTION",
          "@@ADMIN_START_ANSWER",
          "@@ADMIN_REVEAL_ANSWER",
          "@@ADMIN_SHOW_SCORE",
          "@@ADMIN_CLEAR_COMMENT",
          "@@ADMIN_INSERT_COMMENT",
          "@@ADMIN_RESET_GAME",
        ],
      },
    }).concat(sagaMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
