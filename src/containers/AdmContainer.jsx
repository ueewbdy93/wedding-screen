import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Adm from '../components/adm';
import { Actions } from '../reducers/adm';

const mapStateToProps = (state) => {
  return {
    login: state.admin.login,
    mode: state.common.mode,
    players: state.game.players,
    stage: state.game.stage,
    question: state.game.question,
    options: state.game.options,
    answer: state.game.answer,
    score: state.game.score
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeMode: bindActionCreators(Actions.changeMode, dispatch),
    startQuestion: bindActionCreators(Actions.startQuestion, dispatch),
    startAnswer: bindActionCreators(Actions.startAnswer, dispatch),
    revealAnswer: bindActionCreators(Actions.revealAnswer, dispatch),
    showScore: bindActionCreators(Actions.showScore, dispatch),
    adminLogin: bindActionCreators(Actions.adminLogin, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Adm);