// RecipePage.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Form } from 'react-router-dom';
import { RecipeDetailPage, RecipeInputPage, RecipeListPage, SelectedRecipes } from './components';
import Chat from '../Chat';

const RecipePage = () => {
  // const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  
  // const addRecipe = (recipeName, ingredient, detail) => {
  //   const newRecipe = {
  //     id: recipes.length + 1,
  //     name: recipeName,
  //     ingredients: ingredient,
  //     details: detail,
  //   };
    
  //   setRecipes([...recipes, newRecipe]);
  // };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<RecipeInputPage selectedPosts={selectedPosts} />}
        />
        <Route
          path="/RecipeListPage"
          element={<RecipeListPage selectedPosts={selectedPosts} setSelectedPosts={setSelectedPosts} />}
        />
        <Route
          path="/SelectedRecipes"
          element={<SelectedRecipes selectedPosts={selectedPosts} selectedRecipes={selectedRecipes} />}
        />
        <Route path="/selectedPosts/:postsId" element={<RecipeDetailPage selectedPosts={selectedPosts} />} />
        <Route element={<RecipeListPage />} />
        <Route element={<Chat selectedPosts={selectedPosts} selectedRecipes={selectedRecipes} />} />
      </Routes>
    </Router>
  );
};

export default RecipePage; 