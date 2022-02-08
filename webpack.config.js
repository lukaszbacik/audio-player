const devMode = process.env.NODE_ENV !== "production",
  Path = require("path"),
  Webpack = require("webpack"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"),
  OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"),
  UglifyJsPlugin = require("uglifyjs-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  CleanWebpackPlugin = require("clean-webpack-plugin"),
  Autoprefixer = require("autoprefixer"),
  CopyPlugin = require("copy-webpack-plugin"),
  WebpackNotifierPlugin = require("webpack-notifier");

module.exports = {
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ["default", { discardComments: { removeAll: true } }],
        },
      }),
      new UglifyJsPlugin({
        sourceMap: true,
      }),
    ],
  },
  devServer: {
    stats: "errors-only",
    host: "localhost",
    port: process.env.PORT,
    open: true,
    writeToDisk: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              plugins: [Autoprefixer()],
            },
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
            options: {
              plugins: [Autoprefixer()],
            },
          },
          {
            loader: "postcss-loader",
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              inject: false,
              favicon: "favicon.png",
              minify: {
                collapseWhitespace: false,
                removeComments: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|ttf|otf|eot)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-arrow-functions"],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin("web"),

    new MiniCssExtractPlugin({
      filename: "[name].[hash].min.css",
      chunkFilename: "[id].[hash].min.css",
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require("cssnano"),
      cssProcessorPluginOptions: {
        preset: ["default", { discardComments: { removeAll: true } }],
      },
      canPrint: true,
    }),
    new HtmlWebpackPlugin({
      title: "Audio Player",
      template: "src/index.html",
    }),
    new CopyPlugin([
      {
        from: "./src/images/",
        to: "images",
      },
    ]),
    new WebpackNotifierPlugin({
      title: function (params) {
        return `Build status is ${params.status} with message ${params.message}`;
      },
    }),
  ],
  resolve: {
    extensions: [".js", ".scss", ".html", ".txt"],
  },
  entry: "./src/js/index.js",
  output: {
    filename: "main.[hash].min.js",
    path: Path.resolve(__dirname, "web"),
  },
};
