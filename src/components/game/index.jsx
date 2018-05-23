import React from 'react';
import NameInput from './nameInput';
import JoinList from './joinList';
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
      answer,
      rank,
      selectedOption,
      selectOption,
      addPlayer
    } = this.props;
    if (player === null) {
      return <NameInput addPlayer={addPlayer} />;
    }
    switch (stage) {
      case GameStage.JOIN:
        return <JoinList players={players} player={player} />;
      case GameStage.START_QUESTION:
        return <QA
          rank={rank}
          player={player}
          stage={stage}
          question={question}
          options={options} />
      case GameStage.START_ANSWER:
        return <QA
          rank={rank}
          player={player}
          stage={stage}
          question={question}
          options={options}
          selectedOption={selectedOption}
          selectOption={selectOption} />
      case GameStage.REVEAL_ANSWER:
        return <QA
          rank={rank}
          player={player}
          stage={stage}
          question={question}
          options={options}
          selectedOption={selectedOption}
          answer={answer} />
      case GameStage.SCORE:
        return <Score rank={rank} player={player} />
      default:
        return null;
    }
  }
}

export default Game;