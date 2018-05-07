const fs = require('fs');
const path = require('path');

const pics = fs.readdirSync(path.resolve(__dirname, './public/images')).filter(f => f.startsWith('Ali')).map(f => `/images/${f}`);

module.exports = {
  pic: {
    interval: 1000,
    srcs: pics
  }
};

