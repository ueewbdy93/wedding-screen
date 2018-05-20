import io from 'socket.io-client';

let socket = null;
let store = null;

function init(reduxStore) {
  store = reduxStore;
  socket = io('/');
  [
    'MODE_CHANGE',
    'SLIDE_CHANGE',
    'GAME_CHANGE'
  ].map(event => {
    socket.on(event, (payload) => store.dispatch({ type: event, payload }))
  });

  [
    'disconnect',
    'connect_failed',
    'connect',
  ].forEach((event) => {
    socket.on(event, () => console.log(`websocket ${event}`));
  });
}

function emit(action, cb) {
  if (socket === null) {
    throw new Error('socket is null');
  }
  store.dispatch({ type: action.type });
  if (cb) {
    socket.emit('action', action, cb);
  } else {
    socket.emit('action', action);
  }
}

export { init, emit };
