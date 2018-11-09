import bunyan from 'bunyan';
import fs from 'fs';
import lodash from 'lodash';
import path from 'path';
import { Omit } from 'utility-types';
import uuid from 'uuid';

/***************************
 * configuration starts here
 ***************************/

/*
 * The pictures location, we place pictures at public/images
 */
const pics = fs.readdirSync(path.resolve(__dirname, '../public/images'))
  .filter((f) => f.indexOf('.jpg') !== -1)
  .map((f) => `/images/${f}`);

const baseConfig = {
  admin: {
    /* The password of admin page */
    password: 'happy',
  },
  slide: {
    /* The time interval between every pictures in milliseconds */
    intervalMs: 3000,
    /* The pictures url, by default we place pictures at public/images */
    urls: pics,
  },
  game: {
    /* The time interval for client to answering questions */
    intervalMs: 8 * 1000,
    /* An array of questions */
    questions: [
      {
        /* The question content */
        text: 'Something is small, red, round and sweet?',
        /* The candidate answers, every questions *MUST*
         * contains four candidate answers, and we do not
         * allow duplicate candidate answers */
        options: [
          'Orange',
          'Apple',
          'Cherry',
          'Strawberry',
        ],
        /* The answer MUST be equal to one of the options */
        answer: 'Apple',
      },
      {
        /* The question content */
        text: 'Something starts with an H and ends with an oof?',
        /* The candidate answers, every questions *MUST*
         * contains four candidate answers, and we do not
         * allow duplicate candidate answers */
        options: [
          'Bokoblin',
          'Moblin',
          'Lynel Hoof',
          'Lizalfos',
        ],
        /* The answer MUST be equal to one of the options */
        answer: 'Lynel Hoof',
      },
    ],
  },
  /* The logger options for bunyan logger, see {} */
  log: {
    name: 'logger',
    level: bunyan.DEBUG,
    src: true,
    // streams: [
    //   {
    //     type: 'rotating-file',
    //     path: '/var/log/foo.log',
    //     period: '1d',   // daily rotation
    //     count: 3,        // keep 3 back copies
    //   },
    // ],
  },
};
/***************************
 * configuration ends here
 ***************************/

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
