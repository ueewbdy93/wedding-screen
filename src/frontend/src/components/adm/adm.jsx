import React from 'react';
import { Container, Content, Header } from '../game/common';
import GameMgr from './game-mgr';
import SlideMgr from './slide-mgr';
import Nav from './nav';
import Download from './download';
import Rank from './rank';
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
      changeMode,
      comments,
      onClearComment,
      onInsertComment
    } = this.props;
    const { selectedTab } = this.state;
    const onTabClick = this.onTabClick;
    return (
      <Container>
        <Header hideBottomBorder>
          <h3 className="mb-0">
            後台
          </h3>
          <Nav
            mode={mode}
            selectedTab={selectedTab}
            onSwitchMode={changeMode}
            onSwitchTab={onTabClick} />
        </Header>
        <Content>
          <div className="row p-3 h-100" style={{ overflowY: 'auto' }}>
            <div className="col-md-6 offset-md-3 col-sm-12">
              {selectedTab === 'game' && <GameMgr {...this.props} selectedTab={selectedTab} />}
              {selectedTab === 'rank' && <Rank players={this.props.players} />}
              {selectedTab === 'comment' && <SlideMgr comments={comments} onClearComment={onClearComment} onInsertComment={onInsertComment} />}
              {selectedTab === 'download' && <Download />}
            </div>
          </div>
        </Content>
      </Container>
    );
  }
}

export default Adm;