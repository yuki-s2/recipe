import { Link } from 'react-router-dom';

export const RecipeListPage = ({ recipes, selectedRecipes, setSelectedRecipes }) => {

    const handleCheckboxChange = (recipeId) => {
        if (selectedRecipes.includes(recipeId)) {
            setSelectedRecipes(selectedRecipes.filter(id => id !== recipeId));
            console.log(selectedRecipes + "a");
        } else {
            setSelectedRecipes([...selectedRecipes, recipeId]);
            console.log(selectedRecipes + "b");
        }
    };


    return (
        <div className="recipeList_body">
            <h2 className='page_ttl'>追加されたレシピ一覧</h2>
            {recipes.length === 0 ? (
                <p className='recipeList_nonText'>レシピはありません</p>
            ) : (
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
            )}
            <div className="btn_container">
            <Link to="/SelectedRecipes">
                <div className='btn_link'>選択されたレシピ一覧へ</div>
            </Link>
            <Link to="/">
                <div className='btn_link'>リストに戻る</div>
            </Link>
            </div>
        </div>
    );
};