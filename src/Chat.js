import React, { useState } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
    dangerouslyAllowBrowser: true,
    apiKey: process.env.REACT_APP_API_KEY,
});

export default function Chat({ ingredients, ingredientQtys }) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessages([]);
        setIsLoading(true);

        if (!ingredients || ingredients.length === 0 || !ingredientQtys || ingredientQtys.length === 0) {
            setMessages((prevMessages) => [
                ...prevMessages,
                "材料とその量を入力してください。"
            ]);
            setIsLoading(false);
            return;
        }

        const userMessage = `・食材${ingredientQtys}: 量${ingredients}`;
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { "role": "system", "content": "You are an assistant who gives advice in 200 characters or less about the total nutritional balance based on the ingredients and portions given." },
                    { "role": "user", "content": userMessage }
                ],
            });

            const content = response?.choices[0]?.message?.content;
            console.log("API response:", content);
            setMessages([content]);

        } catch (error) {
            console.error("API request failed:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                "APIリクエストに失敗しました。"
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <button className='button_additionBtn' type="submit">
                    {isLoading ? <p>Getting advice...</p> : <p>advice</p>}
                </button>
            </form>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>
                        <p>{message}</p>
                    </div>
                ))}
            </div>
        </>
    );
}
