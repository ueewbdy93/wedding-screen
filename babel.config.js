module.exports = {
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