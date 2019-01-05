import bunyan from 'bunyan';
import fs from 'fs';
import path from 'path';
import configJson from './data/config.json';

/**
 * The pictures location, we place pictures at public/images
 */
const pics = fs.readdirSync(path.resolve(__dirname, '../public/images'))
  .filter((f) => f.indexOf('.jpg') !== -1 || f.indexOf('.png') !== -1)
  .map((f) => `/images/${f}`);

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
    urls: pics,
    oneRoundMs: configJson.slide.intervalMs * pics.length,
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
