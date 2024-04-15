import React from 'react';
import Chat from '../../Chat';


export const RecipeIngredients = ({ recipe }) => {

    return (
        <>
            <div className="recipeDetail_ingredientsContainer">
                <h4 className='recipeDetail_title'>材料</h4>
                <p>{recipe.ingredients}</p>
                <Chat ingredients={recipe.ingredients} />
            </div>
        </>
    )
};
