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


// src="https://firebasestorage.googleapis.com/v0/b/my-recipe-b7757.appspot.com/o/images_detailUrl%2F1126143502_61a0720614b35.jpg?alt=media&token=4fda44be-5c35-4329-a9a6-f7e92f414a27"
// src="https://firebasestorage.googleapis.com/v0/b/my-recipe-b7757.appspot.com/o/images_detailUrl%2F0719154304_62d652787c34c.jpg?alt=media&token=71d50ca7-451f-497a-8ed2-6e885e37be02"
//      https://firebasestorage.googleapis.com/v0/b/my-recipe-b7757.appspot.com/o/images_detailUrl%2F000441b74d1fb458303253a06d20e341%20(2).webp?alt=media&token=ada80108-f3da-4367-a643-6cf9e7bbc810