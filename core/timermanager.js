const commentTick = Symbol('commentTick');
const store = Symbol('store');
const roundInterval = Symbol('roundInterval');
const Actions = require('./actions');
const config = require('../config');

const ROUND_INTERVAL = config.pic.srcs.length * config.pic.interval;

class TimerManager {
  constructor(reduxStore, interval = ROUND_INTERVAL) {
    this[store] = reduxStore;
    this[commentTick] = null;
    this[roundInterval] = interval;
  }

  start() {
    setInterval(() => {
      clearTimeout(this[commentTick]);

      this[store].dispatch({ type: Actions.RESET });

      this.scheduleComment();

      // TODO: handle pictures timer
    }, this[roundInterval]);
  }

  scheduleComment() {
    const nextComment = this[store].getState().get('currentRoundComment').get(0);
    if (nextComment !== undefined) {
      const currentRoundStartTime = this[store].getState().get('currentRoundStartTime');
      const now = new Date();
      const offset = nextComment.get('offset') - (now - currentRoundStartTime);
      this[commentTick] = setTimeout(() => {
        this[store].dispatch({ type: Actions.PRINT_COMMENT });
        this.scheduleComment();
      }, offset);
    }
  }

  /**
   * @param {VoidFunction} cb - The callback
   * @param {number} ms - millisecond
   * @param {...any} Optional - Additional parameters to pass to the cb
   */
  setCommentTimeout(cb, ms, ...params) {
    if (this[commentTick] !== null) {
      clearTimeout(this[commentTick]);
    }

    this[commentTick] = setTimeout(cb, ms, ...params);
  }
}

module.exports = TimerManager;
