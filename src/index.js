import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import RecipePage from './Recipe/RecipePage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <RecipePage />
  </React.StrictMode>
);
