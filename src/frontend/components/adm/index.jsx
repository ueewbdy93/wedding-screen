import React from 'react';
import Login from './login';
import Adm from './adm';

function App(props) {
  const { login, adminLogin } = props;
  return login ? <Adm {...props} /> : <Login adminLogin={adminLogin} />;
}

export default App;