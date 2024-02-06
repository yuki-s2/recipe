// SelectedRecipes.js
import React from 'react';

const SelectedRecipes = ({ selectedRecipe }) => {
  return (
    <div>
      {selectedRecipe && (
        <div>
          <h2>{selectedRecipe.name}</h2>
          {/* レシピの詳細情報などを表示 */}
        </div>
      )}
    </div>
  );
};

export default SelectedRecipes;
