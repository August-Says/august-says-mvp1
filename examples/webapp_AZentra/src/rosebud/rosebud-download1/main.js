import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
// Create a root container for the app
var container = document.getElementById('root') || document.createElement('div');
if (!container.id) {
    container.id = 'root';
    document.body.appendChild(container);
}
var root = createRoot(container);
root.render(/*#__PURE__*/ _jsxDEV(App, {}, void 0, false, {
    fileName: "main.js",
    lineNumber: 11,
    columnNumber: 13
}, this));
// Add global styles
document.head.innerHTML += "\n<style>\n  * {\n    box-sizing: border-box;\n    margin: 0;\n    padding: 0;\n    font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;\n  }\n  \n  body {\n    background-color: #F5F5F5;\n    color: #333;\n    min-height: 100vh;\n    display: flex;\n    flex-direction: column;\n  }\n  \n  button {\n    cursor: pointer;\n  }\n  \n  #root {\n    flex: 1;\n    display: flex;\n    flex-direction: column;\n  }\n</style>\n";
