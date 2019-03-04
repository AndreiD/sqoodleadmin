import React, { Component } from 'react';
import Preloader from '../layout/Preloader';


class AddBadge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      info: '',
      isLoading: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.saveBadge = this.saveBadge.bind(this)

  }



  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const post = {
      name: this.state.name,
      info: this.state.info
    };

    console.log('post', post)

    this.saveBadge(post)

    // this.props.createPost(post);
  }



  async saveBadge(post) {
    console.log("saving...", post)
    // if (!this.state.isOnEthereum) {
    //   return window.alert('please connect to metamask before using this app!')
    // }

    if (post.name === "" || post.info === "") {
      alert("Please fill the name and the info")
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

  render() {
    return (
      <div className="container">
        <form className="white" onSubmit={this.onSubmit}>
          <h5 className="grey-text text-darken-3">Create a New Badge</h5>
          <div className="input-field">
            <input type="text" id='title' onChange={this.onChange} />
            <label htmlFor="title">Badge Title</label>
          </div>
          <div className="input-field">
            <textarea id="content" className="materialize-textarea" onChange={this.onChange}></textarea>
            <label htmlFor="content">Badge Metadata</label>
          </div>
          <div className="input-field">
            <button className="btn btn-large pink lighten-1">Create</button>
          </div>
        </form>
      </div>
    );
  }
}


export default AddBadge;
