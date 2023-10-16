import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
// TODO: terser plugin
// import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
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
  devTool: false,
  inject: true,
  minify: {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
  },
});

const adminHtml = new HtmlWebpackPlugin({
  filename: "admin-index.html",
  chunks: ["manifest", "vendor", "admin"],
  template: path.resolve(__dirname, "./resources/template.html"),
  devTool: false,
  inject: true,
  minify: {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
  },
});

export default {
  mode: "production",
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
  output: {
    pathinfo: false,
    path: config.path,
    filename: "javascripts/[name].[contenthash].js",
    chunkFilename: "javascripts/[name].[contenthash].js",
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
        type: "asset/resource",
        generator: {
          filename: "images/[name].[contenthash][ext]",
        },
      },
      {
        test: /\.(otf|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: "asset/resource",
        generator: {
          filename: "images/[name].[contenthash][ext]",
        },
      },
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [userHtml, adminHtml, defineEnvironments, favicon],
  optimization: {
    splitChunks: {
      chunks: "all",
      automaticNameDelimiter: ".",
    },
    runtimeChunk: {
      name: "manifest",
    },
  },
};
