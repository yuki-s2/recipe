// SelectedRecipes.js
import React from 'react';
import { Link } from 'react-router-dom';


export const SelectedRecipes = ({ recipes, selectedRecipes }) => {
    console.log(selectedRecipes + "d");

    // 選択されたレシピの情報を取得
    const selectedRecipesInfo = recipes.filter(recipe => selectedRecipes.includes(recipe.id));
    console.log(selectedRecipesInfo + "e");

    return (
        <div>
            <h2>今日の献立</h2>
            {recipes.length === 0 ? (
                <p>レシピはありません</p>
            ) : (
                <ul>
                    {selectedRecipesInfo.map(recipe => (
                        <li key={recipe.id}>
                            <Link to={`/recipes/${recipe.id}`}>
                                <h2>{recipe.name}</h2>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            <Link to="/RecipeInputPage">
                <div>追加されたレシピ一覧へ</div>
            </Link>
            <Link to="/">
                <div>リストに戻る</div>
            </Link>

        </div>
    );
};

