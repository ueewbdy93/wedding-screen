import React from 'react';
import { Container, Header, Content } from './common';
import Profile from './profile';

const PlayerState = { NEW: 0, UP: 1, DOWN: 2, EQUAL: 3 }

function PlayerStateIcon(props) {
  const { state } = props;
  switch (state) {
    case PlayerState.UP:
      return <i className="fas fa-caret-up"></i>;
    case PlayerState.DOWN:
      return <i className="fas fa-caret-down"></i>;
    default:
      return <i className="invisible fas fa-caret-down"></i>;
  }
}

function ScoreItem(props) {
  const { player, isCurrentPlayer } = props;
  return (
    <li
      key={player.id}
      className={isCurrentPlayer ? 'border-bottom bg-info media' : 'border-bottom media'}
      style={{ padding: '5px' }}>
      <h2
        className="mr-1 mb-0 align-self-center"
        style={{ minWidth: '65px', textAlign: 'center' }}>
        {player.rank === 999 ? 'N/A' : player.rank}
        <small className="ml-1">
          <PlayerStateIcon state={player.state} />
        </small>
      </h2>
      <div className="media-body" style={{ textAlign: 'left' }}>
        <h3 className="mt-0 mb-0">{player.name}</h3>
        <Profile short={true} player={player} />
      </div>
    </li>
  )
}

function Score(props) {
  const { players, player: { id } } = props;
  const player = players.find(p => p.id === id);
  if (player === undefined) {
    return window.location.reload();
  }
  const top10 = players.filter(p => p.rank <= 10);
  return (
    <Container>
      <Header>
        <h2 className="masthead-brand">
          <small><i className="fas fa-trophy"></i></small>
          {` 排行榜 `}
          <small><i className="fas fa-trophy"></i></small>
        </h2>
        <Profile player={player} />
      </Header>
      <Content>
        <div className="ml-auto mr-auto col-md-6 col-sm-12">
          <ul className="list-unstyled">
            {top10.map(p => <ScoreItem player={p} isCurrentPlayer={p.id === id} />)}
            {player.rank > 11 && <li><i className="fas fa-ellipsis-v"></i></li>}
            {player.rank > 10 && <ScoreItem player={player} isCurrentPlayer={true} />}
          </ul>
        </div>
      </Content>
    </Container>
  )
}

export default Score;