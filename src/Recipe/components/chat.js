
import React from 'react';
import { Configuration, OpenAIApi } from "openai";

export default function Chat() {

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
        console.log(response);
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
