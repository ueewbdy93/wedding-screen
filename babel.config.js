/** @param {import ("babel-core").TransformOptions} api */
function babelConfig(api) {
  if (api.env(envName => envName.startsWith("web"))) {
    return {
      presets: [
        "@babel/preset-typescript",
        "@babel/preset-react",
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'usage',
            targets: {
              browsers: [
                'last 2 versions',
                'Explorer >= 10',
              ]
            }
          },
        ],
      ],
      plugins: [
        [
          "@babel/plugin-proposal-class-properties",
          {
            loose: true
          }
        ],
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
              node: "10",
            },
            useBuiltIns: "usage",
          }
        ],
      ],
      plugins: [
        [
          "@babel/plugin-proposal-class-properties",
          {
            loose: true
          }
        ],
      ],
      sourceMaps: true,
    };
  }
}

module.exports = babelConfig;
