//作り方 パーツ ※一カ所でしか使ってない
import React from 'react';

const Process = ({ steps }) => {
  return (
    <div className='process_items'>
      {steps && steps.map((step, index) => (
        <div className="process_item" key={index}>
          <div className="process_itemNumber">{index + 1}.</div>
          {step.process && (
            <div className="process_itemImg">
              <img src={step.process} alt="Recipe Detail" style={{ width: '150px', height: '150px' }} />
            </div>
          )}
          <p>{step.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Process;