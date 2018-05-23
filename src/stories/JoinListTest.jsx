import React from 'react';
import faker from 'faker/locale/zh_TW';
import JoinList from '../components/game/joinList';

class JoinListTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }
  componentDidMount() {
    const timeoutHandler = (count) => {
      console.log(count);
      this.setState((preState) => {
        const name = faker.name.findName();
        const id = faker.random.number();
        return { users: [{ name: name, id }, ...preState.users] };
      });
      const nextTimeout = Math.floor(Math.random() * 10) * 100 + 500;
      if (count < 100) {
        setTimeout(timeoutHandler, nextTimeout, count + 1);
      }
    }
    setTimeout(timeoutHandler, 1000, 0);
  }
  render() {
    return (<JoinList users={this.state.users} />)
  }
}

export default JoinListTest;