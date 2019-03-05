import React, { Component } from 'react';
import { ABI } from './abi';
import { CONTRACT_ADDRESS } from './constants';
import Web3 from 'web3'
import UnlockMetamask from '../layout/metamask/UnlockMetamask';
import Preloader from '../layout/Preloader'
import TokenSummary from './TokenSummary';
import Error from '../layout/Error'

class App extends Component {
  constructor() {
    super();
    this.state = {
      isOnEthereum: false,
      contractInstance: null,
      web3Instance: null,
      isLoading: false,
      token_id: "",
      token_metadata: "",
      errorMessage: null
    }


    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getTokenByID = this.getTokenByID.bind(this);
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

  // On loaded component,
  // get back the web3 instance created by MetaMask plugin
  // Init the counter value
  async componentDidMount() {
    try {
      if (typeof web3 !== 'undefined') {
        // eslint-disable-next-line
        await this.setState({ web3Instance: new Web3(web3.currentProvider) })
        await this.setState({ isOnEthereum: true })
      } else {
        await this.setState({ web3Instance: new Web3(new Web3.providers.HttpProvider('http://localhost:8545')) })
      }

      await this.setState({
        contractInstance: new this.state.web3Instance.eth.Contract(ABI, CONTRACT_ADDRESS)
      })
      await this.setState({
        contract_name: await this.state.contractInstance.methods.symbol().call()
      })
    } catch (e) {
      console.error(e)
      this.setState({ isOnEthereum: false })
    }
  }



  async getTokenByID(token_id) {
    console.log("getting the token info for id: " + token_id)
    if (!this.state.isOnEthereum) {
      this.setState({ isLoading: false })
      return;
    }

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


    if (!this.state.isOnEthereum) {
      return (
        <div className="App">
          <UnlockMetamask />
        </div>
      )
    }
    return (
      <div className="App">
        <div className="container">
          <form className="col s12">
            <div className="row">
              <div className="input-field col s6">
                <input
                  id="token_id"
                  name="token_id"
                  placeholder="Token ID"
                  onChange={this.onChange}
                />
              </div>
              <div className="input-field col s6">
                <button
                  className="btn green"
                  type="button"
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
