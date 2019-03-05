import React, { Component } from 'react';
import { ABI } from './abi';
import { CONTRACT_ADDRESS } from './constants';
import Web3 from 'web3'
import Preloader from '../layout/Preloader'
import TokenSummary from './TokenSummary';
import Error from '../layout/Error'


class App extends Component {
  constructor() {
    super();
    this.state = {
      contractInstance: null,
      web3Instance: null,
      isLoading: false,
      token_id: "",
      token_metadata: "",
      errorMessage: null,
      isMinter: true,
      web3: null
    }


    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getTokenByID = this.getTokenByID.bind(this);


    // Modern DApp Browsers
    if (window.ethereum) {
      this.state.web3 = new Web3(window.ethereum)

      try {
        window.ethereum.enable().then(function () {
          console.log("User has allowed account access to DApp...")
        });
      } catch (e) {
        console.log("error in metamask initialization: ", e)
        this.setState({ errorMessage: "you denied access to this DApp from Metamask" })
      }
    }
    // Legacy DApp Browsers
    else if (window.web3) {
      this.state.web3 = new Web3(this.state.web3.currentProvider);
    }
    // Non-DApp Browsers
    else {
      this.setState({ errorMessage: "please install and unlock metamask in order to use this application" })
    }
  }

  onChange(event) {
    this.setState({ errorMessage: null }) // close any errors
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.id;

    this.setState({
      [name]: value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.getTokenByID(this.state.token_id)
  }

  async componentDidMount() {
    try {
      await this.setState({
        contractInstance: new this.state.web3.eth.Contract(ABI, CONTRACT_ADDRESS)
      })
    } catch (e) {
      console.error(e)
      this.setState({ errorMessage: "please install and unlock metamask in order to use this application" })
    }
  }


  async getTokenByID(token_id) {
    console.log("getting the token info for id: " + token_id)

    this.setState({ isLoading: true })

    try {
      const result = await this.state.contractInstance.methods.tokenURI(token_id).call()
      await this.setState({ token_metadata: result })
    } catch (e) {
      console.log('get balance failed. Failed message: ' + e)
      await this.setState({ errorMessage: "No token with this ID found. " + e.toString() })
    }

    this.setState({ isLoading: false })
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <form className="col s12">
            <div className="row">

              <div className="input-field col s3 offset-s3">
                <input type="text" id='token_id' onChange={this.onChange} />
                <label htmlFor="token_id">Token ID</label>
              </div>


              <div className="input-field col s6">
                <button
                  className="btn waves-effect waves-light"
                  type="submit"
                  onClick={this.onSubmit}
                >SEARCH</button>
              </div>
            </div>
          </form>
          <Preloader show={this.state.isLoading} />
          <TokenSummary metadata={this.state.token_metadata} />
          <Error errorMessage={this.state.errorMessage} />
        </div>
      </div>
    );
  }
}

export default App;
