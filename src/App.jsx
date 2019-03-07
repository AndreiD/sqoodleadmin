import React, { Component } from 'react';
import Navbar from './components/layout/Navbar'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import Home from './components/project/Home'
import About from './components/About'
import AddToken from './components/project/AddToken';
import { hot } from 'react-hot-loader/root'
import { setConfig } from 'react-hot-loader'
import Minters from './components/project/Minters';
import 'materialize-css/dist/css/materialize.min.css';

setConfig({
  ignoreSFC: true, // RHL will be __completely__ disabled for SFC
  pureRender: true, // RHL will not change render method
})

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/add_token' component={AddToken} />
            <Route path='/minters' component={Minters} />
            <Route path='/about' component={About} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default hot(App);
