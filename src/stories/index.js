import React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import Score from '../components/game/score';
// import Slideshow from '../components/slideshow';

function genPlayer(id, rank, score, state, correctCount, incorrectCount, time) {
  return {
    id,
    rank,
    score,
    state,
    correctCount,
    incorrectCount,
    time,
    name: `Player${id}`,
  }
}

const PlayerState = { NEW: 0, UP: 1, DOWN: 2, EQUAL: 3 }
const players = [
  genPlayer(1, 1, 100, PlayerState.UP, 10, 0, 1000),
  genPlayer(2, 2, 99, PlayerState.DOWN, 10, 0, 1000),
  genPlayer(3, 3, 98, PlayerState.EQUAL, 10, 0, 1000),
  genPlayer(4, 4, 97, PlayerState.UP, 10, 0, 1000),
  genPlayer(5, 5, 96, PlayerState.UP, 10, 0, 1000),
  genPlayer(6, 6, 95, PlayerState.UP, 10, 0, 1000),
  genPlayer(7, 7, 94, PlayerState.UP, 10, 0, 1000),
  genPlayer(8, 8, 93, PlayerState.UP, 10, 0, 1000),
  genPlayer(9, 9, 92, PlayerState.UP, 10, 0, 1000),
  genPlayer(10, 10, 91, PlayerState.UP, 10, 0, 1000),
  genPlayer(11, 11, 90, PlayerState.UP, 10, 0, 1000),
  genPlayer(12, 12, 89, PlayerState.UP, 10, 0, 1000)
];

storiesOf('排行榜', module)
  .add('前10名', () => <Score players={players} player={players[0]} />)
  .add('第11名', () => <Score players={players} player={players[10]} />)
  .add('11名以後', () => <Score players={players} player={players[11]} />);
