const router = require('koa-router')();
const config = require('../config');

router.prefix('/pics');

router.get('/', async (ctx, next) => {
  ctx.body = {
    pics: config.pic.srcs.filter(p => p.search(/thumbnail/) < 0)
  };
});

router.get('/thumbnails', async (ctx, next) => {
  ctx.body = {
    pics: config.pic.srcs.filter(p => p.search(/thumbnail/) >= 0)
  };
});

module.exports = router;
