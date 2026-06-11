import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App'; // <--- Ajustado para a pasta real
import './styles/main.css'; // <--- ESSA LINHA PRECISA ESTAR AQUI!

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
