import React from 'react';
import { Container, Content, Header } from '../game/common';
import GameMgr from './gameMgr';
import SlideMgr from './slideMgr';
import Nav from './nav';
import './admin.css';

class Adm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'comment'
    };
    this.onTabClick = this.onTabClick.bind(this);
  }
  onTabClick(tab) {
    this.setState({ selectedTab: tab })
  }
  render() {
    const {
      mode,
      changeMode
    } = this.props;
    const { selectedTab } = this.state;
    const onTabClick = this.onTabClick;
    return (
      <Container>
        <Header hideBottomBorder>
          <h3 className="masthead-brand">
            後台
          </h3>
          <Nav
            mode={mode}
            selectedTab={selectedTab}
            onSwitchMode={changeMode}
            onSwitchTab={onTabClick} />
        </Header>
        <Content>
          <div style={{ padding: '10px' }}>
            {mode === 0 && <GameMgr {...this.props} selectedTab={selectedTab} />}
            {mode === 1 && <SlideMgr {...this.props} />}
          </div>
        </Content>
      </Container>
    );
  }
}

export default Adm;