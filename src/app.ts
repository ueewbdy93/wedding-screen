const Koa = require('koa');
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const IO = require('koa-socket');

const socketManager = require('./core/socketmanager');
const store = require('./core/store');
const index = require('./routes/index');
const users = require('./routes/users');
const pics = require('./routes/pics');

const app = new Koa();
// error handler
onerror(app);
const io = new IO();

io.attach(app);
app._io.on('connection', (socket) => {
  socket.on('action', (data) => {
    switch (data.type) {
      case 'id':
        socketManager.addClient(data.id, socket);
        break;
      default:
        store.dispatch(data);
        break;
    }
  });
});
store.subscribe(() => {

});


// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(`${__dirname}/../public`));

app.use(views(`${__dirname}/../views`, {
  extension: 'ejs'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(pics.routes(), pics.allowedMethods());


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
