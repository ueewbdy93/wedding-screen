const logger = require('./logger');

const clients = Symbol('clients');

class SocketManager {
  constructor() {
    this[clients] = {};
  }

  /**
   *
   * @param {string} uuid
   * @param {WebSocket} socket
   */
  addClient(id, socket) {
    this[clients][id] = socket;
    socket.once('disconnect', (code, reason) => {
      logger.info('client %s closed due to %s', id, reason);
      delete this[clients][id];
    });

    socket.on('error', (err) => {
      logger.error(err, 'client %s error', id);
      delete this[clients][id];
    });
  }

  broadcast(msg) {
    Object.values(this[clients]).forEach((socket) => {
      socket.send(msg);
    });
  }
}

module.exports = new SocketManager();
