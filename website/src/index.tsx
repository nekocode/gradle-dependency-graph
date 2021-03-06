import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
