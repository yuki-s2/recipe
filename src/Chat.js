import React, { useState } from 'react';
import Modal from 'react-modal';
import OpenAI from 'openai';

const openai = new OpenAI({
    dangerouslyAllowBrowser: true,
    apiKey: process.env.REACT_APP_API_KEY,
});

export default function Chat({ ingredients, ingredientQtys }) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    //モーダル
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 100, y: 100 }); // 初期位置を調整
    const [offset, setOffset] = useState({ x: 0, y: 0 });

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

    //モーダル
    Modal.setAppElement('#root');

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <button onClick={openModal} className='button_additionBtn' type="submit">
                    {isLoading ? <p>Getting advice...</p> : <p>advice</p>}
                </button>
            </form>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                shouldCloseOnOverlayClick={false}//モーダル外クリックで閉じない
                style={{
                    overlay: {
                        backgroundColor: 'none',
                        pointerEvents: 'none', // オーバーレイをクリック不可にする
                    },
                    content: {
                        top: `${position.y}px`,
                        left: `${position.x}px`,
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '20em',
                        height: 'auto',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        pointerEvents: 'auto',
                        padding: 0,
                        borderRadius: '1em',
                        border: '0.1em solid #806b70'
                    },
                }}
                contentLabel="Chat Modal"
            >
                <div className='modal'
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{ height: '100%', width: '100%' }}>
                    <div className='recipe_head' style={{padding: '.5em 1em',justifyContent: 'flex-end'}}>
                        <button className='button_deleteBtn' style={{fontSize:'1em'}} onClick={closeModal}>×</button>
                    </div>
                    <div className='recipe_body' style={{padding: '1em .5em',fontSize: '.8em',letterSpacing: '2.5',lineHeight: '25px',textAlign:'left',minHeight: '10em'}}>
                        {messages.map((message, index) => (
                            <div key={index}>
                                <p>{message}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </Modal>
        </>
    );
}
