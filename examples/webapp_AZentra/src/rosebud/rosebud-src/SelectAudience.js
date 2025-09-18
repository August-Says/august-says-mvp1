import React from 'react';

export const SelectAudience = ({ onSelect }) => {
  const audienceOptions = [
    {
      id: 'alumni',
      label: 'Alumni of Leading with Impact',
      icon: '🎓'
    },
    {
      id: 'current',
      label: 'Current participant (Leading with Impact 2025)',
      icon: '🚀'
    },
    {
      id: 'leader',
      label: 'Leader of an employee who has participated in Leading with Impact',
      icon: '👑'
    },
    {
      id: 'employee',
      label: 'Employee who has not yet participated in Leading with Impact',
      icon: '💬'
    }
  ];

  return (
    <div className="select-audience">
      <div className="logo-container">
        <img 
          src="https://play.rosebud.ai/assets/Leading with Impact logo_compact_colour.png?Uy44" 
          alt="Leading with Impact logo" 
          className="logo" 
        />
      </div>
      
      <h1>Before we begin, tell us who you are...</h1>
      
      <div className="audience-options">
        {audienceOptions.map((option) => (
          <button 
            key={option.id}
            className="audience-option"
            onClick={() => onSelect(option.id)}
          >
            <span className="audience-icon">{option.icon}</span>
            <span className="audience-label">{option.label}</span>
          </button>
        ))}
      </div>
      
      <style jsx>{`
        .select-audience {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem 0;
        }
        
        h1 {
          margin-bottom: 2rem;
          font-size: 2rem;
        }
        
        .audience-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          width: 100%;
          max-width: 800px;
        }
        
        .audience-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: white;
          border: 2px solid var(--color-primary);
          border-radius: 12px;
          padding: 24px 16px;
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .audience-option:hover {
          transform: translateY(-5px);
          border-color: var(--color-secondary);
          background-color: var(--color-light-gray);
        }
        
        .audience-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }
        
        .audience-label {
          font-weight: 500;
          text-align: center;
          color: #000000;
        }
        
        @media (max-width: 768px) {
          .audience-options {
            grid-template-columns: 1fr;
          }
          
          h1 {
            font-size: 1.5rem;
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