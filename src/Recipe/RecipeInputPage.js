// RecipeInputPage.js
import { Link } from 'react-router-dom';

const RecipeInputPage = ({ recipes, selectedRecipes, setSelectedRecipes }) => {

    const handleCheckboxChange = (recipeId) => {
        if (selectedRecipes.includes(recipeId)) {
            //選択解除
            setSelectedRecipes(selectedRecipes.filter(id => id !== recipeId));
            console.log(selectedRecipes + "a");
        } else {
            setSelectedRecipes([...selectedRecipes, recipeId]);
            console.log(selectedRecipes + "b");
        }
    };

    return (
        <div>
            <h2>追加されたレシピ一覧</h2>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe.id}>
                        <input
                            type="checkbox"
                            checked={selectedRecipes.includes(recipe.id)}
                            onChange={() => handleCheckboxChange(recipe.id)}
                        />
                        <Link to={`/recipes/${recipe.id}`}>
                            {recipe.name}
                        </Link>
                    </li>
                ))}
            </ul>
            <Link to="/SelectedRecipes">
                <div>選択れたレシピ一覧へ</div>
            </Link>
            <Link to="/">
                <div>リストに戻る</div>
            </Link>
        </div>
    );
};

export default RecipeInputPage;
