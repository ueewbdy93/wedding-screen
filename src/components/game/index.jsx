import React from 'react';
import NameInput from './nameInput';
import JoinList from './joinList';
import QA from './qa';
import Score from './score';
import Final from './final';

function Game(props) {
  const {
    stage,
    player,
    players,
    question,
    options,
    solution,
    rank,
    onOptionSelect,
    addPlayer
  } = props;
  switch (stage) {
    case 'JOIN':
      return player ?
        <NameInput addPlayer={addPlayer} /> :
        <JoinList players={players} player={player} />;
    case 'START_QUESTION':
      return <QA rank={rank} player={player} stage={stage} question={question} options={options} />
    case 'START_ANSWER':
      return <QA rank={rank} player={player} stage={stage} question={question} options={options} onOptionSelect={onOptionSelect} />
    case 'REVEAL_ANSWER':
      return <QA rank={rank} player={player} stage={stage} question={question} options={options} answer={solution} />
    case 'SCORE':
      return <Score rank={rank} player={player} />
    case 'FINAL':
      return <Final rank={rank} player={player} />;
    default:
      return null;
  }
}

export default Game;