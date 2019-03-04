import React, { Component } from 'react';
import { MIN_ABI } from './abi';
import { CONTRACT_ADDRESS } from './constants';
import Web3 from 'web3'
import UnlockMetamask from '../layout/metamask/UnlockMetamask';
import Preloader from '../layout/Preloader'
import BadgeList from '../project/BadgesList';


class App extends Component {
  constructor() {
    super();
    this.state = {
      isOnEthereum: false,
      contractInstance: null,
      web3Instance: null,
      isLoading: false,
      badges: [{
        'title': 'the title',
        'metadata': 'the metadata'
      }]
    }

    //need to bind the function to have access to this
    this.getBadges = this.getBadges.bind(this)
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



  async getBadges() {
    console.log("getting the badges...")
    if (!this.state.isOnEthereum) {
      this.setState({ isLoading: false })
      return;
    }

    this.setState({ isLoading: true })

    try {
      const result = await this.state.contractInstance.methods.balanceOf("0x000000dE5F9e90CE604Da5FD78ACd6FAE789eCCA").call()
      await this.setState({ balanceValue: JSON.stringify(result) })
    } catch (e) {
      console.log('get balance failed. Failed message: ' + e)
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
        <Preloader show={this.state.isLoading} />
        <BadgeList />
      </div>
    );
  }
}

export default App;
