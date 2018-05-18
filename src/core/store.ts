
import { applyMiddleware, compose, createStore, Middleware } from 'redux';
import { rootReducer, RootState } from './reducer';

function configureStore(initialState?: RootState) {
  // configure middlewares
  const middlewares: Middleware[] = [
  ];
  // compose enhancers
  const enhancer = compose(
    applyMiddleware(...middlewares),
  );
  // create store
  return createStore(
    rootReducer,
    initialState!,
    enhancer,
  );
}

// pass an optional param to rehydrate state on app start
const store = configureStore();

// export store singleton instance
export default store;
