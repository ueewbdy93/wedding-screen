import React from 'react';
import Transition from 'react-transition-group/Transition';
import { Container, Header, Content } from './common';

const duration = 300;
const COLORS = [
  'badge-primary',
  'badge-secondary',
  'badge-success',
  'badge-danger',
  'badge-warning',
  'badge-info',
  'badge-light',
];

const defaultStyle = {
  float: 'left',
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
};

function JoinUser({ player, me }) {
  const hash = Number.parseInt(player.id.substring(0, 8), 16);
  return (
    <Transition in appear timeout={duration}>
      {(state) => (
        <h3 style={{
          ...defaultStyle,
          ...transitionStyles[state]
        }}>
          <span className={`badge badge-pill ${COLORS[hash % COLORS.length]}`} >
            {me && <small><i className="mr-1 fas fa-user"></i></small>}
            {player.name}
          </span>
        </h3>
      )}
    </Transition>
  );
}

class JoinList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: '.',
    };
    this.tick = null;
  }
  componentDidMount() {
    this.tick = setInterval(() => {
      this.setState(preState => {
        const { loading } = preState;
        if (loading === '..') {
          return { loading: '' };
        } else {
          return { loading: `.${loading}` }
        }
      })
    }, 800);
  }
  componentWillUnmount() {
    clearInterval(this.tick);
  }
  render() {
    const { players, player } = this.props;
    const { loading } = this.state;
    return (
      <Container>
        <Header>
          <h3 className="mb-0">{`等待其它人加入${loading}`}</h3>
          <small>報名人數: {players.length}</small>
        </Header>
        <Content>
          <div className="row">
            <div
              className="offset-md-2 col-md-8 col-sm-12 d-flex justify-content-center align-items-center"
              style={{ flexWrap: 'wrap', overflowY: 'auto' }}>
              {players.map(p => <JoinUser key={p.id} player={p} me={p.id === player.id} />)}
            </div>
          </div>
        </Content>
      </Container>
    )
  }
}

export default JoinList;