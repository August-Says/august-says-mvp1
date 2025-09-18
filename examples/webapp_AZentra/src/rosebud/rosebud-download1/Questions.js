function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
var _this = this;
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from 'react';
// This or That question pairs for the quiz
var questionPairs = [
    {
        id: 1,
        question: "Leading with Impact makes me feel...",
        options: [
            {
                id: 'a',
                text: "Inspired to grow"
            },
            {
                id: 'b',
                text: "Motivated to take action"
            }
        ]
    },
    {
        id: 2,
        question: "Leadership development at ivari is...",
        options: [
            {
                id: 'a',
                text: "A valuable investment"
            },
            {
                id: 'b',
                text: "An essential practice"
            }
        ]
    },
    {
        id: 3,
        question: "The program's biggest strength is...",
        options: [
            {
                id: 'a',
                text: "Building deeper connections"
            },
            {
                id: 'b',
                text: "Developing practical skills"
            }
        ]
    },
    {
        id: 4,
        question: "What I appreciate most is...",
        options: [
            {
                id: 'a',
                text: "Personal growth opportunities"
            },
            {
                id: 'b',
                text: "Professional advancement"
            }
        ]
    },
    {
        id: 5,
        question: "The program's approach is...",
        options: [
            {
                id: 'a',
                text: "Innovative and forward-thinking"
            },
            {
                id: 'b',
                text: "Grounded in proven methods"
            }
        ]
    },
    {
        id: 6,
        question: "My biggest takeaway is...",
        options: [
            {
                id: 'a',
                text: "Enhanced self-awareness"
            },
            {
                id: 'b',
                text: "Improved leadership capability"
            }
        ]
    }
];
export var Questions = function(param) {
    var onComplete = param.onComplete;
    var _useState = _sliced_to_array(useState(0), 2), currentQuestionIndex = _useState[0], setCurrentQuestionIndex = _useState[1];
    var _useState1 = _sliced_to_array(useState([]), 2), answers = _useState1[0], setAnswers = _useState1[1];
    var _useState2 = _sliced_to_array(useState([]), 2), randomizedOptions = _useState2[0], setRandomizedOptions = _useState2[1];
    var _useState3 = _sliced_to_array(useState(''), 2), animation = _useState3[0], setAnimation = _useState3[1];
    // Randomize option positions on initial load and question change
    useEffect(function() {
        if (currentQuestionIndex < questionPairs.length) {
            var currentOptions = _to_consumable_array(questionPairs[currentQuestionIndex].options);
            // Randomly shuffle options
            if (Math.random() > 0.5) {
                currentOptions.reverse();
            }
            setRandomizedOptions(currentOptions);
        }
    }, [
        currentQuestionIndex
    ]);
    var handleOptionSelect = function(selectedOption) {
        var currentQuestion = questionPairs[currentQuestionIndex];
        // Create the updated answers array
        var updatedAnswers = _to_consumable_array(answers).concat([
            {
                questionId: currentQuestion.id,
                question: currentQuestion.question,
                selectedOption: selectedOption
            }
        ]);

        // Trigger exit animation
        setAnimation('exit');

        // Set a timeout to move to the next question or complete the quiz
        setTimeout(function() {
            if (currentQuestionIndex < questionPairs.length - 1) {
                setAnswers(updatedAnswers); // Update state for intermediate questions
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setAnimation('enter');
            } else {
                // Quiz completed
                onComplete(updatedAnswers); // Pass the updated answers directly
            }
        }, 500);
    };
    // If no questions or completed all questions
    if (!questionPairs.length || currentQuestionIndex >= questionPairs.length) {
        return null;
    }
    var currentQuestion = questionPairs[currentQuestionIndex];
    var progress = (currentQuestionIndex + 1) / questionPairs.length * 100;
    return /*#__PURE__*/ _jsxDEV("div", {
        className: "questions-container",
        children: [
            /*#__PURE__*/ _jsxDEV("div", {
                className: "logo-container",
                children: /*#__PURE__*/ _jsxDEV("img", {
                    src: "./images/leading-with-impact-logo.png",
                    alt: "Leading with Impact logo",
                    className: "logo"
                }, void 0, false, {
                    fileName: "Questions.js",
                    lineNumber: 109,
                    columnNumber: 9
                }, _this)
            }, void 0, false, {
                fileName: "Questions.js",
                lineNumber: 108,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("div", {
                className: "progress-container",
                children: [
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: "progress-bar",
                        children: /*#__PURE__*/ _jsxDEV("div", {
                            className: "progress-fill",
                            style: {
                                width: "".concat(progress, "%")
                            }
                        }, void 0, false, {
                            fileName: "Questions.js",
                            lineNumber: 118,
                            columnNumber: 11
                        }, _this)
                    }, void 0, false, {
                        fileName: "Questions.js",
                        lineNumber: 117,
                        columnNumber: 9
                    }, _this),
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: "progress-text",
                        children: [
                            "Question ",
                            currentQuestionIndex + 1,
                            " of ",
                            questionPairs.length
                        ]
                    }, void 0, true, {
                        fileName: "Questions.js",
                        lineNumber: 120,
                        columnNumber: 9
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "Questions.js",
                lineNumber: 116,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("div", {
                className: "question-content ".concat(animation),
                children: [
                    /*#__PURE__*/ _jsxDEV("h2", {
                        className: "question-text",
                        children: currentQuestion.question
                    }, void 0, false, {
                        fileName: "Questions.js",
                        lineNumber: 124,
                        columnNumber: 9
                    }, _this),
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: "options-container",
                        children: [
                            /*#__PURE__*/ _jsxDEV("button", {
                                className: "option-button",
                                onClick: function() {
                                    return handleOptionSelect(randomizedOptions[0]);
                                },
                                children: randomizedOptions[0]?.text
                            }, randomizedOptions[0]?.id, false, {
                                fileName: "Questions.js",
                                lineNumber: 127,
                                columnNumber: 11
                            }, _this),
                            /*#__PURE__*/ _jsxDEV("div", {
                                className: "vs-indicator",
                                children: "VS"
                            }, void 0, false, {
                                fileName: "Questions.js",
                                lineNumber: 135,
                                columnNumber: 11
                            }, _this),
                            /*#__PURE__*/ _jsxDEV("button", {
                                className: "option-button",
                                onClick: function() {
                                    return handleOptionSelect(randomizedOptions[1]);
                                },
                                children: randomizedOptions[1]?.text
                            }, randomizedOptions[1]?.id, false, {
                                fileName: "Questions.js",
                                lineNumber: 137,
                                columnNumber: 11
                            }, _this)
                        ]
                    }, void 0, true, {
                        fileName: "Questions.js",
                        lineNumber: 126,
                        columnNumber: 9
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "Questions.js",
                lineNumber: 123,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("style", {
                children: "\n        .questions-container {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          padding: 2rem 0;\n          max-width: 800px;\n          margin: 0 auto;\n          text-align: center;\n        }\n        \n        .progress-container {\n          width: 100%;\n          margin-bottom: 2rem;\n        }\n        \n        .progress-bar {\n          height: 8px;\n          background-color: var(--color-light-gray);\n          border-radius: 4px;\n          overflow: hidden;\n          margin-bottom: 8px;\n        }\n        \n        .progress-fill {\n          height: 100%;\n          background-color: var(--color-secondary);\n          transition: width 0.5s ease;\n        }\n        \n        .progress-text {\n          font-size: 0.9rem;\n          color: var(--color-tertiary);\n        }\n        \n        .question-content {\n          background-color: white;\n          border-radius: 12px;\n          padding: 2rem;\n          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n          width: 100%;\n          opacity: 1;\n          transform: translateY(0);\n          transition: opacity 0.5s ease, transform 0.5s ease;\n        }\n        \n        .question-content.enter {\n          animation: fadeIn 0.5s ease-out;\n        }\n        \n        .question-content.exit {\n          opacity: 0;\n          transform: translateY(-20px);\n        }\n        \n        .question-text {\n          font-size: 1.5rem;\n          margin-bottom: 2rem;\n          color: var(--color-primary);\n        }\n        \n        .options-container {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          gap: 1rem;\n          width: 100%;\n        }\n        .option-button {\n          background-color: white;\n          border: 2px solid var(--color-primary);\n          border-radius: 8px;\n          padding: 1.5rem;\n          font-size: 1.1rem;\n          font-weight: 500;\n          color: black;\n          text-align: center;\n          transition: all 0.3s ease;\n          min-height: 80px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          flex: 1;\n          min-width: 0;\n        }\n        \n        .vs-indicator {\n          font-weight: bold;\n          font-size: 1.2rem;\n          color: var(--color-tertiary);\n          padding: 0 1rem;\n        }\n        \n        .option-button:hover {\n          background-color: var(--color-primary);\n          color: white;\n          transform: translateY(-5px);\n        }\n        \n        @keyframes fadeIn {\n          from {\n            opacity: 0;\n            transform: translateY(20px);\n          }\n          to {\n            opacity: 1;\n            transform: translateY(0);\n          }\n        }\n        \n        @media (max-width: 768px) {\n          .questions-container {\n            padding: 1rem;\n          }\n          \n          .question-text {\n            font-size: 1.3rem;\n          }\n          \n          .options-container {\n            flex-direction: column;\n          }\n          \n          .option-button {\n            padding: 1.2rem;\n            font-size: 1rem;\n            width: 100%;\n          }\n          \n          .vs-indicator {\n            margin: 0.5rem 0;\n          }\n        }\n      "
            }, void 0, false, {
                fileName: "Questions.js",
                lineNumber: 147,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ _jsxDEV("div", {
                className: "footer",
                children: /*#__PURE__*/ _jsxDEV("img", {
                    src: "./images/ivari-logo.png",
                    alt: "ivari logo",
                    className: "footer-logo"
                }, void 0, false, {
                    fileName: "Questions.js",
                    lineNumber: 282,
                    columnNumber: 9
                }, _this)
            }, void 0, false, {
                fileName: "Questions.js",
                lineNumber: 281,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true, {
        fileName: "Questions.js",
        lineNumber: 107,
        columnNumber: 5
    }, _this);
};
