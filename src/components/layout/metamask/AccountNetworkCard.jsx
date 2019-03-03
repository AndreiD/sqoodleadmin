import React from 'react';

function AccountNetworkCard(props) {
  if (!props.networkName) {
    return null;
  }
  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <div className="card green darken-3">
          <div className="card-content white-text">
            {props.networkName && <span className="card-title"><i className=" material-icons left white-text">network_check</i> Network: {props.networkName}</span>}
            {props.account && <p><i className=" material-icons left white-text">account_box</i> Account: {props.account}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountNetworkCard
