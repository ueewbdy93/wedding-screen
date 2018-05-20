import { take, put, call, apply, fork } from 'redux-saga/effects';
import { eventChannel, delay } from 'redux-saga';
import io from 'socket.io-client';

export function createWebSocketConnection() {
  const socket = io();
  return Promise.resolve(socket);
}

// 這個 function 從一個指定的 socket 建立一個 event channel
// 設定傳入 `ping` events 的 subscription
export function createSocketChannel(socket) {
  // `eventChannel` 接收一個 subscriber function
  // subscriber function 接收一個 `emit` 參數，把 message 放到 channel 上 the channel
  return eventChannel((emit) => {

    const actionHandler = (action) => { emit(action) };

    socket.on('action', actionHandler);

    // subscriber 必須回傳一個 unsubscribe function
    // 當 saga 呼叫 `channel.close` 方法將會被調用
    const unsubscribe = () => {
      socket.off('action', actionHandler);
    };
    return unsubscribe;
  });
}
