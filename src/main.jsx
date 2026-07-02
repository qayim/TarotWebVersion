import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import FavoritesProvider from './context/FavoritesContext';
import GeminiSettingsProvider from './context/GeminiSettingsContext';
import './index.css';

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

document.documentElement.style.setProperty(
  '--page-background-image',
  `url("${import.meta.env.BASE_URL}assets/background7.png")`
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={baseUrl}>
      <GeminiSettingsProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </GeminiSettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
