import React from 'react'

export default ({ isLoading, pastDelay, error }) => {
  if (isLoading && pastDelay) {
    return <p>Loading...</p>
  } else if (error && !isLoading) {
    return <p>Error!</p>
  } else {
    return null
  }
}
