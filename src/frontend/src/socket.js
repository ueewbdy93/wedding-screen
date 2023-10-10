import { io, Socket } from "socket.io-client";
import Cookies from 'js-cookie';

/** @type {Socket|null} */
let socket = null;

/**
 * 
 * @param {import('redux').Store} reduxStore 
 */
function init(reduxStore) {
  socket = io('/');
  for (const event of ['MODE_CHANGE',
    'SLIDE_CHANGE',
    'GAME_CHANGE',
    'ADMIN_CHANGE']) {
    socket.on(event, (payload) => reduxStore.dispatch({ type: event, payload }))
  }

  for (const event of [
    'disconnect',
    'connect_failed',
  ]) {
    socket.on(event, () => console.log(`websocket ${event}`));
  }

  socket.on('connect', () => {
    try {
      const player = JSON.parse(Cookies.get('player') ?? '{}');
      if (player && player.id) {
        emit({ type: '@@CLIENT_CHECK_PLAYER', payload: player });
      }
    } catch (e) {
      console.error(e);
    }
  })
}

/**
 * 
 * @param {string} eventName 
 * @param {any} payload 
 * @param {(response: any) => void} [cb] 
 */
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

/**
 * 
 * @param {any} action 
 * @param {(response: any)=>void} [cb] 
 */
function emit(action, cb) {
  _emit('action', action, cb);
}

/**
 * 
 * @param {string} action 
 * @param {(response: any)=>void} [cb] 
 */
function adminEmit(action, cb) {
  _emit('admin', action, cb);
}

export { init, emit, adminEmit };
