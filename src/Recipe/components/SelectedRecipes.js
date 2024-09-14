// SelectedRecipes.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonListPage, ButtonInputPage } from './Button';


export const SelectedRecipes = ({ selectedPosts, posts }) => {

    // 選択されたレシピの情報を取得
    const selectedPostsInfo = posts ? posts.filter(post => selectedPosts.includes(post.id)) : [];

    return (
        <div className="recipeList_main is-dot">
            <h2 className='page_ttl'>今日の献立</h2>
            <div className="recipeList_contentsWrap">
                {selectedPostsInfo.length === 0 ? (
                    <p>レシピはありません</p>
                ) : (
                    <ul className='recipeList_items'>
                        {selectedPostsInfo.map(post => (
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
                                    <p>{post.title}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="btn_container">
            <ButtonListPage />
            <ButtonInputPage />
            </div>
        </div>
    );
};