// RecipeDetailPage.js
// recipesプロパティとレシピのIDを使用して、詳細情報を表示
import React from 'react';
import { Link, useParams } from 'react-router-dom';

const SelectedRecipes = ({ selectedRecipes }) => {
    const { selectedRecipeId } = useParams();
    const selectedRecipe = selectedRecipes.find(selectedRecipe => selectedRecipe.id === parseInt(selectedRecipeId));

    if (!selectedRecipe) {
        return <div>レシピはありません</div>;
    }

    return (
        <div>
            <ul>
                {selectedRecipe.map(selectedRecipe => (
                    <li key={selectedRecipe.id}>
                        <Link to={`/selectedRecipe/${selectedRecipe.id}`}>
                            <h2>{selectedRecipe.name}</h2>
                            <p>{selectedRecipe.details}</p>
                        </Link>
                    </li>
                ))};
            </ul>
            <Link to="/">リストに戻る</Link>
        </div >
    );
};

export default SelectedRecipes;
