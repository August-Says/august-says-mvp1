import React from 'react';

// Ivari brand colors based on their logo
const theme = {
  colors: {
    primary: '#2E72AB', // Blue from the logo
    secondary: '#F37F15', // Orange from the logo
    accent: '#5CA1DA', // Light blue accent
    tertiary: '#5F5D60', // Gray from the logo
    background: '#FFFFFF',
    text: '#333333',
    lightGray: '#F5F5F5'
  },
  fonts: {
    heading: "'Segoe UI', 'Roboto', sans-serif",
    body: "'Segoe UI', 'Roboto', sans-serif"
  },
  breakpoints: {
    mobile: '768px'
  }
};

// CSS context for styled components
export const ThemeContext = React.createContext(theme);

export const ThemeProvider = ({ children }) => {
  return (
    <>
      <style>
        {`
          :root {
            --color-primary: ${theme.colors.primary};
            --color-secondary: ${theme.colors.secondary};
            --color-accent: ${theme.colors.accent};
            --color-tertiary: ${theme.colors.tertiary};
            --color-background: ${theme.colors.background};
            --color-text: ${theme.colors.text};
            --color-light-gray: ${theme.colors.lightGray};
          }
          
          .app-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            width: 100%;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          
          h1, h2, h3, h4, h5, h6 {
            font-family: ${theme.fonts.heading};
            color: var(--color-primary);
            margin-bottom: 1rem;
          }
          
          p {
            font-family: ${theme.fonts.body};
            line-height: 1.6;
            margin-bottom: 1rem;
          }
          
          button {
            background-color: var(--color-primary);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.2s ease;
          }
          
          button:hover {
            background-color: var(--color-accent);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          
          .logo-container {
            display: flex;
            justify-content: center;
            margin-bottom: 2rem;
          }
          
          .logo {
            max-width: 300px;
            height: auto;
          }
          
          @media (max-width: ${theme.breakpoints.mobile}) {
            .app-container {
              padding: 15px;
            }
            
            .logo {
              max-width: 200px;
            }
            
            .footer-logo {
              max-width: 75px;
              margin-top: 2rem;
            }
          }
          
          .footer {
            display: flex;
            justify-content: center;
            margin-top: auto;
            padding: 1.5rem 0;
          }
          
          .footer-logo {
            max-width: 100px;
            height: auto;
          }
        `}
      </style>
      <ThemeContext.Provider value={theme}>
        {children}
      </ThemeContext.Provider>
    </>
  );
};