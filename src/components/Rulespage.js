import React, { useState } from 'react';
import './styles/Rulespage.css'; // Ensure the path is correct
import { useNavigate } from 'react-router-dom'; // Use useNavigate

const accordionData = [
  {
    id: 1,
    title: 'What is Hack The Bot?',
    content: 'Hack The Bot is an exciting game designed to challenge your ability to interact with large language models (LLMs).'
  },
  {
    id: 2,
    title: 'What should I do?',
    content: 'Your goal is to trick Bujji into revealing the secret password for each level. However, Expecto will level up each time you guess the password.'
  },
  {
    id: 3,
    title: 'How many levels are there?',
    content: '3 levels'
  },
  // {
  //   id: 4,
  //   title: 'Does',
  //   content: 'Some more details about the game.'
  // }
];

const RulesPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate(); // Use navigate instead of history

  const handleClick = () => {
    navigate('/login');
  };

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="rules-container">
      <div className="accordion-container animate__animated animate__fadeInLeft">
        {accordionData.map((item, index) => (
          <div
            key={item.id}
            className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
          >
            <div className="accordion-title animate__animated animate__fadeInRightBig" onClick={() => handleToggle(index)}>
              <span className="accordion-number animate__animated animate__fadeInLeft">{item.id}</span>
              {item.title}
            </div>
            {activeIndex === index && (
              <div className="accordion-content">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="button-container animate__animated animate__fadeInUpBig">
        <button className="btn2 " onClick={handleClick}>I am ready !!</button>
      </div>
    </div>
  );
};

export default RulesPage;
