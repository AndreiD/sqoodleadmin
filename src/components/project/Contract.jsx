import React from 'react';

function Contract(props) {
  console.log("props from contract: ", props)
  if (props.tokenAmount === null) {
    return (<p className="center">Loading...</p>);
  }
  return (
    <div className="container">
      <div className="row center">
        <h3>Total {props.tokenAmount}</h3>
      </div>
    </div>
  )
}

export default Contract;
