import React, { Component } from 'react';
import Preloader from '../layout/Preloader';

import Error from '../layout/Error'

class AddToken extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      token_id: '',
      token_name: '',
      icon: '',
      last_name: '',
      first_name: '',
      issuing_organization: '',
      serial_number: '',
      issue_date: '',
      expiry_date: '',
      description: '',
      isLoading: false,
      errorMessage: null
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.saveToken = this.saveToken.bind(this)

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

    const token = {
      type: this.state.type,
      token_id: this.state.token_id,
      token_name: this.state.token_name,
      icon: this.state.icon,
      last_name: this.state.last_name,
      first_name: this.state.first_name,
      issuing_organization: this.state.issuing_organization,
      serial_number: Math.floor(Math.random() * 100000000),
      issue_date: this.state.issue_date,
      expiry_date: this.state.expiry_date,
      description: this.state.description,
    };

    this.saveToken(token)

    // this.props.createPost(post);
  }

  async componentDidMount() {

    this.initMetamaskCallback(window.web3);
  }


  async saveToken(token) {
    console.log("saving -> ", token)

    // if (!this.state.isOnEthereum) {
    //   return window.alert('please connect to metamask before using this app!')
    // }

    if (token.type === "" || token.icon === "" || token.name === "" || token.last_name === "") {
      this.setState({ errorMessage: "Please fill all the information on the form" })
      return
    }

    this.setState({ isLoading: true })

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



    // let networkName, that = this;
    // switch (networkVersion) {
    //   case "1":
    //     networkName = "Main";
    //     break;
    //   case "2":
    //     networkName = "Morden";
    //     break;
    //   case "3":
    //     networkName = "Ropsten";
    //     break;
    //   case "4":
    //     networkName = "Rinkeby";
    //     break;
    //   case "42":
    //     networkName = "Kovan";
    //     break;
    //   default:
    //     networkName = networkVersion;
    // }
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
      </div>
    );
  }
}


export default AddToken;
