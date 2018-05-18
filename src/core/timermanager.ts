// const Actions = require('./actions');
// const config = require('../config');

// const commentTick = Symbol('commentTick');
// const picTick = Symbol('picTick');
// const store = Symbol('store');
// const roundInterval = Symbol('roundInterval');
// const picInterval = Symbol('picInterval');

// const ROUND_INTERVAL = (config.pic.srcs.length * config.pic.interval) / 2;

// class TimerManager {
//   constructor(reduxStore, rInterval = ROUND_INTERVAL, pInterval = config.pic.interval) {
//     this[store] = reduxStore;
//     this[commentTick] = null;
//     this[picTick] = null;
//     this[roundInterval] = rInterval;
//     this[picInterval] = pInterval;
//   }

//   start() {
//     setInterval(() => {
//       clearInterval(this[picTick]);
//       clearTimeout(this[commentTick]);

//       this[store].dispatch({ type: Actions.RESET });
//       this.scheduleComment();

//       this[picTick] = setInterval(() => {
//         this[store].dispatch({ type: Actions.NEXT_PICTURE });
//       }, this[picInterval]);
//     }, this[roundInterval]);
//   }

//   scheduleComment() {
//     const nextComment = this[store].getState().get('currentRoundComment').get(0);
//     if (nextComment !== undefined) {
//       const currentRoundStartTime = this[store].getState().get('currentRoundStartTime');
//       const now = new Date();
//       const offset = nextComment.get('offset') - (now - currentRoundStartTime);
//       this[commentTick] = setTimeout(() => {
//         this[store].dispatch({ type: Actions.PRINT_COMMENT });
//         this.scheduleComment();
//       }, offset);
//     }
//   }
// }

// module.exports = TimerManager;
