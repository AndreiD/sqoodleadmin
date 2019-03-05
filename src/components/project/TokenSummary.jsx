import React from 'react'

const TokenSummary = (props) => {
  return (
    <div className="card z-depth-0 project-summary">
      <div className="card-content grey-text text-darken-3">
        <span className="card-title">{props.title}</span>
        <p>{props.metadata}</p>
        <p className="grey-text">other..</p>
      </div>
    </div>
  )
}

export default TokenSummary
