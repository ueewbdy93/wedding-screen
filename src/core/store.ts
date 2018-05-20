
import { applyMiddleware, compose, createStore, Middleware } from 'redux';
import reduxSaga from 'redux-saga';
import { Actions as GameActions } from './game';
import { rootReducer, RootState } from './root-reducer';
import { rootSaga } from './sagas';

export function configureStore({
  initialState,
  io }: {
    initialState?: RootState,
    io?: SocketIO.Server,
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
  const store = createStore(
    rootReducer,
    initialState!,
    enhancer,
  );

  sagaMiddleware.run(rootSaga);

  if (io) {
    io.on('connection', (socket) => {
      socket.emit('set_state', store.getState());
      socket.on('set_name', (name) => {
        store.dispatch(GameActions.addPlayer(name));
      });
    });
  }
  return store;
}

// pass an optional param to rehydrate state on app start
const store = configureStore();

// export store singleton instance
export default store;
