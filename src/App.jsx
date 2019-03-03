import React, { Component } from 'react';
import Navbar from './components/layout/Navbar'
import { MIN_ABI } from './components/project/abi';
import { CONTRACT_ADDRESS } from './components/project/constants';
import Web3 from 'web3'
import UnlockMetamask from './components/layout/metamask/UnlockMetamask';
import Preloader from './components/layout/Preloader';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isOnEthereum: false,
      balanceValue: 0,
      contractInstance: null,
      web3Instance: null,
      isLoading: false,
      hashes: []
    }

    //need to bind the function to have access to this

    this.getBalance = this.getBalance.bind(this)
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
        contractInstance: new this.state.web3Instance.eth.Contract(MIN_ABI, CONTRACT_ADDRESS)
      })
      // await this.setState({
      //   balanceValue: await this.state.contractInstance.methods.getBalance().call()
      // })
    } catch (e) {
      console.error(e)
      this.setState({ isOnEthereum: false })
    }
  }

  // A loader toggle function
  toggleLoader() {
    if (this.state.isLoading) {
      //loader.style.display = 'none'
      this.setState({ isLoading: false })
    } else {
      //loader.style.display = 'block'
      this.setState({ isLoading: true })
    }
  }

  async getBalance() {
    console.log("getting the balance...")
    if (!this.state.isOnEthereum) {
      return window.alert('please connect to metamask before using this app!')
    }

    this.toggleLoader()

    try {
      const result = await this.state.contractInstance.methods.balanceOf("0x000000dE5F9e90CE604Da5FD78ACd6FAE789eCCA").call()
      await this.setState({ balanceValue: JSON.stringify(result) })
    } catch (e) {
      console.log('get balance failed. Failed message: ' + e)
    }

    this.toggleLoader()
  }

  render() {
    let error
    if (!this.state.isOnEthereum) {
      return (
        <div className="App">
          <UnlockMetamask />
        </div>
      )
    }
    return (
      <div className="App">
        <Navbar />
        <Preloader show={this.state.isLoading} />
        {error}
        <h4>Hey Smart Contract!</h4>
        <p>
          Try to interact with a basic counter smart contract by updating the counter value and / or increasing its value by using the increment button.
        </p>
        <button className='btn green' onClick={this.getBalance}>Get Balance</button>
        <div className='container'>
          <h2>The balance value</h2>
          <p>{this.state.balanceValue}</p>
        </div>
      </div>
    );
  }
}

export default App;
