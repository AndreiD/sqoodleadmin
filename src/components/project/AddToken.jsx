import React, { Component } from 'react';
import Preloader from '../layout/Preloader';
import Web3 from 'web3'
import Error from '../layout/Error'
import { ABI } from './abi';
import { CONTRACT_ADDRESS } from './constants';
import InfoBox from '../layout/TransactionHashBox';

class AddToken extends Component {
  constructor(props) {
    super(props);

    var today = (new Date()).toLocaleDateString('en-US');

    this.state = {
      to_address: '',
      type: '',
      token_id: '',
      token_name: '',
      icon: '',
      last_name: '',
      first_name: '',
      issuing_organization: '',
      serial_number: '',
      issue_date: today,
      expiry_date: 'no',
      description: '',
      isLoading: false,
      errorMessage: null,
      isMinter: true,
      web3: null,
      contractInstance: null,
      networkName: '',
      selectedAddress: '',
      pendingCreateTx: null
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.saveToken = this.saveToken.bind(this)


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
    const uuidv4 = require('uuid/v4');

    const token = {
      to_address: this.state.to_address,
      type: this.state.type,
      token_id: this.state.token_id,
      token_name: this.state.token_name,
      icon: this.state.icon,
      last_name: this.state.last_name,
      first_name: this.state.first_name,
      issuing_organization: this.state.issuing_organization,
      serial_number: uuidv4(),
      issue_date: this.state.issue_date,
      expiry_date: this.state.expiry_date,
      description: this.state.description,
    };

    this.saveToken(token)

    // this.props.createPost(post);
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
    this.initMetamaskCallback(window.web3);
  }


  async saveToken(token) {
    console.log("saving -> ", token)

    if (token.type === "" || token.icon === "" || token.name === "" || token.last_name === "") {
      this.setState({ errorMessage: "Please fill all the information on the form" })
      return
    }

    this.setState({ isLoading: true })


    var jsontext = '{"type":"' + token.type + '","token_id":"' + token.token_id + '","token_name":"' + token.token_name + '","icon":"' + token.icon + '","last_name":"' + token.last_name + '","first_name":"' + token.first_name + '","issuing_organization":"' + token.issuing_organization + '","serial_number":"' + token.serial_number + '","issue_date":"' + token.issue_date + '","expiry_date":"' + token.expiry_date + '","description":"' + token.description + '"}';
    console.log('jsontext', jsontext)
    var encodedData = btoa(jsontext);
    console.log('encodedData', encodedData)

    try {
      await this.state.contractInstance.methods.mintWithTokenURI(token.to_address, token.token_id, encodedData).send({
        from: this.state.selectedAddress,
        gas: 4000000,
      }).on("transactionHash", hash => {
        this.setState({ pendingCreateTx: hash });
      });
      // update progress UI
      this.setState({ isLoading: false })
      // reset transaction related form, if any
      //resetForm();
    }
    catch (e) {
      // if user cancel transaction at Metamask UI we'll get error and handle it here
      console.log(e);
      this.setState({ errorMessage: e.toString() })
      // update progress UI anyway
      this.setState({ isLoading: false })
    }



    //var contact = JSON.parse(jsontext);

    // try {
    //   const result = await this.state.contractInstance.methods.balanceOf("0x000000dE5F9e90CE604Da5FD78ACd6FAE789eCCA").call()
    //   await this.setState({ balanceValue: JSON.stringify(result) })
    // } catch (e) {
    //   console.log('get balance failed. Failed message: ' + e)
    // }

    // this.toggleLoader()


  }


  async initMetamaskCallback(web3) {
    try {
      web3.currentProvider.publicConfigStore.on('update', this.metamaskUpdateCallback);
    } catch (e) {
      console.error(e)
    }
  }


  metamaskUpdateCallback = ({ selectedAddress, networkVersion }) => {

    console.log('selectedAddress', selectedAddress)
    this.setState({ errorMessage: null })

    const checkMinter = async () => {
      try {
        const result = await this.state.contractInstance.methods.isMinter(selectedAddress).call()
        if (result === false) {
          this.setState({ errorMessage: "only minters are allowed to access this dapp" })
        }
      } catch (e) {
        console.log('isMinter call failed: ' + e)
      }
    }
    checkMinter.call()


    let networkName, that = this;
    switch (networkVersion) {
      case "1":
        networkName = "Main";
        break;
      case "2":
        networkName = "Morden";
        break;
      case "3":
        networkName = "Ropsten";
        break;
      case "4":
        networkName = "Rinkeby";
        break;
      case "42":
        networkName = "Kovan";
        break;
      default:
        networkName = networkVersion;
    }

    that.setState({ networkName, selectedAddress })
  }


  render() {
    var today = (new Date()).toLocaleDateString('en-US');

    return (
      <div className="container">
        <form className="white" onSubmit={this.onSubmit}>
          <h5 className="grey-text text-darken-3">Create a New Token</h5>

          <p style={{ marginTop: '40px' }}>
            <label>
              <input id="type" value="awards" className="with-gap" name="group1" type="radio" onChange={this.onChange} />
              <span>Awards & Recognition</span>
            </label>
          </p>
          <p>
            <label>
              <input id="type" value="trainings" className="with-gap" name="group1" type="radio" onChange={this.onChange} />
              <span>Trainings & Certifications</span>
            </label>
          </p>
          <p>
            <label>
              <input id="type" value="professional_memberships" className="with-gap" name="group1" type="radio" onChange={this.onChange} />
              <span>Professional Memberships</span>
            </label>
          </p>
          <p>
            <label>
              <input id="type" value="education" className="with-gap" name="group1" type="radio" onChange={this.onChange} />
              <span>Education</span>
            </label>
          </p>
          <p>
            <label>
              <input id="type" value="licenses" className="with-gap" name="group1" type="radio" onChange={this.onChange} />
              <span>Licenses</span>
            </label>
          </p>

          <div className="input-field" style={{ marginTop: '40px' }}>
            <input type="text" id='to_address' onChange={this.onChange} />
            <label htmlFor="to_address">To Address</label>
          </div>


          <div className="input-field">
            <input type="text" id='token_id' onChange={this.onChange} />
            <label htmlFor="token_id">Token ID</label>
          </div>


          <div className="input-field">
            <input type="text" id='token_name' onChange={this.onChange} />
            <label htmlFor="token_name">Token Name</label>
          </div>

          <div className="input-field">
            <input type="text" id='icon' onChange={this.onChange} />
            <label htmlFor="icon">Icon URL</label>
          </div>

          <div className="input-field">
            <input type="text" id='last_name' onChange={this.onChange} />
            <label htmlFor="last_name">Last Name</label>
          </div>

          <div className="input-field">
            <input type="text" id='first_name' onChange={this.onChange} />
            <label htmlFor="first_name">First Name</label>
          </div>

          <div className="input-field">
            <input type="text" id='issuing_organization' onChange={this.onChange} />
            <label htmlFor="first_name">Issuing Organization</label>
          </div>

          <div className="input-field">
            <input type="text" id='issue_date' defaultValue={today} onChange={this.onChange} />
            <label className="active" htmlFor="issue_date">Issue Date (US Format)</label>
          </div>

          <div className="input-field">
            <input type="text" id='expiry_date' defaultValue="no" onChange={this.onChange} />
            <label className="active" htmlFor="expiry_date">Expiry Date  (US Format)</label>
          </div>


          <div className="input-field">
            <textarea id="description" className="materialize-textarea" onChange={this.onChange}></textarea>
            <label htmlFor="description">Description</label>
          </div>


          <div className="input-field">
            <button className="btn btn-large pink lighten-1">Create</button>
          </div>
        </form>

        <Preloader show={this.state.isLoading} />
        <Error errorMessage={this.state.errorMessage} />
        <InfoBox infoMessage={'Pending Transaction Hash: ' + this.state.pendingCreateTx} />
      </div>
    );
  }
}


export default AddToken;
