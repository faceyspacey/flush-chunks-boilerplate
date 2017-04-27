import path from 'path'
import React from 'react'
import ReactLoadable from 'react-loadable'
import Loading from './Loading'
import styles from '../css/App.css'

export default class App extends React.Component {
  // set `show` to `true` to see dynamic chunks served by initial request
  // set `show` to `false` to test how asynchronously loaded chhunks behave,
  // specifically how css injection is embedded in chunks + corresponding HMR
  state = {
    show: true
  }

  componentDidMount() {
    setTimeout(() => {
      console.log('showing <Example />')
      this.setState({ show: true })
    }, 2000)
  }

  render() {
    return (
      <div>
        <h1 className={styles.title}>Hello World</h1>
        {this.state.show && <Example />}
      </div>
    )
  }
}

const Example = ReactLoadable({
  loader: () => fakeDelay(1200).then(() => import('./Example')),
  LoadingComponent: Loading

  // if we weren't using the React Loadable babel plugin, you'd need this:
  // serverSideRequirePath: path.resolve(__dirname, './Example'),
  // webpackRequireWeakId: () => require.resolveWeak('./Example')
})

const fakeDelay = ms => new Promise(resolve => setTimeout(resolve, ms))
