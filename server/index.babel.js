import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware-multi-compiler'
import webpackHotMiddleware from 'webpack-hot-middleware'
import clientConfig from '../webpack/client.dev'
import serverRender from './render'

const DEV = process.env.NODE_ENV === 'development'
const publicPath = clientConfig.output.publicPath
const outputPath = clientConfig.output.path
const app = express()

if (DEV) {
  const compiler = webpack(clientConfig)

  app.use(webpackDevMiddleware(compiler, { publicPath }))
  app.use(webpackHotMiddleware(compiler))
  compiler.plugin('done', stats => {
    app.use(serverRender({ clientStats: stats.toJson(), outputPath }))
  })
}
else {
  const clientStats = require('../buildClient/stats.json')

  app.use(publicPath, express.static(outputPath))
  app.use(serverRender({ clientStats, outputPath }))
}

app.listen(3000, () => {
  console.log('Listening @ http://localhost:3000/')
})
