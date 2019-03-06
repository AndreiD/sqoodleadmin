import React from 'react';

function TransactionHashBox({ hash }) {

  if (hash == null) {
    return null
  }

  var etherScanLink = "https://rinkeby.etherscan.io/tx/" + hash

  return (
    <div className="row">
      <div className="col s12">
        <div className="card-panel grey darken-4 z-depth-0">
          <span className="blue-text text-lighten-2"><i className="material-icons circle left">info_outline</i>Tx Hash: {hash}</span>
          <p><a className="btn blue" href={etherScanLink}>View on Etherscan</a></p>
        </div>
      </div>
    </div >
  )
}

export default TransactionHashBox;
