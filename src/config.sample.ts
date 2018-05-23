import fs from 'fs';
import lodash from 'lodash';
import path from 'path';
import { Omit } from 'utility-types';
import uuid from 'uuid';

const pics = fs.readdirSync(path.resolve(__dirname, '../public/images'))
  .filter((f) => f.indexOf('.jpg') !== -1)
  .map((f) => `/images/${f}`);

const baseConfig = {
  admin: {
    password: 'happy',
  },
  slide: {
    intervalMs: 3000,
    urls: pics,
  },
  game: {
    intervalMs: 10 * 1000,
    questions: [
      {
        text: '2 x 2 = ?',
        options: [
          '1',
          '2',
          '3',
          '4',
        ],
        answer: '4',
      },
    ],
  },
};

// baseConfig.game.questions = baseConfig.game.questions.map((q) => ({ ...q, id: uuid.v1() }));
export const config = lodash.merge(baseConfig, {
  slide: {
    oneRoundMs: baseConfig.slide.intervalMs * baseConfig.slide.urls.length,
  },
  game: {
    questions: baseConfig.game.questions.map((q) => {
      const options = q.options.map((o) => ({ id: uuid.v1(), text: o }));
      const answer = options.find((o) => o.text === q.answer)!;
      const omitted: Omit<typeof q, 'options' | 'answer'> = lodash.omit(q, ['options', 'answer']);

      return Object.assign(
        omitted,
        {
          answer,
          options,
          id: uuid.v1(),
        });
    }),
  },
});
