import React from 'react'

export default function Preloader({ show }) {
  if (show) {
    return (
      <div className="xcentered preloader-wrapper big active">
        <p>loading...</p>
        <div className="spinner-layer spinner-blue">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div><div className="gap-patch">
            <div className="circle"></div>
          </div><div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}
