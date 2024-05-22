import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from '../../Firebase';

export const RecipeListPage = ({ recipePosts, selectedPosts, setSelectedPosts }) => {

    const handleCheckboxChange = (postsId) => {
        if (selectedPosts.includes(postsId)) {
            setSelectedPosts(selectedPosts.filter(id => id !== postsId));
            console.log(selectedPosts + "a");
        } else {
            setSelectedPosts([...selectedPosts, postsId]);
            console.log(selectedPosts + "b");
        }
    };

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const postData = collection(db, "posts");
        getDocs(postData).then((snapShot) => {
            setPosts(snapShot.docs.map((doc) => ({ ...doc.data() })));
            // console.log("レシピ名をfirebaseで表示");
        });
        //リアルタイムで表示
        onSnapshot(postData, (post) => {
            setPosts(post.docs.map((doc) => ({ ...doc.data() })));
        });

    }, []);

    // return (
    //   <div className="recipeInput_body">
    //     {posts.map((post) => (
    //       <div>
    //         <div key={post.id}>
    //           {/* <p>{post.id}</p> */}
    //           <h1>{post.title}</h1>
    //           <p>{post.ingredient}</p>
    //           <p>{post.text}</p>
    //         </div>
    //       </div>
    //     ))}
    return (
        <div className="recipeList_body">
            <h2 className='page_ttl'>追加されたレシピ一覧</h2>
            {posts.length === 0 ? (
                <p className='recipeList_nonText'>レシピはありません</p>
            ) : (
                <ul>
                    {/* {recipes.map(recipe => (
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
                    ))} */}
                    {posts.map((post) => (
                        <div>
                            <div key={post.id}>
                            <input
                                type="checkbox"
                                checked={selectedPosts.includes(post.id)}
                                onChange={() => handleCheckboxChange(post.id)}
                            />
                                {/* <p>{post.id}</p> */}
                                <Link to={`/recipes/${post.id}`}>
                                <h1>{post.title}</h1>
                                <p>{post.ingredient}</p>
                                <p>{post.text}</p>
                                </Link>
                            </div>
                        </div>
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