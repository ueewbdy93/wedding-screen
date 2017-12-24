const router = require('koa-router')();

router.prefix('/users');

router.get('/', (ctx, next) => {
  ctx.body = 'this is a users response!';
});

router.get('/bar', (ctx, next) => {
  ctx.body = 'this is a users/bar response';
});

module.exports = router;
