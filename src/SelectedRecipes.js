// SelectedRecipes.js レシピ１枚分のコンポ
import React from 'react';

const SelectedRecipes = ({ selectedRecipes }) => {
  return (
    <div>
      {selectedRecipes.map(recipe => (
        <div key={recipe.id}>
          <h3>{recipe.name}</h3>
          ここにレシピの詳細や手順などを表示するコンポーネントを追加
        </div>
      ))}
    </div>
  );
};

export default SelectedRecipes;
