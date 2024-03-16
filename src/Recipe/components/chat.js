
import React, { useState } from 'react';
import { Configuration, OpenAIApi } from "openai";

export default function Chat() {
    const [message, setMessage] = useState("");
    const [messages,setMessages] = useState([]);

    const configuration = new Configuration({
        apiKey: process.env.API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await openai.createChatCompletion({
            model: "get-3.5-turbo",
            messages: [{ role: "user", content: "こんにちは" }],
        });
        const responseData = response.data.choices[0].message?.content;
        setMessages([...messages, { role: "AI", content: responseData }]);
        setMessage(""); // フォームをクリア
    };
    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <input type="text" />
            <button type="submit">
                送信
            </button>
        </form>
    )
};
