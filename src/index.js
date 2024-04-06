import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecipePage } from './Recipe/RecipePage';
import './Recet.css'
import './App.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RecipePage />
  </React.StrictMode>
);
