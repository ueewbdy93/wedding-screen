import React, { Component } from 'react';
import { connect } from 'react-redux';
import SlideContainer from './SlideContainer';
// import GameContainer from './GameContainer';

function App(props) {
  const { mode } = props;
  switch (mode) {
    case 1:
      return <SlideContainer />;
    // case 0:
    //   return <GameContainer />;
    default:
      return <div>loading...</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    mode: state.common.mode
  };
};

export default connect(mapStateToProps, null)(App);
