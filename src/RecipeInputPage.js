// RecipeInputPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const RecipeInputPage = ({ recipes }) => {
    return (
        <div>
            <h2>追加されたレシピ一覧</h2>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe.id}>
                        <Link to={`/SelectedRecipes/${recipe.id}`}>
                            {recipe.name}
                        </Link>
                    </li>
                ))}
            </ul>
            {/* "選択れたレシピ一覧へ" のリンク */}
            <Link to="/SelectedRecipes">
                <div>選択れたレシピ一覧へ</div>
            </Link>
        </div>
    );
};

export default RecipeInputPage;
