import React from 'react';
import ReactDOM from 'react-dom';
import ForgeReconciler from '@forge/react';
import App from './App';
import Config from './Config';

ReactDOM.render(<App />, document.getElementById("root"));

ForgeReconciler.addConfig(<Config />);
