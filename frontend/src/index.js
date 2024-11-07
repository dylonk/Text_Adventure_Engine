import React from 'react';
import ReactDOM from 'react-dom/client';
import './CSS/index.css';
import App from './React/App.js';
import reportWebVitals from './standardjs/reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));//inits react root to "root" div in index.html
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
