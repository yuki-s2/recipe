// SelectedRecipes.js
import React from 'react';

const SelectedRecipes = ({ recipes, selectedRecipes }) => {
    // 選択されたレシピの情報を取得
    const selectedRecipesInfo = recipes.filter(recipe => selectedRecipes.includes(recipe.id));

    return (
        <div>
            <h2>選択されたレシピ一覧</h2>
            <ul>
                {selectedRecipesInfo.map(recipe => (
                    <li key={recipe.id}>
                        {recipe.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SelectedRecipes;
