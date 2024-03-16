import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecipePage } from './Recipe/RecipePage';
import dotenv from 'dotenv';

dotenv.config(); // .envファイルから環境変数を読み込む

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RecipePage />
  </React.StrictMode>
);
