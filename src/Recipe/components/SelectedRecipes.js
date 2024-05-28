// SelectedRecipes.js
import React from 'react';
import { Link } from 'react-router-dom';


export const SelectedRecipes = ({ selectedPosts, posts }) => {

    // 選択されたレシピの情報を取得
    const selectedPostsInfo = posts ? posts.filter(post => selectedPosts.includes(post.id)) : [];

    return (
        <div>
            <h2>今日の献立</h2>
            {selectedPostsInfo.length === 0 ? (
                <p>レシピはありません</p>
            ) : (
                <ul>
                    {selectedPostsInfo.map(post => (
                        <li key={post.id}>
                            <Link to={`/recipes/${post.id}`}>
                            <h1>{post.title}</h1>
                            <p>{post.text}</p>
                            <p>{post.ingredient}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            <Link to="/RecipeInputPage">
                <div>追加されたレシピ一覧へ</div>
            </Link>
            <Link to="/">
                <div>リストに戻る</div>
            </Link>

        </div>
    );
};

