import React, { useState, useEffect } from 'react';
import { SelectAudience } from './SelectAudience';
import { Introduction } from './Introduction';
import { Questions } from './Questions';
import { ThankYou } from './ThankYou';
import { ThemeProvider } from './ThemeProvider';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('select-audience');
  const [userSelections, setUserSelections] = useState({
    audienceType: null,
    answers: []
  });

  const handleAudienceSelect = (audience) => {
    setUserSelections({
      ...userSelections,
      audienceType: audience
    });
    setCurrentScreen('introduction');
  };

    // Use useEffect to call sendLog when screen changes to thank-you
    useEffect(() => {
      if (currentScreen === 'thank-you' && userSelections.answers.length > 0) {
        // Ensure window.sendLog exists before calling it
        if (typeof window.sendLog === 'function') {
          window.sendLog(userSelections.answers);
        }
      }
    }, [currentScreen, userSelections.answers]);

  return (
    <ThemeProvider>
      <div className="app-container">
        {currentScreen === 'select-audience' && (
          <SelectAudience onSelect={handleAudienceSelect} />
        )}
        {currentScreen === 'introduction' && (
          <Introduction onStart={() => setCurrentScreen('questions')} />
        )}
        {currentScreen === 'questions' && (
          <Questions onComplete={(answers) => {
            setUserSelections({
              ...userSelections,
              answers
            });
            setCurrentScreen('thank-you');
          }} />
        )}
        {currentScreen === 'thank-you' && (
          <ThankYou userSelections={userSelections} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;