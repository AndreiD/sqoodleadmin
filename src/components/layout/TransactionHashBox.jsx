import React from 'react';

function TransactionHashBox({ hash }) {

  if (hash == null) {
    return null
  }

  var etherScanLink = "https://rinkeby.etherscan.io/tx/" + hash

  return (
    <div className="row" style={{ marginTop: "30px" }}>
      <div className="col s12">
        <div className="card-panel green darken-4 z-depth-0">
          <span className="white-text text-lighten-2"><i className="material-icons circle left">info_outline</i>Tx Hash: {hash}</span>
          <p><a target="_blank" rel="noopener noreferrer" className="btn white black-text" href={etherScanLink}>View on Etherscan</a></p>
        </div>
      </div>
    </div >
  )
}

export default TransactionHashBox;
