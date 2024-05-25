import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from '../../Firebase';

export const RecipeListPage = ({ selectedPosts, setSelectedPosts }) => {
    
    const handleCheckboxChange = (postsId) => {
        if (selectedPosts.includes(postsId)) {
            setSelectedPosts(selectedPosts.filter(id => id !== postsId));
            // console.log(selectedPosts + "a");
        } else {
            setSelectedPosts([...selectedPosts, postsId]);
            // console.log(selectedPosts + "b");
        }
    };

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const postData = collection(db, "posts");
        getDocs(postData).then((snapShot) => {
            setPosts(snapShot.docs.map((doc) => ({ ...doc.data() })));
        });
        //リアルタイムで表示
        onSnapshot(postData, (post) => {
            setPosts(post.docs.map((doc) => ({ ...doc.data() })));

        });

    }, []);
    return (
        <div className="recipeList_body">
            <h2 className='page_ttl'>追加されたレシピ一覧</h2>
            {posts.length === 0 ? (
                <p className='recipeList_nonText'>レシピはありません</p>
            ) : (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <input
                                type="checkbox"
                                checked={selectedPosts.includes(post.id)}
                                onChange={() => handleCheckboxChange(post.id)}
                            />
                            <h1>{post.title}</h1>
                            <p>{post.text}</p>
                            <p>{post.ingredient}</p>
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