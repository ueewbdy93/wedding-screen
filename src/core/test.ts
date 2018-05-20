// const TimerManager = require('./timermanager');
// const Actions = require('./actions');
import { addComment } from './comments/actions';
import store from './store';


// const tm = new TimerManager(store);
// tm.start();

console.log(JSON.stringify(store.getState(), null, 4));
store.dispatch(addComment('kerker', 'kerker', 100));
console.log(JSON.stringify(store.getState(), null, 4));

