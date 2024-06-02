import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../../Firebase';

//親コンポーネントからpropsを受け取る
export const RecipeListPage = ({ selectedPosts, setSelectedPosts, posts, setPosts }) => {

    const handleCheckboxChange = (postsId) => {
        //selectedPostsにpostsIdが含まれているかどうかをチェックしています。
        if (selectedPosts.includes(postsId)) {
            //含まれている場合は、そのIDをselectedPostsから削除します。
            setSelectedPosts(selectedPosts.filter(id => id !== postsId));
        } else {
            setSelectedPosts([...selectedPosts, postsId]);
            console.log(postsId);

        }
    };

    useEffect(() => {
        const postData = collection(db, "posts");
        //onSnapshotは、データのリアルタイムリスニングを提供 このため、非同期処理を明示的に使用する必要はありません。
        onSnapshot(postData, (post) => {
            setPosts(post.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        console.log(posts);
        //setPostsが変更されたときにuseEffectが再実行されます。
    }, [setPosts]);
    return (
        <div className="recipeList_body">
            <h2 className='page_ttl'>追加されたレシピ一覧</h2>
            {posts && posts.length === 0 ? (
                <p className='recipeList_nonText'>レシピはありません</p>
            ) : (
                <ul>
                    {posts && posts.map((post) => (
                        <li key={post.id}>
                            <input
                                type="checkbox"
                                checked={selectedPosts.includes(post.id)}
                                onChange={() => handleCheckboxChange(post.id)}
                            />
                            <Link to={`/recipes/${post.id}`}>
                                <h1>{post.title}</h1>
                                {/* <p>{post.text}</p>
                                {post.ingredient && post.ingredient.map((ingredient, index) => (
                                    <p key={index}>{ingredient}</p>
                                ))} */}
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