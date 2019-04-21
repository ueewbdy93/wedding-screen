import bunyan from 'bunyan';
import fs from 'fs';
import path from 'path';
import configJson from './config/config.json';

/**
 * The pictures location, we place pictures at public/images
 */
const images = fs.readdirSync(path.resolve(__dirname, 'public/images/normal'))
  .filter((f) => f.indexOf('.jpg') !== -1 || f.indexOf('.png') !== -1)
  .map((f) => `/images/normal/${f}`);

/**
 * Parsed questions
 */
const parsedQuestions = configJson.game.questions.map((q, i) => {
  const parsedOptions = q.options.map((o, j) => ({ id: i * 4 + j, ...o }));
  return {
    id: i,
    text: q.text,
    options: parsedOptions.map((o) => ({ id: o.id, text: o.text })),
    answers: parsedOptions.filter((o) => o.isAnswer).map((o) => o.id),
  };
});

export const config = {
  admin: { password: configJson.admin.password },
  slide: {
    intervalMs: configJson.slide.intervalMs,
    images,
    oneRoundMs: configJson.slide.intervalMs * images.length,
  },
  game: {
    intervalMs: configJson.game.intervalMs,
    questions: parsedQuestions,
  },
  log: {
    name: 'logger',
    level: bunyan.DEBUG,
    src: true,
  },
};
