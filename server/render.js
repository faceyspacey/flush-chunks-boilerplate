import path from 'path'
import React from 'react'
import ReactDOM from 'react-dom/server'
import App from '../src/components/App'
import ReactLoadable from 'react-loadable'
import flushChunks from 'webpack-flush-chunks'

export default (clientStats, serverStats, options) => {
  return (req, res, next) => {
    const app = ReactDOM.renderToString(<App />)
    const moduleIds = flushRequires()

    const {
      // react components:
      Js,
      Styles, // external stylesheets
      Css,    // raw css

      // strings:
      js,
      styles, // external stylesheets
      css,    // raw css

      // arrays of file names (not including publicPath):
      scripts,
      stylesheets,
    } = flushChunks(moduleIds, clientStats, {
      before: ['bootstrap'],
      after: ['main'],

      // only needed if using babel on the server
      rootDir: path.resolve(__dirname, '..'),

      // only needed if serving css rather than an external stylesheet
      outputPath: getOutputPath(options),
    })

    console.log('SERVED SCRIPTS', scripts)
    console.log('SERVED STYLESHEETS', stylesheets)

    res.send(
      `
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>react-loadable-example</title>
          </head>
          <body>
            ${styles}
            <div id="root">${app}</div>
            ${js}
          </body>
        </html>
      `,
    )

    // COMMENT the above `res.send` call
    // and UNCOMMENT below to test rendering React components:

    // const html = ReactDOM.renderToStaticMarkup(
    //   <html>
    //     <head>
    //       <Styles />
    //     </head>
    //     <body>
    //       <div id="root" dangerouslySetInnerHTML={{ __html: app }} />
    //       <Js />
    //     </body>
    //   </html>
    // )

    // res.send(`<!DOCTYPE html>${html}`)
  }
}

const IS_WEBPACK =  typeof __webpack_require__ !== "undefined"

const flushRequires = () =>
  IS_WEBPACK 
    ? ReactLoadable.flushWebpackRequireWeakIds()
    : ReactLoadable.flushServerSideRequirePaths()

const getOutputPath = options =>
  typeof options === 'object' 
    ? options.config.client.output.path
    : options
