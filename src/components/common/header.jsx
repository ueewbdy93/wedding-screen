import React from 'react';
import screenfull from 'screenfull';

// <i class="fas fa-expand"></i>
// <i class="fas fa-compress"></i>

const STYLE = {
  boxSizing: 'border-box',
  position: 'absolute',
  top: '0px',
  right: '0px',
  left: '0px',
  height: '50px',
  width: '100%',
  zIndex: 99999,
  textAlign: 'right',
  padding: '2px 5px',
};

const BTN_STYLE = {
  border: 'none',
  font: 'whitesmoke',
  cursor: 'pointer',
  fontSize: '32px',
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFullscreen: false
    };
    this.toggle = this.toggle.bind(this);
  }
  toggle(){
    if(screenfull.enabled){
      screenfull.toggle();
    }
  }
  componentWillMount() {
    if(screenfull.enabled){
      screenfull.on('change', () => {
        this.setState({
          isFullscreen: screenfull.isFullscreen
        })
      });
    }
  }
  componentWillUnmount() {
    if(screenfull.enabled){
       screenfull.off('change');
    }    
  }
  render() {
    const { isFullscreen } = this.state;
    return (
      <div style={STYLE}>
        <button style={BTN_STYLE} onClick={this.toggle}>
          <i className={isFullscreen ? 'fas fa-compress' : 'fas fa-expand'}></i>
        </button>
      </div>
    );
  }

}

export default Header;
