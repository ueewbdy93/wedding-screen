import { take, put, call, apply, fork, race } from 'redux-saga/effects';
import { eventChannel, delay } from 'redux-saga';
import { createWebSocketConnection, createSocketChannel } from './websocketSaga';

function* getDataFromServer(socketChannel) {
  const action = yield take(socketChannel);
  yield put(action);
}

function* sendDataToServer(socket) {
  const action = yield take('SEND_TO_SERVER');
  socket.emit('action', action.data);
}

export default function* rootSaga() {
  const socket = yield call(createWebSocketConnection);
  const socketChannel = yield call(createSocketChannel, socket);
  while (true) {
    const { newComment } = yield race({
      getDataFromServer: call(getDataFromServer, socketChannel),
      sendDataToServer: call(sendDataToServer, socket),
      newComment: take('INSERT_COMMENT')
    })
    if (newComment) {
      yield put({ ...newComment, type: 'NEW_COMMENT' });
    }
  }
}