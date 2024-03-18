
import React, { useState } from 'react';
import OpenAI from 'openai';

export default function Chat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const openai = new OpenAI({
        //Reactが自動的に提供するセキュリティ機能を無効にし、外部サイトの<iframe>内でJavaScriptを実行できるようにします。
        dangerouslyAllowBrowser: true,
        apiKey: process.env.REACT_APP_API_KEY,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: "入力された食品のタンパク質の量を「〇〇g」という答え方で教えてください。" },
                { role: "user", content: message},
            ],
        });

        setMessages((PrevMessages) => [
            ...PrevMessages,
            { sender: "user", text: message },
            { sender: "ai", text: response?.choices[0]?.message?.content },
        ]);

        console.log(messages);

        setMessage(""); 

    };
    return (
        <>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input type="text" onChange={(e) => setMessage(e.target.value)} value={message} />
                <button type="submit">
                    {isLoading ? <p>送信中</p> : <p>送信</p>}
                </button>
            </form>
            <div>
                {messages.map((message, index) => (
                    <p key={index}>
                        {message.text}
                    </p>
                ))}

            </div>
        </>
    )
};
