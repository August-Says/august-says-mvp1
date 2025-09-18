var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React from 'react';
export var SelectAudience = function(param) {
    var onSelect = param.onSelect;
    var audienceOptions = [
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
    return /*#__PURE__*/ _jsxDEV("div", {
        className: "select-audience",
        children: [
            /*#__PURE__*/ _jsxDEV("div", {
                className: "logo-container",
                children: /*#__PURE__*/ _jsxDEV("img", {
                    src: "./images/leading-with-impact-logo.png",
                    alt: "Leading with Impact logo",
                    className: "logo"
                }, void 0, false, {
                    fileName: "SelectAudience.js",
                    lineNumber: 30,
                    columnNumber: 9
                }, _this)
            }, void 0, false, {
                fileName: "SelectAudience.js",
                lineNumber: 29,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("h1", {
                children: "Before we begin, tell us who you are..."
            }, void 0, false, {
                fileName: "SelectAudience.js",
                lineNumber: 37,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("div", {
                className: "audience-options",
                children: audienceOptions.map(function(option) {
                    return /*#__PURE__*/ _jsxDEV("button", {
                        className: "audience-option",
                        onClick: function() {
                            return onSelect(option.id);
                        },
                        children: [
                            /*#__PURE__*/ _jsxDEV("span", {
                                className: "audience-icon",
                                children: option.icon
                            }, void 0, false, {
                                fileName: "SelectAudience.js",
                                lineNumber: 46,
                                columnNumber: 13
                            }, _this),
                            /*#__PURE__*/ _jsxDEV("span", {
                                className: "audience-label",
                                children: option.label
                            }, void 0, false, {
                                fileName: "SelectAudience.js",
                                lineNumber: 47,
                                columnNumber: 13
                            }, _this)
                        ]
                    }, option.id, true, {
                        fileName: "SelectAudience.js",
                        lineNumber: 41,
                        columnNumber: 11
                    }, _this);
                })
            }, void 0, false, {
                fileName: "SelectAudience.js",
                lineNumber: 39,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("style", {
                children: "\n        .select-audience {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          text-align: center;\n          padding: 2rem 0;\n        }\n        \n        h1 {\n          margin-bottom: 2rem;\n          font-size: 2rem;\n        }\n        \n        .audience-options {\n          display: grid;\n          grid-template-columns: repeat(2, 1fr);\n          gap: 20px;\n          width: 100%;\n          max-width: 800px;\n        }\n        \n        .audience-option {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          background-color: white;\n          border: 2px solid var(--color-primary);\n          border-radius: 12px;\n          padding: 24px 16px;\n          transition: all 0.3s ease;\n          height: 100%;\n        }\n        \n        .audience-option:hover {\n          transform: translateY(-5px);\n          border-color: var(--color-secondary);\n          background-color: var(--color-light-gray);\n        }\n        \n        .audience-icon {\n          font-size: 2.5rem;\n          margin-bottom: 12px;\n        }\n        \n        .audience-label {\n          font-weight: 500;\n          text-align: center;\n          color: #000000;\n        }\n        \n        @media (max-width: 768px) {\n          .audience-options {\n            grid-template-columns: 1fr;\n          }\n          \n          h1 {\n            font-size: 1.5rem;\n          }\n        }\n      "
            }, void 0, false, {
                fileName: "SelectAudience.js",
                lineNumber: 52,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("div", {
                className: "footer",
                children: /*#__PURE__*/ _jsxDEV("img", {
                    src: "./images/ivari-logo.png",
                    alt: "ivari logo",
                    className: "footer-logo"
                }, void 0, false, {
                    fileName: "SelectAudience.js",
                    lineNumber: 114,
                    columnNumber: 9
                }, _this)
            }, void 0, false, {
                fileName: "SelectAudience.js",
                lineNumber: 113,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true, {
        fileName: "SelectAudience.js",
        lineNumber: 28,
        columnNumber: 5
    }, _this);
};
