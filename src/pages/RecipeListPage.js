import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../Firebase';
import { ButtonInputPage, ButtonSelectedRecipePage } from '../components/Button';

//親コンポーネントからpropsを受け取る
export const RecipeListPage = ({
    selectedPosts,
    setSelectedPosts,
    posts,
    setPosts,
    // postId,
    // svgId
}) => {
    // console.log("選択した",selectedPosts);

    const handleCheckboxChange = (postId) => {
        const updatedSelectedPosts = selectedPosts.includes(postId)
            ? selectedPosts.filter(id => id !== postId) // チェック解除の場合、配列から削除
            : [...selectedPosts, postId]; // チェックの場合、配列に追加

        setSelectedPosts(updatedSelectedPosts);

        // チェックボックスの状態に応じて色を変更
        const svg = document.getElementById(`heart-icon-${postId}`);
        if (svg) {
            const path = svg.querySelector('path');
            if (path) {
                // チェックされているかどうかで色を変更
                path.style.stroke = updatedSelectedPosts.includes(postId) ? '#f2a3bd' : '#8b8294';
            }
        }
    };

    useEffect(() => {
        const postData = collection(db, "posts");
        //onSnapshotは、データのリアルタイムリスニングを提供 このため、非同期処理を明示的に使用する必要はありません。
        onSnapshot(postData, (post) => {
            setPosts(post.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        //setPostsが変更されたときにuseEffectが再実行されます。
    }, [setPosts]);

    //useEffectは、特定の状態やプロパティが変更されたときに副作用（サイドエフェクト）を実行するためのフックです。
    //ここでは、selectedPostsやpostsが変更されたときに実行
    useEffect(() => {
        selectedPosts.forEach(postId => {
            const svg = document.getElementById(`heart-icon-${postId}`);
            if (svg) {
                const path = svg.querySelector('path');
                if (path) {
                    path.style.stroke = '#f2a3bd';  // 選択されたものはピンク色に
                }
            }
        });

        // 選択されていないアイテムの色もリセット
        posts.forEach(post => {
            if (!selectedPosts.includes(post.id)) {
                const svg = document.getElementById(`heart-icon-${post.id}`);
                if (svg) {
                    const path = svg.querySelector('path');
                    if (path) {
                        path.style.stroke = '#8b8294';  // 未選択の場合は元の色に戻す
                    }
                }
            }
        });

    }, [selectedPosts, posts]); // selectedPostsやpostsが変わった時に実行

    return (
        <div className="recipeList_main is-chek">
            <h1 className='page_ttl'>Recipe List</h1>
            <div className="recipeList_contentsWrap">
                {posts && posts.length === 0 ? (
                    <p className='recipeList_nonText'>レシピはありません</p>
                ) : (
                    <ul className='recipeList_items'>
                        {posts && posts.map((post) => (
                            <li className="recipeList_item" key={post.id}>
                                <div className="recipeList_itemTop"></div>
                                <Link to={`/recipes/${post.id}`}>
                                    <div className='recipeList_itemImg'>
                                        {post.imageUrl && (
                                            <img src={post.imageUrl} alt={post.title} />
                                        )}
                                    </div>
                                </Link>
                                <div className='recipeList_itemTtl'>
                                    <svg id={`heart-icon-${post.id}`} className="heart-icon" width="30" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402zM17.726 1.01c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181z"
                                            stroke="#8b8294"
                                            stroke-width="2" />
                                    </svg>
                                    <input
                                        type="checkbox"
                                        checked={selectedPosts.includes(post.id)}
                                        onChange={() => handleCheckboxChange(post.id, `heart-icon-${post.id}`)}
                                    />
                                    <p>{post.title}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="btn_container">
                <ButtonSelectedRecipePage />
                <ButtonInputPage />
            </div>
        </div>
    );
};