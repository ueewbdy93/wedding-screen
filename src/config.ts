import fs from 'fs';
import lodash from 'lodash';
import path from 'path';

const pics = fs.readdirSync(path.resolve(__dirname, '../public/images'))
  .filter(f => f.indexOf('Ali') === 0)
  .map(f => `/images/${f}`);

const baseConfig = {
  slide: {
    interval: 1000,
    urls: pics,
  },
};

export const config = lodash.merge(baseConfig, {
  slide: {
    oneRoundMs: baseConfig.slide.interval * baseConfig.slide.urls.length,
  },
});
