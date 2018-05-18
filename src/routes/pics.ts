
import express from 'express';
const router = express.Router();
import { config } from '../config';

router.get('/', async (ctx, next) => {
  ctx.body = {
    pics: config.slide.urls,
  };
});

export default router;
