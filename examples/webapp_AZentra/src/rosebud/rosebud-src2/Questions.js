import React, { useState, useEffect } from 'react';

// This or That question pairs for the quiz
const questionPairs = [
  {
    id: 1,
    question: "Leading with Impact makes me feel...",
    options: [
      { id: 'a', text: "Inspired to grow" },
      { id: 'b', text: "Motivated to take action" }
    ]
  },
  {
    id: 2,
    question: "Leadership development at ivari is...",
    options: [
      { id: 'a', text: "A valuable investment" },
      { id: 'b', text: "An essential practice" }
    ]
  },
  {
    id: 3,
    question: "The program's biggest strength is...",
    options: [
      { id: 'a', text: "Building deeper connections" },
      { id: 'b', text: "Developing practical skills" }
    ]
  },
  {
    id: 4,
    question: "What I appreciate most is...",
    options: [
      { id: 'a', text: "Personal growth opportunities" },
      { id: 'b', text: "Professional advancement" }
    ]
  },
  {
    id: 5,
    question: "The program's approach is...",
    options: [
      { id: 'a', text: "Innovative and forward-thinking" },
      { id: 'b', text: "Grounded in proven methods" }
    ]
  },
  {
    id: 6,
    question: "My biggest takeaway is...",
    options: [
      { id: 'a', text: "Enhanced self-awareness" },
      { id: 'b', text: "Improved leadership capability" }
    ]
  }
];

export const Questions = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [randomizedOptions, setRandomizedOptions] = useState([]);
  const [animation, setAnimation] = useState('');

  // Randomize option positions on initial load and question change
  useEffect(() => {
    if (currentQuestionIndex < questionPairs.length) {
      const currentOptions = [...questionPairs[currentQuestionIndex].options];
      // Randomly shuffle options
      if (Math.random() > 0.5) {
        currentOptions.reverse();
      }
      setRandomizedOptions(currentOptions);
    }
  }, [currentQuestionIndex]);

  const handleOptionSelect = (selectedOption) => {
    const currentQuestion = questionPairs[currentQuestionIndex];
    
    // Store the answer
    setAnswers([...answers, {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      selectedOption
    }]);

    // Trigger exit animation
    setAnimation('exit');
    
    // Set a timeout to move to the next question or complete the quiz
    setTimeout(() => {
      if (currentQuestionIndex < questionPairs.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setAnimation('enter');
      } else {
        // Quiz completed
        onComplete(answers);
      }
    }, 500);
  };

  // If no questions or completed all questions
  if (!questionPairs.length || currentQuestionIndex >= questionPairs.length) {
    return null;
  }

  const currentQuestion = questionPairs[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questionPairs.length) * 100;

  return (
    <div className="questions-container">
      <div className="logo-container">
        <img 
          src="https://play.rosebud.ai/assets/Leading with Impact logo_compact_colour.png?Uy44" 
          alt="Leading with Impact logo" 
          className="logo" 
        />
      </div>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">Question {currentQuestionIndex + 1} of {questionPairs.length}</div>
      </div>
      
      <div className={`question-content ${animation}`}>
        <h2 className="question-text">{currentQuestion.question}</h2>
        
        <div className="options-container">
          <button
            key={randomizedOptions[0]?.id}
            className="option-button"
            onClick={() => handleOptionSelect(randomizedOptions[0])}
          >
            {randomizedOptions[0]?.text}
          </button>
          
          <div className="vs-indicator">VS</div>
          
          <button
            key={randomizedOptions[1]?.id}
            className="option-button"
            onClick={() => handleOptionSelect(randomizedOptions[1])}
          >
            {randomizedOptions[1]?.text}
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .questions-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 0;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        
        .progress-container {
          width: 100%;
          margin-bottom: 2rem;
        }
        
        .progress-bar {
          height: 8px;
          background-color: var(--color-light-gray);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        
        .progress-fill {
          height: 100%;
          background-color: var(--color-secondary);
          transition: width 0.5s ease;
        }
        
        .progress-text {
          font-size: 0.9rem;
          color: var(--color-tertiary);
        }
        
        .question-content {
          background-color: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          width: 100%;
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .question-content.enter {
          animation: fadeIn 0.5s ease-out;
        }
        
        .question-content.exit {
          opacity: 0;
          transform: translateY(-20px);
        }
        
        .question-text {
          font-size: 1.5rem;
          margin-bottom: 2rem;
          color: var(--color-primary);
        }
        
        .options-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          width: 100%;
        }
        .option-button {
          background-color: white;
          border: 2px solid var(--color-primary);
          border-radius: 8px;
          padding: 1.5rem;
          font-size: 1.1rem;
          font-weight: 500;
          color: black;
          text-align: center;
          transition: all 0.3s ease;
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          min-width: 0;
        }
        
        .vs-indicator {
          font-weight: bold;
          font-size: 1.2rem;
          color: var(--color-tertiary);
          padding: 0 1rem;
        }
        
        .option-button:hover {
          background-color: var(--color-primary);
          color: white;
          transform: translateY(-5px);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .questions-container {
            padding: 1rem;
          }
          
          .question-text {
            font-size: 1.3rem;
          }
          
          .options-container {
            flex-direction: column;
          }
          
          .option-button {
            padding: 1.2rem;
            font-size: 1rem;
            width: 100%;
          }
          
          .vs-indicator {
            margin: 0.5rem 0;
          }
        }
      `}</style>
      <div className="footer">
        <img 
          src="https://play.rosebud.ai/assets/ivari_Logo_PMS_EngFre.png?MRTI" 
          alt="ivari logo" 
          className="footer-logo" 
        />
      </div>
    </div>
  );
};