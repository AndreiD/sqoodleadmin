import React from 'react'

const TokenSummary = (props) => {

  var decodedData = window.atob(props.metadata);
  var jsonData = JSON.parse("[" + decodedData + "]");
  var metadata = jsonData[0];

  if (!props.metadata) {
    return null;
  }
  return (
    <div className="row">
      <div className="col s6">
        <ul className="collection with-header">
          <li className="collection-header"><h4>{metadata['last_name']} {metadata['first_name']}</h4></li>
          <li className="collection-item"><img style={{ width: '75px', height: "75px" }} src={metadata['icon']} alt="icon"></img></li>
          <li className="collection-item"><i className="material-icons circle left">offline_bolt</i>{metadata['type']}</li>
          <li className="collection-item"><i className="material-icons circle left">store</i> Organization: {metadata['issuing_organization']}</li>
          <li className="collection-item"><i className="material-icons circle left">fingerprint</i> Serial Number: {metadata['serial_number']}</li>
          <li className="collection-item"><i className="material-icons circle left">date_range</i> Issue Date: {metadata['issue_date']}</li>
          <li className="collection-item"><i className="material-icons circle left">hourglass_empty</i> Expiry Date: {metadata['expiry_date']}</li>
          <li className="collection-item">{metadata['description']}</li>
        </ul>
      </div>
    </div>
  )
}

export default TokenSummary
