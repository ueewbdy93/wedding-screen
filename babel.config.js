/** @param {import ("@babel/core").ConfigAPI} api */
function babelConfig(api) {
  if (api.env(envName => envName.startsWith("web"))) {
    return {
      presets: [
        "@babel/preset-typescript",
        "@babel/preset-react",
        [
          '@babel/preset-env',
          {
            corejs: '3.30.2',
            useBuiltIns: 'usage',
            targets: '>0.25%, not dead',
          },
        ],
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
      ],
      sourceMaps: true,
    };
  } else {
    return {
      presets: [
        "@babel/preset-typescript",
        [
          "@babel/env",
          {
            targets: {
              node: "16",
            },
          }
        ],
      ],
      plugins: [
        "@babel/plugin-proposal-class-properties",
      ],
      sourceMaps: true,
    };
  }
}

module.exports = babelConfig;
