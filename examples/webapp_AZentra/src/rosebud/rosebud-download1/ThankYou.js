var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React from 'react';
export var ThankYou = function(param) {
    var userSelections = param.userSelections;
    // Get appropriate message based on audience type
    var getMessage = function() {
        return "Thank you for sharing your perspective. Every voice helps shape the future of leadership at ivari. Your insights fuel our purpose, and your impact makes a difference more than you know.";
    };
    return /*#__PURE__*/ _jsxDEV("div", {
        className: "thank-you",
        children: [
            /*#__PURE__*/ _jsxDEV("div", {
                className: "thank-you-content",
                children: [
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: "logo-container",
                        children: /*#__PURE__*/ _jsxDEV("img", {
                            src: "./images/leading-with-impact-logo.png",
                            alt: "Leading with Impact logo",
                            className: "logo"
                        }, void 0, false, {
                            fileName: "ThankYou.js",
                            lineNumber: 13,
                            columnNumber: 11
                        }, _this)
                    }, void 0, false, {
                        fileName: "ThankYou.js",
                        lineNumber: 12,
                        columnNumber: 9
                    }, _this),
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: "completion-icon",
                        children: "✓"
                    }, void 0, false, {
                        fileName: "ThankYou.js",
                        lineNumber: 20,
                        columnNumber: 9
                    }, _this),
                    /*#__PURE__*/ _jsxDEV("h2", {
                        children: "Thank You"
                    }, void 0, false, {
                        fileName: "ThankYou.js",
                        lineNumber: 22,
                        columnNumber: 9
                    }, _this),
                    /*#__PURE__*/ _jsxDEV("p", {
                        children: getMessage()
                    }, void 0, false, {
                        fileName: "ThankYou.js",
                        lineNumber: 23,
                        columnNumber: 9
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "ThankYou.js",
                lineNumber: 11,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("style", {
                children: "\n        .thank-you {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          justify-content: center;\n          padding: 2rem 0;\n          animation: fadeIn 0.8s ease-out;\n          min-height: 60vh;\n        }\n        \n        .thank-you-content {\n          background-color: white;\n          border-radius: 12px;\n          padding: 2rem;\n          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n          max-width: 700px;\n          text-align: center;\n        }\n        \n        .completion-icon {\n          width: 80px;\n          height: 80px;\n          border-radius: 50%;\n          background-color: var(--color-secondary);\n          color: white;\n          font-size: 2.5rem;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          margin: 1rem auto 2rem;\n          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n        }\n        \n        h2 {\n          font-size: 2rem;\n          margin-bottom: 1.5rem;\n          color: var(--color-primary);\n        }\n        \n        p {\n          font-size: 1.1rem;\n          line-height: 1.6;\n          margin-bottom: 0;\n        }\n        \n        @keyframes fadeIn {\n          from {\n            opacity: 0;\n            transform: translateY(20px);\n          }\n          to {\n            opacity: 1;\n            transform: translateY(0);\n          }\n        }\n        \n        @media (max-width: 768px) {\n          .thank-you-content {\n            padding: 1.5rem;\n          }\n          \n          h2 {\n            font-size: 1.6rem;\n          }\n          \n          p {\n            font-size: 1rem;\n          }\n          \n          .completion-icon {\n            width: 60px;\n            height: 60px;\n            font-size: 2rem;\n          }\n        }\n      "
            }, void 0, false, {
                fileName: "ThankYou.js",
                lineNumber: 26,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("div", {
                className: "footer",
                children: /*#__PURE__*/ _jsxDEV("img", {
                    src: "./images/ivari-logo.png",
                    alt: "ivari logo",
                    className: "footer-logo"
                }, void 0, false, {
                    fileName: "ThankYou.js",
                    lineNumber: 104,
                    columnNumber: 9
                }, _this)
            }, void 0, false, {
                fileName: "ThankYou.js",
                lineNumber: 103,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true, {
        fileName: "ThankYou.js",
        lineNumber: 10,
        columnNumber: 5
    }, _this);
};
