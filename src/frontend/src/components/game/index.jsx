import React from 'react';
import NameInput from './name-input';
import JoinList from './join-list';
import QA from './qa';
import Score from './score';
import { GameStage } from '../../constants';

class Game extends React.Component {
  componentDidMount() {
    const { init } = this.props;
    init();
  }
  render() {
    const {
      stage,
      player,
      players,
      question,
      options,
      answers,
      curVote,
      selectOption,
      addPlayer,
      intervalMs
    } = this.props;
    if (player === null || player === undefined) {
      return <NameInput addPlayer={addPlayer} />;
    }
    switch (stage) {
      case GameStage.JOIN:
        return <JoinList players={players} player={player} />;
      case GameStage.START_QUESTION:
      case GameStage.START_ANSWER:
      case GameStage.REVEAL_ANSWER:
        return <QA
          intervalMs={intervalMs}
          players={players}
          player={player}
          stage={stage}
          question={question}
          options={options}
          curVote={curVote}
          selectOption={selectOption}
          answers={answers} />
      case GameStage.SCORE:
        return <Score players={players} player={player} />
      default:
        return null;
    }
  }
}

export default Game;