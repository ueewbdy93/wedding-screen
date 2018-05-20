import React from 'react';
import { connect } from 'react-redux';
import Game from '../components/game';

const mapStateToProps = (state) => {
  return {
    player: state.game.player,
    players: state.game.players,
    stage: state.game.stage,
    question: state.game.question,
    options: state.game.options,
    solution: state.game.solution,
    score: state.game.score
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setName: (name) => dispatch({ type: 'SEND_TO_SERVER', data: { type: 'SET_NAME', data: name } })
    // addComment: (comment) => dispatch({ type: 'SEND_TO_SERVER', data: { type: 'NEW_COMMENT', data: comment } })
    // onRequestDog: () => dispatch({ type: "API_CALL_REQUEST" })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);