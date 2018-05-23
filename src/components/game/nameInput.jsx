import React from 'react';
import { Container, Header, Content } from './common';

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
        <Header title="請輸入名字"></Header>
        <Content>
          <form>
            <input maxLength="10" type="text" value={name} onChange={this.onChange} />
            <button onClick={this.onSubmit} disabled={disabledSubmit}>OK</button>
          </form>
        </Content>
      </Container>
    )
  }
}

export default NameInput;