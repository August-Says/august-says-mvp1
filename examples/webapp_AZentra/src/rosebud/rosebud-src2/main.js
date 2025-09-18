import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from 'App';
// Create a root container for the app
const container = document.getElementById('root') || document.createElement('div');
if (!container.id) {
  container.id = 'root';
  document.body.appendChild(container);
}
const root = createRoot(container);
root.render(<App />);
// Add global styles
document.head.innerHTML += `
<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }
  
  body {
    background-color: #F5F5F5;
    color: #333;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  
  
  button {
    cursor: pointer;
  }
  
  #root {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
`;
