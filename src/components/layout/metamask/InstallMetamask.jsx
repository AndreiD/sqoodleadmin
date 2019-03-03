import React from 'react';

function InstallMetamask() {
    return (
        <div className="container">
            <div className="row">
                <div className="col s12">
                    <div className="card-panel center">
                        <span className="red-text text-darken-2 flow-text">You need to install Metamask in order to run this application.</span>
                        <p>Click the fox to get redirected to Metamask homepage</p>
                        <p className="image">
                            <a href="https://metamask.io/" rel="noopener noreferrer" target="_blank">
                                <img src="https://metamask.io/img/metamask.png" alt="metamask logo"></img>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstallMetamask;
