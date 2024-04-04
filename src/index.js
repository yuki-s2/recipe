import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecipePage } from './Recipe/RecipePage';
import './App.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="inner">
    <RecipePage />
    </div>
  </React.StrictMode>
);
