import React, { Component } from 'react';
import Preloader from '../layout/Preloader';
import Web3 from 'web3'
import Error from '../layout/Error'
import { ABI } from './abi';
import { CONTRACT_ADDRESS } from './constants';
import TransactionHashBox from '../layout/TransactionHashBox';
import M from "materialize-css";

class Minters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is_minter_address: null,
      new_minter_address: null,
      erase_token_id: null,
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
    this.onSubmitBurn = this.onSubmitBurn.bind(this);
    this.onSubmitCheckMinter = this.onSubmitCheckMinter.bind(this);
    this.onSubmitNewMinter = this.onSubmitNewMinter.bind(this);
    this.renounceMinter = this.renounceMinter.bind(this);

    // Modern DApp Browsers
    if (window.ethereum) {
      this.state.web3 = new Web3(window.ethereum)

      try {
        window.ethereum.enable().then(function () {
          console.log("User has allowed account access to DAPP...")
        });
      } catch (e) {
        console.log("error in metamask initialization: ", e)
        this.setState({ errorMessage: "you denied access to this DAPP from Metamask" })
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
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.id;

    this.setState({
      [name]: value
    });
  }

  onSubmitNewMinter(e) {
    e.preventDefault();

    if (!this.state.web3.utils.isAddress(this.state.new_minter_address)) {
      this.setState({ errorMessage: "invalid ETH address entered" })
      return
    }

    this.setState({ isLoading: true })


    const addNewMinter = async () => {
      try {
        await this.state.contractInstance.methods.addMinter(this.state.new_minter_address).send({
          from: this.state.selectedAddress,
          gas: 1234000,
        }).on("transactionHash", hash => {
          this.setState({ pendingCreateTx: hash });
        });
        this.setState({ isLoading: false })
      }
      catch (e) {
        console.log(e);
        this.setState({ errorMessage: e.toString() })
        this.setState({ isLoading: false })
      }
    }
    addNewMinter.call();

  }

  onSubmitBurn(e) {
    e.preventDefault();

    console.log('burning = >', this.state.erase_token_id)

    this.setState({ isLoading: true })


    const burnToken = async () => {
      try {
        await this.state.contractInstance.methods.burn(this.state.erase_token_id).send({
          from: this.state.selectedAddress,
          gas: 1234000,
        }).on("transactionHash", hash => {
          this.setState({ pendingCreateTx: hash });
        });
        this.setState({ isLoading: false })
      }
      catch (e) {
        console.log(e);
        this.setState({ errorMessage: e.toString() })
        this.setState({ isLoading: false })
      }
    }
    burnToken.call();

  }

  onSubmitCheckMinter(e) {
    e.preventDefault();

    if (!this.state.web3.utils.isAddress(this.state.is_minter_address)) {
      this.setState({ errorMessage: "invalid ETH address entered" })
      return
    }

    const checkMinter = async () => {
      try {
        const result = await this.state.contractInstance.methods.isMinter(this.state.is_minter_address).call()
        if (result === false) {
          M.toast({ html: "<p style='color:#ef5350'>This address is not a minter<p>", classes: 'rounded' });
        } else {
          M.toast({ html: "<p style='color:#8bc341'>This address is a minter</p>", classes: 'rounded' });
        }
      } catch (e) {
        console.log('isMinter call failed: ' + e)
        this.setState({ errorMessage: e.toString() })
      }
    }
    checkMinter.call()
  }


  async renounceMinter(e) {
    e.preventDefault();
    this.setState({ isLoading: true })


    try {
      await this.state.contractInstance.methods.renounceMinter().send({
        from: this.state.selectedAddress,
        gas: 1234000,
      }).on("transactionHash", hash => {
        this.setState({ pendingCreateTx: hash });
      });
      this.setState({ isLoading: false })
    }
    catch (e) {
      console.log(e);
      this.setState({ errorMessage: e.toString() })
      this.setState({ isLoading: false })
    }
  }

  async componentDidMount() {
    M.AutoInit();
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
          this.setState({ isMinter: false })
        } else {
          this.setState({ isMinter: true })
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

    return (
      <div className="container">

        <Error errorMessage={this.state.errorMessage} />

        <div id="modalRenounceMinter" className="modal col s3">
          <div className="modal-content">
            <h5>Are you sure you want to renounce your minting powers ?</h5>
            <p>Only another minter can add you back</p>
          </div>
          <div className="modal-footer">
            <button onClick={this.renounceMinter} className="modal-action modal-close waves-effect waves-green btn-flat">YES, I DO</button>
            <button href="#!" className="modal-close modal-close waves-effect waves-red btn-flat">CANCEL</button>
          </div>
        </div>

        <form className="col s6 white" style={{ marginTop: '40px' }} onSubmit={this.onSubmitCheckMinter}>
          <div className="row">
            <h5 className="grey-text text-darken-3">Check if address is minter</h5>
            <div className="input-field col s3">
              <input type="text" id='is_minter_address' onChange={this.onChange} />
              <label htmlFor="is_minter_address">address</label>
            </div>
            <div className="input-field col s3">
              <button className="btn blue lighten-1 waves-effect waves-light">Check</button>
            </div>
          </div>
        </form>




        <form className="col s6 white" onSubmit={this.onSubmitNewMinter}>
          <div className="row">
            <h5 className="grey-text text-darken-3">Add New Minter</h5>
            <div className="input-field col s3">
              <input type="text" id='new_minter_address' onChange={this.onChange} />
              <label htmlFor="new_minter_address">address</label>
            </div>
            <div className="input-field col s3">
              <button className="btn green waves-effect waves-light">ADD</button>
            </div>
          </div>
        </form>



        <form className="col s6">
          <div className="row">
            <h5 className="grey-text text-darken-3">Burn Token ID</h5>
            <div className="input-field col s3">
              <input type="text" id='erase_token_id' onChange={this.onChange} />
              <label htmlFor="erase_token_id">Token ID</label>
            </div>


            <div className="input-field col s6">
              <button
                className="btn red waves-effect waves-light"
                type="submit"
                onClick={this.onSubmitBurn}
              >ERASE</button>
            </div>
          </div>
        </form>

        <p className="col s6 white">You can renounce your minter role by clicking this button</p>
        <button data-target="modalRenounceMinter" className="btn red lighten-1 waves-effect waves-light modal-trigger">Renounce Minter Role</button>




        <Preloader show={this.state.isLoading} />

        <TransactionHashBox hash={this.state.pendingCreateTx} />

      </div>
    );
  }
}


export default Minters;
