import React from 'react';
//作り方

const Process = ({ steps }) => {
  return (
    <div className='processImg_items'>
      {steps && steps.map((step, index) => (
        <div className="processImg_item" key={index}>
          <div className="processImg_itemNumber">{index + 1}.</div>
          <img src={step.process} alt="Recipe Detail" style={{ width: '150px', height: '150px' }} />
          <p>{step.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Process;