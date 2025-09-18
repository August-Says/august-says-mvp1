import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React, { useState } from 'react';
import { SelectAudience } from './SelectAudience.js';
import { Introduction } from './Introduction.js';
import { Questions } from './Questions.js';
import { ThankYou } from './ThankYou.js';
import { ThemeProvider } from './ThemeProvider.js';

function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
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
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
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

var App = function() {
    var _useState = _sliced_to_array(useState('select-audience'), 2), currentScreen = _useState[0], setCurrentScreen = _useState[1];
    var _useState1 = _sliced_to_array(useState({
        audienceType: null,
        answers: []
    }), 2), userSelections = _useState1[0], setUserSelections = _useState1[1];
    var handleAudienceSelect = function(audience) {
        setUserSelections(_object_spread_props(_object_spread({}, userSelections), {
            audienceType: audience
        }));
        setCurrentScreen('introduction');
    };
    return /*#__PURE__*/ _jsxDEV(ThemeProvider, {
        children: /*#__PURE__*/ _jsxDEV("div", {
            className: "app-container",
            children: [
                currentScreen === 'select-audience' && /*#__PURE__*/ _jsxDEV(SelectAudience, {
                    onSelect: handleAudienceSelect
                }, void 0, false, {
                    fileName: "App.js",
                    lineNumber: 27,
                    columnNumber: 11
                }, _this),
                currentScreen === 'introduction' && /*#__PURE__*/ _jsxDEV(Introduction, {
                    onStart: function() {
                        return setCurrentScreen('questions');
                    }
                }, void 0, false, {
                    fileName: "App.js",
                    lineNumber: 30,
                    columnNumber: 11
                }, _this),
                currentScreen === 'questions' && /*#__PURE__*/ _jsxDEV(Questions, {
                    onComplete: function(answers) {
                        setUserSelections(_object_spread_props(_object_spread({}, userSelections), {
                            answers: answers
                        }));

                        const payload = {
                            audienceType: userSelections.audienceType, // current
                            answers: answers // just received
                          };
                        console.log(payload)
                        window.sendLog(payload)
                        setCurrentScreen('thank-you');
                    }
                }, void 0, false, {
                    fileName: "App.js",
                    lineNumber: 33,
                    columnNumber: 11
                }, _this),
                currentScreen === 'thank-you' && /*#__PURE__*/ _jsxDEV(ThankYou, {
                    userSelections: userSelections
                }, void 0, false, {
                    fileName: "App.js",
                    lineNumber: 42,
                    columnNumber: 11
                }, _this)
            ]
        }, void 0, true, {
            fileName: "App.js",
            lineNumber: 25,
            columnNumber: 7
        }, _this)
    }, void 0, false, {
        fileName: "App.js",
        lineNumber: 24,
        columnNumber: 5
    }, _this);
};

export default App;
