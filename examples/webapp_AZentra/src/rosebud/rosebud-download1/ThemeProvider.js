var _this = this;
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
import React from 'react';
// Ivari brand colors based on their logo
var theme = {
    colors: {
        primary: '#2E72AB',
        secondary: '#F37F15',
        accent: '#5CA1DA',
        tertiary: '#5F5D60',
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
export var ThemeContext = /*#__PURE__*/ React.createContext(theme);
export var ThemeProvider = function(param) {
    var children = param.children;
    return /*#__PURE__*/ _jsxDEV(_Fragment, {
        children: [
            /*#__PURE__*/ _jsxDEV("style", {
                children: "\n          :root {\n            --color-primary: ".concat(theme.colors.primary, ";\n            --color-secondary: ").concat(theme.colors.secondary, ";\n            --color-accent: ").concat(theme.colors.accent, ";\n            --color-tertiary: ").concat(theme.colors.tertiary, ";\n            --color-background: ").concat(theme.colors.background, ";\n            --color-text: ").concat(theme.colors.text, ";\n            --color-light-gray: ").concat(theme.colors.lightGray, ";\n          }\n          \n          .app-container {\n            max-width: 900px;\n            margin: 0 auto;\n            padding: 20px;\n            width: 100%;\n            min-height: 100vh;\n            display: flex;\n            flex-direction: column;\n          }\n          \n          h1, h2, h3, h4, h5, h6 {\n            font-family: ").concat(theme.fonts.heading, ";\n            color: var(--color-primary);\n            margin-bottom: 1rem;\n          }\n          \n          p {\n            font-family: ").concat(theme.fonts.body, ";\n            line-height: 1.6;\n            margin-bottom: 1rem;\n          }\n          \n          button {\n            background-color: var(--color-primary);\n            color: white;\n            border: none;\n            padding: 12px 24px;\n            border-radius: 6px;\n            font-size: 1rem;\n            font-weight: 500;\n            transition: all 0.2s ease;\n          }\n          \n          button:hover {\n            background-color: var(--color-accent);\n            transform: translateY(-2px);\n            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n          }\n          \n          .logo-container {\n            display: flex;\n            justify-content: center;\n            margin-bottom: 2rem;\n          }\n          \n          .logo {\n            max-width: 300px;\n            height: auto;\n          }\n          \n          @media (max-width: ").concat(theme.breakpoints.mobile, ") {\n            .app-container {\n              padding: 15px;\n            }\n            \n            .logo {\n              max-width: 200px;\n            }\n            \n            .footer-logo {\n              max-width: 75px;\n              margin-top: 2rem;\n            }\n          }\n          \n          .footer {\n            display: flex;\n            justify-content: center;\n            margin-top: auto;\n            padding: 1.5rem 0;\n          }\n          \n          .footer-logo {\n            max-width: 100px;\n            height: auto;\n          }\n        ")
            }, void 0, false, {
                fileName: "ThemeProvider.js",
                lineNumber: 29,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV(ThemeContext.Provider, {
                value: theme,
                children: children
            }, void 0, false, {
                fileName: "ThemeProvider.js",
                lineNumber: 119,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true);
};
