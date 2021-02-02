import "core-js/stable";
import "@babel/polyfill";
import "regenerator-runtime/runtime";
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'fast-text-encoding/text';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./web.config";

ReactDOM.render(<App />, document.getElementById('root'));
