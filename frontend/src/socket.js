import io from 'socket.io-client';
import Cookies from 'js-cookie';

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
  ].forEach(event => {
    socket.on(event, (payload) => store.dispatch({ type: event, payload }))
  });

  [
    'disconnect',
    'connect_failed',
  ].forEach((event) => {
    socket.on(event, () => console.log(`websocket ${event}`));
  });

  socket.on('connect', () => {
    const player = Cookies.getJSON('player');
    if (player && player.id) {
      emit({ type: '@@CLIENT_CHECK_PLAYER', payload: player });
    }
  })
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
