import React from 'react';
import { Link, useParams } from 'react-router-dom';

const SelectedRecipes = ({ selectedRecipes }) => {
    const { recipeId } = useParams();
    const selectedRecipe = selectedRecipes.find(recipe => recipe.id === parseInt(recipeId));

    if (!selectedRecipe) {
        return <div>選択されたレシピが見つかりません。</div>;
    }

    return (
        <div>
            <h2>{selectedRecipe.name}</h2>
            <p>{selectedRecipe.details}</p>  

            <Link to="/">レシピ一覧に戻る</Link>
        </div>
    );
};

export default SelectedRecipes;
