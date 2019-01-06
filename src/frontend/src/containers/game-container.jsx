import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Game from '../components/game';
import { Actions } from '../reducers/game';

const mapStateToProps = (state) => {
  return {
    player: state.game.player,
    players: state.game.players,
    stage: state.game.stage,
    question: state.game.question,
    options: state.game.options,
    answers: state.game.answers,
    curVote: state.game.curVote,
    intervalMs: state.game.intervalMs,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    init: bindActionCreators(Actions.init, dispatch),
    addPlayer: bindActionCreators(Actions.addPlayer, dispatch),
    selectOption: bindActionCreators(Actions.selectOption, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);