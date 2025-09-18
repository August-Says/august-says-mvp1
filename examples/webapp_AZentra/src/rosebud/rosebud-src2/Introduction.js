import React from 'react';

export const Introduction = ({ onStart }) => {
  return (
    <div className="introduction">
      <div className="intro-content">
        <div className="logo-container">
          <img 
            src="https://play.rosebud.ai/assets/Leading with Impact logo_compact_colour.png?Uy44" 
            alt="Leading with Impact logo" 
            className="logo" 
          />
        </div>
        
        <div className="message-container">
          <h2>Why This Matters</h2>
          
          <p>
            Leadership isn't just about where you're going — it's about how you show up along the way.
          </p>
          
          <p>
            At ivari, 'Leading with Impact' is more than a program. It's a movement driven by purpose, 
            connection, and growth.
          </p>
          
          <p>
            We want to understand how this journey is landing with you — let's explore it together.
          </p>
          
          <button className="start-button" onClick={onStart}>
            Let's Go
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .introduction {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem 0;
          flex: 1;
        }
        
        .intro-content {
          max-width: 700px;
          background-color: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.8s ease-out;
        }
        
        .message-container {
          text-align: left;
        }
        
        h2 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          color: var(--color-primary);
          text-align: center;
        }
        
        p {
          margin-bottom: 1.2rem;
          font-size: 1.1rem;
          line-height: 1.6;
        }
        
        .start-button {
          background-color: var(--color-secondary);
          font-size: 1.2rem;
          padding: 14px 32px;
          margin-top: 1.5rem;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        
        .start-button:hover {
          background-color: var(--color-secondary);
          opacity: 0.9;
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
          .intro-content {
            padding: 1.5rem;
          }
          
          h2 {
            font-size: 1.5rem;
          }
          
          p {
            font-size: 1rem;
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