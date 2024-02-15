// SelectedRecipes.js
import React from 'react';
import RecipeList from './RecipeList';
import RecipeListPage from './RecipeListPage';
import { Link } from 'react-router-dom';

const SelectedRecipes = ({ selectedRecipe }) => {
    return (
        <div>
                {recipes.map(recipe => (
                    <Link to={`/recipes/${recipe.id}`}>
                        {recipe.name}
                        <div>SelectedRecipes</div>
                    </Link>
                ))}
        </div>
    );
};

export default SelectedRecipes;