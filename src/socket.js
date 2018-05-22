import io from 'socket.io-client';

let socket = null;
let store = null;

function init(reduxStore) {
  store = reduxStore;
  socket = io('/');
  [
    'MODE_CHANGE',
    'SLIDE_CHANGE',
    'GAME_CHANGE',
    'ADMIN_CHANGE'
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

function _emit(eventName, payload, cb) {
  if (socket === null) {
    throw new Error('socket is null');
  }
  if (cb) {
    socket.emit(eventName, payload, cb);
  } else {
    socket.emit(eventName, payload);
  }
}

function emit(action, cb) {
  _emit('action', action, cb);
}

function adminEmit(action, cb) {
  _emit('admin', action, cb);
}

export { init, emit, adminEmit };
