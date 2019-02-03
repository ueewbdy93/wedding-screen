import React from 'react';
import { Container, Header, Content } from '../game/common';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange(e) {
    if (e && e.target) {
      const { value } = e.target;
      this.setState({ password: value || '' });
    }
  }
  onSubmit(e) {
    e.preventDefault();
    const { password } = this.state;
    const { adminLogin } = this.props;
    if (password && password.trim()) {
      adminLogin(password);
      this.setState({ password: '' });
    }
  }
  render() {
    const { password } = this.state;
    const disabledSubmit = !(password && password.trim());
    return (
      <Container>
        <Header>
          <h3 className="mb-0">後台</h3>
        </Header>
        <Content>
          <div className="row p-3">
            <form className="col-md-6 offset-md-3">
              <div className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="請輸入密碼"
                  value={password}
                  onChange={this.onChange}
                />
              </div>
              <button
                onClick={this.onSubmit}
                disabled={disabledSubmit}
                className="btn btn-primary mb-2 btn-lg btn-block">
                登入
              </button>
            </form>
          </div>
        </Content>
      </Container>
    )
  }
}

export default Login;