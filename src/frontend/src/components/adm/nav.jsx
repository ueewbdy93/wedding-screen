import React from 'react';

const TABS = [
  { id: 'comment', name: '留言' },
  { id: 'game', name: '遊戲' },
  { id: 'rank', name: '排行' },
  { id: 'download', name: '下載' }
]

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.onSwitchMode = this.onSwitchMode.bind(this)
  }
  componentDidMount() {
    const { onSwitchTab } = this.props;
    onSwitchTab(TABS[0].id);
  }
  onSwitchMode(mode) {
    const { onSwitchMode } = this.props;
    onSwitchMode(mode);
  }
  render() {
    const {
      mode,
      selectedTab,
      onSwitchTab
    } = this.props;
    return (
      <nav className="nav nav-masthead" style={{ justifyContent: 'space-between' }}>
        {
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {
              TABS.map(tab => {
                const { id, name } = tab;
                const isSelected = id === selectedTab;
                return (
                  <span
                    key={id}
                    className={isSelected ? 'nav-link active' : 'nav-link'}
                    href="#"
                    onClick={() => onSwitchTab(id)}>
                    {name}
                  </span>
                )
              })
            }
          </div>
        }
        <span
          style={{ cursor: 'pointer', width: 'unset', display: 'flex', alignItems: 'center' }}
          onClick={() => this.onSwitchMode(mode === 1 ? 0 : 1)}>
          <small>輪播/遊戲</small>
          <i className={mode === 0 ? "fas fa-toggle-on" : "fas fa-toggle-off"}></i>
        </span>
      </nav>
    )
  }
}

export default Nav;