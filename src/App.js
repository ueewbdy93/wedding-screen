import React, { Component } from 'react';
import { connect } from 'react-redux';
import SlideContainer from './containers/SlideContainer';

class App extends Component {
  render() {
    const { initing, showPicIndex, picUrls } = this.props;

    return (
      <SlideContainer initing={initing} showPicIndex={showPicIndex} picUrls={picUrls} />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    picUrls: state.picUrls,
    showPicIndex: state.showPicIndex,
    initing: state.initing
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // onRequestDog: () => dispatch({ type: "API_CALL_REQUEST" })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
