import React from 'react';

const ProcessImg = ({ images }) => {
  return (
    <div className='processImg_items'>
      {images && images.map((images_detailUrl, index) => (
        <div className="processImg_item" key={index}>
          <div className="processImg_itemNumber">{index + 1}.</div>
          <img src={images_detailUrl} alt="Recipe Detail" style={{ width: '150px', height: '150px' }} />
        </div>
      ))}
    </div>
  );
};

export default ProcessImg;
