import React from 'react';
import Transition from 'react-transition-group/Transition';
import { Container, Header, Content } from './common';

const duration = 300;
const COLORS = [
  'lightblue',
  'lightcoral',
  'lightgreen',
  'lightpink',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
];

const defaultStyle = {
  float: 'left',
  whiteSpace: 'pre',
  borderRadius: '30px',
  color: 'dimgray',
  margin: '2px',
  padding: '5px 20px',
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
};

function JoinUser({ player }) {
  const hash = Number.parseInt(player.id.substring(0, 8), 16);
  return (
    <Transition in appear timeout={duration}>
      {(state) => (
        <span style={{
          ...defaultStyle,
          ...transitionStyles[state],
          backgroundColor: COLORS[hash % COLORS.length]
        }}>
          {player.name}
        </span>
      )}
    </Transition>
  );
}

function JoinList({ players, player }) {
  return (
    <Container>
      <Header title="等待其它人加入"></Header>
      <Content>
        <div style={{ height: '100%', overflowY: 'scroll' }}>
          <small>人數: {players.length}</small><br />
          {players.map(player => <JoinUser key={player.id} player={player} />)}
        </div>
      </Content>
    </Container>
  )
}

export default JoinList;