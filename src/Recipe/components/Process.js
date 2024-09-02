//作り方 パーツ ※一カ所でしか使ってない
import React from 'react';

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