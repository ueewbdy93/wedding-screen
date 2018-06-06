import React from 'react';
import { connect } from 'react-redux';
import SlideshowContainer from './SlideshowContainer';
import GameContainer from './GameContainer';

function App(props) {
  const { mode } = props;
  switch (mode) {
    case 1:
      return <SlideshowContainer />;
    case 0:
      return <GameContainer />;
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
