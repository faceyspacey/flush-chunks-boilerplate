# Flush Chunks Boilerplate

This is a boilerplate example for how to use [webpack-flush-chunks](https://github.com/faceyspacey/webpack-flush-chunks)
in conjunction with [react-loadable](https://github.com/thejameskyle/react-loadable) and [extract-css-chunks-webpack-plugin](https://github.com/faceyspacey/extract-css-chunks-webpack-plugin).

You should get familiar with the documentation of those while running this.

***Note: This is a preemptive repo. For HMR to work for split components a pending PR to *React Loadable* will have to be accepted. That PR also contains a suggestion for the `flushRequires` API documented below. Currently in code the original flushing API is used. Don't sweat it.***


## Installation

```
git clone https://github.com/faceyspacey/flush-flush-boilerplate.git
cd flush-requires-flush
yarn install
```

## Usage

*try out universal Webpack bundling:*
```
yarn run start:webpack:dev
yarn run start:webpack:prod
```

*use Babel ont the server:*
```
yarn run start:babel:dev
yarn run start:babel:pro
```

After selecting one of the above commands, open [localhost:3000](http://localhost:3000) in your browser. We recommend you start with Webpack in development as that offers the best developer experience. After check it in the production and see what files exist within your bundle. And often view the source in the browser to see what chunks are being sent.


## Things To Do

- try all 4 commands and examine their corresponding Webpack configs and their corresponding server files: [`server/index.webpack.js`](./server/index.webpack.js) and [`server/index.babel.js`](./server/index.babel.js)
- view the source in your browser to see what the server sends (do this often)
- open [`src/components/App.js`](./src/components/App.js) and toggle `state.show` between `false` and `true` and
then view the source in your browser to see when corresponding chunks are sent vs. not sent.
- open the browser console *Network* tab and see when in fact the `Example.js` chunk is asynchronously loaded (it won't be if `state.show` starts off as `true`, which is desired result, i.e. because the client *synchronously* renders exactly what was rendered on the server)
- edit the `<App />` and `<Example />` components to see that HMR works--even for split chunks. Do so with both `state.show` pre-set to both
`false` and `true` to verify HMR works in all scenarios.
- edit and save the CSS files to confirm HMR works for CSS as well, thanks to [extract-css-chunks-webpack-plugin](https://github.com/faceyspacey/extract-css-chunks-webpack-plugin)

-when bundling for production, examine the `buildClient` and `buildServer` folders to see exactly what chunks and files are built for you. Notice the `stats.json` file in `buildClient`. Notice that every javascript chunk has 2 versions of itself: one ending with the extension `.js` and one ending with `.no_css.js`. This is thanks to 
[extract-css-chunks-webpack-plugin](https://github.com/faceyspacey/extract-css-chunks-webpack-plugin) which prepares an additional javascript file with no CSS (for the smallest possible build sizes) for sending over the wire as part of SSR. The regular one with css injection in it is used when the chunk is asynchronously loaded as your users navigate your app. HMR will work in both cases. 
- open [`server/render.js`](./server/render.js) and follow the directions of what lines to comment and uncomment to test rendering your chunks as strings vs. React components.
- open [`server/render.js`](./server/render.js) and from the return of `flushCHunks` use `css` instead of `styles` while running in production to see your CSS embedded directly in the response page. View the source in your browser to confirm. *Note: during development, external stylesheets will still be used for HMR to work; this is automatic.*
- check out the amazing package, [webpack-hot-server-middleware](https://github.com/60frames/webpack-hot-server-middleware), to see how dual-compilation works for both your server and client bundles. It's very fast because it shares compiled files between the 2 bundles. We've been surprised this hasn't been more popular and the defacto solution for rendering both bundles. It's very solid. We think you will like it...Another thing nice about it is how seamlessly it ushers your compilation stats to the render function you pass to express's `app.use`.
- **remove the code that doesn't suit your particular scenario, and start your app!**


## Server-Rendering (Babel vs. Webpack)

When you end up using this in your actual app, you will likely end up deleting much of the code that is not relevant for your particular use case. For example, if
you're rendering both the client and server with Webpack, you will delete `index.babel.js` and `"css-modules-transform"` from your `.babelrc`. And if you're rendering the server with Babel, you will delete the `server.dev/prod.js` Webpack configs. In addition, you will likely simplify your use of `flushChunks` to only return the aspects you decide on using, and uncomment a few things like `'css-loader/locals?...'` if you're bundling the server with Webpack.

If you're not embedding CSS directly in your response strings, you can forget about ushering the `outputPath` to your `serverRender` function. Keep in mind though that if you do, and if you render the server with Webpack this can become a time-sink to figure out for those not familiar with how Webpack mocks the file system. Basically by default the file system won't be what you expect it to be if you call `path.resolve(__dirname, '..')` within a webpack-compiled portion of your code, which is why it's very nice how [webpack-hot-server-middleware](https://github.com/60frames/webpack-hot-server-middleware) allows you to pass options from Babel code where you can get your bundle's output path resolved properly. Universal Webpack is awesome, but has a few hurdles to doing correctly, particularly in development. [webpack-hot-server-middleware](https://github.com/60frames/webpack-hot-server-middleware) solves those hurdles.

Hopefully insights from this boilerplate simplifies things for you. The key is to recognize the boundary this boilerplate has chosen between what server code is compiled by Webpack and what code is compiled by Babel. The boundary specifically is [`server/index.webpack.js`](./server/index.webpack.js), which is handled by Babel and [`server/render.js`](./server/render.js), which is handled by Webpack--both of which are run on the server. 

If you haven't rendered your server with Webpack before, now's a good time to give it a try. Helping make that--along with *complete HMR*--more of a mainstream thing is a side aim of this repo. 


## Final Note: Hot Module Replacement

You will notice that the server code is watched with `babel-watch` in `package.json`. The goal is obviously HMR everywhere, since no matter what some of your code is built outside of Webpack. 

There is one gotcha with that though: if you edit the server code (not compiled by Webpack), it will update, but then connection to the client will be lost, and you need to do a refresh. This is very useful for cases where you are actively refreshing, such as when you're checking the output from you server in your browser source code tab, but obviously not the pinnacle in universal HMR. 

However, when your not editing your `express` code much, and if you're editing webpack-compiled code (whether rendered on the client or server), HMR will isomorphically work with no unexpected hiccups; and that *awesomeness* is likely what you'll experience most of the time. That's one of the key benefits of [webpack-hot-server-middleware](https://github.com/60frames/webpack-hot-server-middleware).

If you have a solution to reconnecting the client to HMR after `babel-watch` reloads the server code, we'd love to hear it. 

*Long live the dreams of Universal HMR* and ***Universal Code-Splitting!***

