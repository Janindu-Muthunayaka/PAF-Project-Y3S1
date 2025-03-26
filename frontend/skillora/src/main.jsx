import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Ensure this points to the App component

const root = ReactDOM.createRoot(document.getElementById('root'));
const socket = new WebSocket('ws://localhost:5173');

root.render(
  <React.StrictMode>
    
    <App />
  </React.StrictMode>
);
