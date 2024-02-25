// SelectedRecipes.js
import React from 'react';
// import { v4 as uuidv4 } from "uuid";


const SelectedRecipes = ({ recipes, selectedRecipes }) => {
    console.log(selectedRecipes + "d");

    // 選択されたレシピの情報を取得
    const selectedRecipesInfo = recipes.filter(recipe => selectedRecipes.includes(recipe.id));
    console.log(selectedRecipesInfo + "e");

    return (
        <div>
            <h2>選択されたレシピ一覧</h2>
            <ul>
                {selectedRecipesInfo.map(recipe => (
                    <li key={recipe.id}>
                        <h2>{recipe.name}</h2>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SelectedRecipes;
