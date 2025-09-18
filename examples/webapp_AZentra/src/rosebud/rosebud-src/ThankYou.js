import React from 'react';

export const ThankYou = ({ userSelections }) => {
  // Get appropriate message based on audience type
  const getMessage = () => {
    return "Thank you for sharing your perspective. Every voice helps shape the future of leadership at ivari. Your insights fuel our purpose, and your impact makes a difference more than you know.";
  };

  return (
    <div className="thank-you">
      <div className="thank-you-content">
        <div className="logo-container">
          <img 
            src="https://play.rosebud.ai/assets/Leading with Impact logo_compact_colour.png?Uy44" 
            alt="Leading with Impact logo" 
            className="logo" 
          />
        </div>
        
        <div className="completion-icon">✓</div>
        
        <h2>Thank You</h2>
        <p>{getMessage()}</p>
      </div>
      
      <style jsx>{`
        .thank-you {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 0;
          animation: fadeIn 0.8s ease-out;
          min-height: 60vh;
        }
        
        .thank-you-content {
          background-color: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 700px;
          text-align: center;
        }
        
        .completion-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: var(--color-secondary);
          color: white;
          font-size: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1rem auto 2rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        h2 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          color: var(--color-primary);
        }
        
        p {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 0;
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
          .thank-you-content {
            padding: 1.5rem;
          }
          
          h2 {
            font-size: 1.6rem;
          }
          
          p {
            font-size: 1rem;
          }
          
          .completion-icon {
            width: 60px;
            height: 60px;
            font-size: 2rem;
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