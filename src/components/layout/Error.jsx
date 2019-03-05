import React from 'react';

function Error({ errorMessage }) {

  if (errorMessage == null) {
    return null
  }

  return (
    <div className="row">
      <div className="col s12">
        <div className="card-panel grey darken-4 z-depth-0">
          <span className="red-text text-lighten-2"><i className="material-icons circle left">error_outline</i>{errorMessage}</span>
        </div>
      </div>
    </div>
  )
}

export default Error;
