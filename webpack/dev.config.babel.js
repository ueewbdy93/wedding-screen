import L from 'lodash';
import autoprefixer from 'autoprefixer';
import fs from 'fs';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import path from 'path';
import createResolveAlias from './utils/create_resolve_alias';
import config from './utils/config';
import vendor from './utils/vendor';
import babelConfig from './../babel.config';

const autoprefixerConfig = autoprefixer({
  browsers: [
    'last 2 versions',
    'Explorer >= 10',
  ]
});

const defineEnvironments = new webpack.EnvironmentPlugin([
  'NODE_ENV',
]);

const favicon = new FaviconsWebpackPlugin({
  logo: path.resolve(__dirname, './resources/favicon.jpg'),
  prefix: 'favicon/',
  inject: true,
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: true,
    favicons: true,
    firefox: true
  }
});

const userHtml = new HtmlWebpackPlugin({
  filename: 'index.html',
  chunks: ['manifest', 'vendor', 'user'],
  template: path.resolve(__dirname, './resources/template.html'),
  alwaysWriteToDisk: true,
  devTool: true,
  inject: true,
});

const adminHtml = new HtmlWebpackPlugin({
  filename: 'admin-index.html',
  chunks: ['manifest', 'vendor', 'admin'],
  template: path.resolve(__dirname, './resources/template.html'),
  alwaysWriteToDisk: true,
  devTool: true,
  inject: true,
});

/** @type {import ('webpack').Configuration} */
const webpackConfig = {
  mode: 'development',
  resolve: {
    symlinks: false,
    modules: [
      config.userEntry,
      config.adminEntry,
      'node_modules',
    ],
    alias: createResolveAlias(vendor),
    extensions: ['.jsx', '.json', '.js', '.ts', '.tsx'],
  },
  entry: {
    user: [
      config.userEntry
    ],
    admin: [
      config.adminEntry
    ],
    vendor,
  },
  cache: true,
  target: 'web',
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: config.path,
    filename: 'javascripts/[name].js',
    chunkFilename: 'javascripts/[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        options: {
          ...babelConfig,
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'file-loader',
        // options: {
        //   name(file) {
        //     const match = /\/vhosts\/(.+?)\//.exec(file);
        //     if (match === null) {
        //       return 'images/[name].[ext]';
        //     }

        //     return `images/${match[1]}/[name].[ext]`;
        //   },
        // },
      },
      {
        test: /\.(otf|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        // options: {
        //   name(file) {
        //     const match = /\/vhosts\/(.+?)\//.exec(file);
        //     if (match === null) {
        //       return 'fonts/[name].[ext]';
        //     }

        //     return `fonts/${match[1]}/[name].[ext]`;
        //   },
        // },
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                autoprefixerConfig,
              ],
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    userHtml,
    adminHtml,
    defineEnvironments,
    favicon,
    new HtmlWebpackHarddiskPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minChunks: 1,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      name: 'vendor',
      automaticNameDelimiter: '.',
      cacheGroups: {
        vendor: {
          reuseExistingChunk: true,
          enforce: true,
          test: (module) => {
            if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
              return false;
            }

            if (!L.isArray(module.context)) {
              return false;
            }

            return module.context.includes('/node_modules/');
          },
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    disableHostCheck: true,
    compress: true,
    proxy: {
      '*': 'http://localhost:4000',
      '/images/.*': {
        "target": "http://localhost:4000"
      },
      '/resources/.*': {
        "target": "http://localhost:4000"
      },
      '/socket': {
        "target": "ws://localhost:4000",
        "ws": true
      }
    },
  },
};

export default webpackConfig;
