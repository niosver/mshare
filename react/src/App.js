// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {ProvideAuth} from './components/use-auth';
import Base from './pages/Base';

function App(props) {
  return (
    <ProvideAuth>
      {
        <Base/>
      }
    </ProvideAuth>
  );
}

export default App;
