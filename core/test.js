const store = require('./store');
const TimerManager = require('./timermanager');
const Actions = require('./actions');


const tm = new TimerManager(store);
tm.start();

store.dispatch({
  type: Actions.ADD_COMMENT,
  comment: {
    name: 'shirley', content: 'hahah', type: '', createTime: new Date()
  }
});

store.dispatch({
  type: Actions.ADD_COMMENT,
  comment: {
    name: 'shirley', content: 'hahah222', type: '', createTime: new Date()
  }
});
