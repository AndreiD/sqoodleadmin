import React, { Component } from 'react';
import Navbar from './components/layout/Navbar'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import Home from './components/project/Home'
import About from './components/About'
import NewBadge from './components/project/AddBadge';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/add_badge' component={NewBadge} />
            <Route path='/about' component={About} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
