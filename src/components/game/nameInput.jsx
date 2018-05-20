import React from 'react';
import { Container, Header, Content } from './common';

class NameInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      enableSubmit: false
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange(e) {
    if (e && e.target) {
      const { value = '' } = e.target;
      this.setState({ name: value, enableSubmit: value.trim() !== '' });
    }
  }
  onSubmit(e) {
    e.preventDefault();
    this.setState({ name: '', enableSubmit: false }, () => {
      this.props.onSubmit(this.state.name.trim());
    })
  }
  render() {
    const { name, enableSubmit } = this.state;
    return (
      <Container>
        <Header title="請輸入名字"></Header>
        <Content>
          <form>
            <input type="text" value={name} onChange={this.onChange} />
            <button onClick={this.onSubmit} disabled={!enableSubmit}>OK</button>
          </form>
        </Content>
      </Container>
    )
  }
}

export default NameInput;