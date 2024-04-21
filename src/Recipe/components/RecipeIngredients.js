import React from 'react';
import Chat from '../../Chat';


export const RecipeIngredients = ({ recipe }) => {

    return (
        <>
            <div className="recipeDetail_ingredientsContainer">
                <div className="recipeInput_item">
                    <div className="recipeInput_text">
                        <h3 className=''>材料</h3>
                        <Chat ingredients={recipe.ingredients} />
                    </div>
                    {recipe.ingredients.map((ingredient, index) => (
                        <p key={index}>{ingredient}</p>
                    ))}
                </div>
            </div>
        </>
    )
};
