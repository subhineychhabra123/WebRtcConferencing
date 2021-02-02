const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 8000,
    disableHostCheck: true,
    open: true,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              ["@babel/plugin-proposal-class-properties", { "loose": true }],
              '@babel/plugin-transform-arrow-functions',
              "@babel/plugin-proposal-object-rest-spread",
              ["@babel/plugin-proposal-decorators", { "decoratorsBeforeExport": true }],
              "@babel/plugin-transform-react-inline-elements"
            ],
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.pcss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader',
        query: {
          name: '[name].[hash].[ext]',
          outputPath: 'images/',
          publicPath: path.resolve(__dirname, 'build/fonts'),
        },
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
        query: {
          name: '[name].[hash].[ext]',
          outputPath: path.resolve(__dirname, 'build/fonts'),
        },
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        query: {
          name: '[name].[hash].[ext]',
          outputPath: path.resolve(__dirname, 'build/fonts'),
        },
      },
      {
        test: /\.(config)$/,
        loader: 'file-loader?name=[name].[ext]'
      },
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new WebpackChunkHash(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};