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
        <Header><h3 className="mb-0">加入遊戲</h3></Header>
        <Content>
          <div className="row p-3">
            <form className="col-md-6 offset-md-3">
              <div className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="請輸入您的大名"
                  value={name}
                  maxLength="10"
                  onChange={this.onChange}
                />
              </div>
              <button
                onClick={this.onSubmit}
                disabled={disabledSubmit}
                className="btn btn-primary mb-2 btn-lg btn-block">
                送出
            </button>
            </form>
          </div>
        </Content>
      </Container>
    )
  }
}

export default NameInput;