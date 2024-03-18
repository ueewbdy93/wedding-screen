import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { applyMiddleware, compose } from "redux";
// import thunk from 'redux-thunk';
import logger from "redux-logger";
import rootReducer from "./reducers";

// const middleware = [
//   thunk
// ];

// Configure the logger middleware
// const logger = createLogger({
//   level: 'info',
//   collapsed: true,
// });

// if (process.env.NODE_ENV === 'development') {
//   // const devToolsExtension = window.devToolsExtension;

//   // if (typeof devToolsExtension === 'function') {
//   //   enhancers.push(devToolsExtension());
//   // }
//   middleware.push(logger);
// } else {
// }

// const createStoreWithMiddleware = compose(applyMiddleware(...middleware)(createStore));

export const sagaMiddleware = createSagaMiddleware();
function initStore(preloadedState = {}) {
  // Create the redux store and add middleware to it
  // const configStore = createStoreWithMiddleware(
  //   rootReducer,
  //   initialState,
  // );

  // create store
  const reduxStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these paths in the state
          ignoredActionPaths: ["payload.navigate"],
        },
      }),
    // .concat(logger),
    preloadedState,
  });

  // Snippet to allow hot reload to work with reducers
  // if (module.hot) {
  //     module.hot.accept(function _() {
  //         configStore.replaceReducer(rootReducer);
  //     });
  // }

  return reduxStore;
}

export const store = initStore(window.PRELOADED_STATE ?? {});
export type RootState = ReturnType<typeof store.getState>;
