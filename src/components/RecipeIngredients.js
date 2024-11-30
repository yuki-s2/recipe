import React from 'react';
import Chat from '../../Chat';


export const RecipeIngredients = ({ selectedPosts }) => {

    return (
        <>
                <div className="recipeDetail_ingredientsContainer">
                    <div className="recipeDetail_title">
                        <h3 className=''>材料</h3>
                        <Chat ingredients={selectedPosts.ingredients} />
                    </div>
                    <div className="recipeDetail_ingredientsText">
                    {selectedPosts.ingredients.map((ingredient, index) => (
                        <p key={index}>{ingredient}</p>
                    ))}
                </div>
            </div>
        </>
    )
};
