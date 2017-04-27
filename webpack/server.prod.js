const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const res = p => path.resolve(__dirname, p)

const modeModules = res('../node_modules')
const entry = res('../server/render.js')
const output = res('../buildServer')

const externals = fs
  .readdirSync(modeModules)
  .filter(x => !x.includes('.bin') && !x.includes('react-loadable'))
  .reduce(
    (externals, mod) => {
      externals[mod] = `commonjs ${mod}`
      return externals
    },
    {}
  )

module.exports = {
  name: 'server',
  target: 'node',
  devtool: 'source-map',
  entry: [entry],
  externals,
  output: {
    path: output,
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      // if you are rendering the server with webpack, you can use
      // css-loader/locals instead of "css-modules-transform"" in .babelrc:
      // {
      //   test: /\.css$/,
      //   exclude: /node_modules/,
      //   use: 'css-loader/locals?modules&localIdentName=[name]__[local]--[hash:base64:5]',
      // },
    ],
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
}
