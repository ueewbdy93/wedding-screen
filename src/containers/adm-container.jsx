import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Adm from '../components/adm';
import { Actions } from '../reducers/adm';

const mapStateToProps = (state) => {
  return {
    comments: state.admin.comments,
    login: state.admin.login,
    question: state.admin.question,
    playerVotes: state.admin.playerVotes,
    mode: state.common.mode,
    players: state.game.players,
    stage: state.game.stage,
    vote: state.game.vote,
    intervalMs: state.game.intervalMs,
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
    onClearComment: bindActionCreators(Actions.onClearComment, dispatch),
    onInsertComment: bindActionCreators(Actions.onInsertComment, dispatch),
    onResetGame: bindActionCreators(Actions.onResetGame, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Adm);