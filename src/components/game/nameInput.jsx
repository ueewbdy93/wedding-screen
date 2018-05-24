import React from 'react';
import { Container, Header, Content } from './common';

const INPUT_STYLE = {
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  width: '80%',
  textAlign: 'center',
  borderRadius: '20px',
  border: 'none',
  backgroundColor: 'white',
  padding: '5px 10px',
  fontSize: '16px',
  height: '40px'
}

const BTN_STYLE = {
  height: '40px',
  marginTop: '10px',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  width: '80%',
  textAlign: 'center',
  borderRadius: '20px',
  border: 'none',
  backgroundColor: 'lightcoral',
  padding: '5px 10px',
  fontSize: '16px',
  cursor: 'pointer'
}

class NameInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      disabledSubmit: true
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange(e) {
    if (e && e.target) {
      const { value } = e.target;
      this.setState({
        name: value || '',
        disabledSubmit: !(value && value.trim())
      });
    }
  }
  onSubmit(e) {
    e.preventDefault();
    const { name, disabledSubmit } = this.state;
    const { addPlayer } = this.props;
    if (!disabledSubmit) {
      addPlayer(name);
      this.setState({ name: '', disabledSubmit: true });
    }
  }
  render() {
    const { name, disabledSubmit } = this.state;
    return (
      <Container>
        <Header title="加入遊戲"></Header>
        <Content>
          <table style={{ height: '100%', width: '100%', textAlign: 'center' }}>
            <tbody>
              <tr style={{ verticalAlign: 'middle' }}><td>
                <form>
                  <input
                    style={INPUT_STYLE}
                    maxLength="10"
                    type="text"
                    value={name}
                    placeholder="請輸入你的名字"
                    onChange={this.onChange} />
                  <br />
                  <button
                    style={BTN_STYLE}
                    onClick={this.onSubmit}
                    disabled={disabledSubmit}>
                    送出
              </button>
                </form>
              </td></tr>
            </tbody>
          </table>
        </Content>
      </Container>
    )
  }
}

export default NameInput;