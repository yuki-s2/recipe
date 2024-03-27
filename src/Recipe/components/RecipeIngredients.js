import React from 'react';
import Chat from '../../Chat';


export const RecipeIngredients = ({ recipe }) => {

    return (
        <>
            <h2>材料</h2>
            <p>{recipe.ingredients}</p>
            <Chat ingredients={recipe.ingredients} />
        </>
    )
};
