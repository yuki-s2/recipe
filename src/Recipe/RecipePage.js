// RecipePage.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Chat from '../Chat';
import { RecipeListPage } from '../pages/RecipeListPage';
import { SelectedRecipes } from '../pages/SelectedRecipes';
import { RecipeInputPage } from '../pages/RecipeInputPage';
import { RecipeDetailPage } from '../pages/RecipeDetailPage';

const RecipePage = () => {
  //Chatで使用
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  //選択されたレシピリストページへ渡す
  const [posts, setPosts] = useState([]);
  
  return (
    <Router>
      <Routes>
        <Route
          path="/"//URL
          element={<RecipeInputPage />}
        />
        <Route
          path="/RecipeListPage"
          element={<RecipeListPage selectedPosts={selectedPosts} setSelectedPosts={setSelectedPosts} posts={posts} setPosts={setPosts} />}
        />
        <Route
          path="/SelectedRecipes"
          element={<SelectedRecipes selectedPosts={selectedPosts} posts={posts}  />}
        />
        <Route
          path="/RecipeDetailPage"
          element={<RecipeDetailPage selectedPosts={selectedPosts} posts={posts}  />}
        />
        <Route path="/recipes/:postId"//recipes/に続く部分が動的に変わるURLに対応(パラメータを取得)
         element={<RecipeDetailPage selectedPosts={selectedPosts} posts={posts}  />} />
        <Route element={<Chat selectedPosts={selectedPosts} selectedRecipes={selectedRecipes} />} />
      </Routes>
    </Router>
  );
};

export default RecipePage; 