import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./root-reducer";

export const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["@@CLIENT_ADD_COMMENT", "@@CLIENT_CHECK_PLAYER", "@@CLIENT_PLAYER_ANSWER"]
      },
    }).concat(sagaMiddleware),
});
