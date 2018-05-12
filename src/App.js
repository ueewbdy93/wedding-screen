import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    const { fetching, dog, onRequestDog, error } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <img src={dog || logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Dog Saga</h1>
        </header>

        {
          dog ? (
            <p className="App-intro">Keep clicking for new dogs</p>
          ) : (
              <p className="App-intro">Replace the React icon with a dog!</p>
            )
        }
        {
          fetching ? (
            <button disabled={true}>Fetching...</button>
          ) : (
              <button onClick={onRequestDog}>Request a Dog</button>
            )
        }

        {error && <p style={{ color: "red" }}>Uh oh - something went wrong!</p>}

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dog: state.dog,
    error: state.error,
    fetching: state.fetching,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRequestDog: () => dispatch({ type: "API_CALL_REQUEST" })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
