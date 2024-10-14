// src/Recipe/components/ChatModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import Chat from './Chat';

Modal.setAppElement('#root');  // アクセシビリティのためにrootエレメントを設定

const ChatModal = ({ ingredients, ingredientQtys }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 }); // 初期位置を調整
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  if (!ingredients || !ingredientQtys) {
    return <div>No ingredients available</div>; // データがない場合の処理
  }

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
    <div>
      <button onClick={openModal}>チャットを開く</button>

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
            width: '400px',
            height: '300px',
            cursor: isDragging ? 'grabbing' : 'grab',
            pointerEvents: 'auto',
          },
        }}
        contentLabel="Chat Modal"
      >
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ height: '100%', width: '100%' }}
        >
          <button onClick={closeModal} style={{ float: 'right' }}>閉じる</button>
          <Chat ingredients={ingredients} ingredientQtys={ingredientQtys} />
        </div>
      </Modal>
    </div>
  );
};

export default ChatModal;
