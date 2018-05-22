import React from 'react';

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
      <div>
        <form>
          <input type="password" value={password} onChange={this.onChange} />
          <button type="submit" onClick={this.onSubmit} disabled={disabledSubmit}>登入</button>
        </form>
      </div>
    )
  }
}

export default Login;