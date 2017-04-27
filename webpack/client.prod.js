const path = require('path')
const webpack = require('webpack')
const ExtractCssChunk = require('extract-css-chunk')
const StatsPlugin = require('stats-webpack-plugin')

module.exports = {
  name: 'client',
  target: 'web',
  devtool: 'source-map',
  entry: [path.resolve(__dirname, '../src/index.js')],
  entry: [
    path.resolve(__dirname, '../src/index.js')
  ],
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, '../buildClient'),
    publicPath: '/static/',
  },
  module: {
    rules: [
      {
        // Note: this just as easily could have been a more regular looking usage
        // of the babel-loader, but because this example package showcases both
        // a babel server and a webpack server (and because it's likely better to use
        // a babel plugin rather than extract-text-webpack-plugin to transform CSS 
        // requires server-side anyway), we must override the .babelrc file here, 
        // doing exactly what it normally does without the `css-modules-transform` 
        // plugin since the webpack css-loader handles it below.
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: ['es2015', 'react', 'stage-2'],
            plugins: [
              require('babel-plugin-dynamic-import-webpack').default,
            ],
          },
        },
      },
      // remove above babel-loader and uncomment this if you are rendering the
      // server with Babel and not using "css-modules-transform" in .babelrc:
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: 'babel-loader',
      // },
      {
        test: /\.css$/,
        use: ExtractCssChunk.extract({
          use: 'css-loader?modules&localIdentName=[name]__[local]--[hash:base64:5]',
        }),
      },
    ],
  },
  plugins: [
    new ExtractCssChunk(),
    new webpack.HashedModuleIdsPlugin(), // only needed when server built with webpack
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
      filename: '[name].[chunkhash].js',
      minChunks: Infinity,
    }),
    new StatsPlugin('stats.json'),
    
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        screw_ie8: true,
        comments: false,
      },
      sourceMap: true,
    }),
  ],
}
