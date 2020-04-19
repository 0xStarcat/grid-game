const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const pathToPhaser = path.join(__dirname, "../node_modules/phaser/");
const phaser = path.join(pathToPhaser, "dist/phaser.min.js");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  resolve: {
    alias: {
      phaser: phaser,
      "@assets": path.resolve(__dirname, "../src/assets/"),
      "@scenes": path.resolve(__dirname, "../src/scenes/"),
      "@scripts": path.resolve(__dirname, "../src/scripts/"),
      "@utilities": path.resolve(__dirname, "../src/utilities/"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      { test: /phaser\.js$/, loader: "expose-loader?Phaser" },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader",
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: "file-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "../"),
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
};
