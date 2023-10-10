import FaviconsWebpackPlugin from "favicons-webpack-plugin";
// import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import webpack from "webpack";
import babelConfig from "../babel.config";
import config from "./utils/config";
import createResolveAlias from "./utils/create_resolve_alias";
import vendor from "./utils/vendor";

const defineEnvironments = new webpack.EnvironmentPlugin(["NODE_ENV"]);

const favicon = new FaviconsWebpackPlugin({
  logo: path.resolve(__dirname, "./resources/favicon.jpg"),
  prefix: "favicon/",
  inject: true,
  favicons: {
    appName: "Wedding Screen",
    appDescription: "Wedding Screen",
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: true,
      favicons: true,
      windows: true,
      yandex: true,
    },
  },
});

const userHtml = new HtmlWebpackPlugin({
  filename: "index.html",
  chunks: ["manifest", "vendor", "user"],
  template: path.resolve(__dirname, "./resources/template.html"),
  alwaysWriteToDisk: true,
  devTool: true,
  inject: true,
});

const adminHtml = new HtmlWebpackPlugin({
  filename: "admin-index.html",
  chunks: ["manifest", "vendor", "admin"],
  template: path.resolve(__dirname, "./resources/template.html"),
  alwaysWriteToDisk: true,
  devTool: true,
  inject: true,
});

/** @type {import ('webpack').Configuration} */
const webpackConfig = {
  mode: "development",
  resolve: {
    symlinks: false,
    modules: [config.userEntry, config.adminEntry, "node_modules"],
    alias: createResolveAlias(vendor),
    extensions: [".jsx", ".json", ".js", ".ts", ".tsx"],
  },
  entry: {
    user: [config.userEntry],
    admin: [config.adminEntry],
    vendor,
  },
  cache: true,
  target: "web",
  devtool: "eval-cheap-module-source-map",
  output: {
    path: config.path,
    filename: "javascripts/[name].js",
    chunkFilename: "javascripts/[name].js",
    publicPath: process.env.PUBLIC_PATH || "/",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        loader: "babel-loader",
        exclude: /(node_modules)/,
        options: {
          ...babelConfig,
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: "file-loader",
      },
      {
        test: /\.(otf|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
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
    // new HtmlWebpackHarddiskPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      automaticNameDelimiter: ".",
    },
    runtimeChunk: {
      name: "manifest",
    },
  },
  devServer: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: "all",
    compress: true,
    proxy: {
      "*": "http://localhost:4000",
      "/images/.*": {
        target: "http://localhost:4000",
      },
      "/resources/.*": {
        target: "http://localhost:4000",
      },
      "/socket": {
        target: "ws://localhost:4000",
        ws: true,
      },
    },
  },
};

export default webpackConfig;
