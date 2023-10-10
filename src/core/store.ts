
import { applyMiddleware, compose, createStore, Middleware } from 'redux';
import reduxSaga from 'redux-saga';
import { IRootState, rootReducer } from './root-reducer';
import { default as createRootSaga } from './sagas';
import { Server } from 'socket.io'

export function configureStore({
  initialState,
  io }: {
    initialState?: IRootState,
    io?: Server,
  } = {},
) {
  // configure middlewares
  const sagaMiddleware = reduxSaga();
  const middlewares: Middleware[] = [
    sagaMiddleware,
  ];
  // compose enhancers
  const enhancer = compose(
    applyMiddleware(...middlewares),
  );
  // create store
  const reduxStore = createStore(
    rootReducer,
    initialState!,
    enhancer,
  );

  if (io) {
    sagaMiddleware.run(createRootSaga(io));
    // io.on('connection', (socket) => {
    //   socket.emit('set_state', store.getState());
    //   socket.on('set_name', (name) => {
    //     store.dispatch(GameActions.addPlayer(name));
    //   });
    // });
  }
  return reduxStore;
}

// pass an optional param to rehydrate state on app start
const store = configureStore();

// export store singleton instance
export default store;
