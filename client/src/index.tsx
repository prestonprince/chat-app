import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SocketContextComponent from './contexts/Socket/Component';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SocketContextComponent>
      <App />
    </SocketContextComponent>
  </React.StrictMode>
);
