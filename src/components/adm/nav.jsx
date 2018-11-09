import React from 'react';

const TABS = [
  { id: 'game', name: '遊戲', mode: 0 },
  { id: 'rank', name: '排行', mode: 0 },
  { id: 'comment', name: '留言', mode: 1 }
]

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.onSwitchMode = this.onSwitchMode.bind(this)
  }
  componentDidMount() {
    const { mode, onSwitchTab } = this.props;
    onSwitchTab(TABS.find(tab => tab.mode === mode).id);
  }
  onSwitchMode(mode) {
    const { onSwitchMode, onSwitchTab } = this.props;
    if (mode === 1) {
      if (!window.confirm("確定要離開？離開後遊戲將會重置")) {
        return;
      }
    }
    onSwitchMode(mode);
    onSwitchTab(TABS.find(tab => tab.mode === mode).id);
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
              TABS.filter(tab => tab.mode === mode).map(tab => {
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
        <button
          style={{ width: 'unset', display: 'flex', alignItems: 'center' }}
          onClick={() => this.onSwitchMode(mode === 1 ? 0 : 1)}>
          <small>遊戲/輪播</small>
          <i className={mode === 0 ? "fas fa-toggle-on" : "fas fa-toggle-off"}></i>
        </button>
      </nav>
    )
  }
}

export default Nav;