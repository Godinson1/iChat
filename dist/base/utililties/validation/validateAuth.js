"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReg = exports.validateLogin = void 0;
const helpers_1 = require("./helpers");
const validateReg = ({ username, email, password, }) => {
    const errors = {};
    if (helpers_1.isEmpty(email))
        errors.email = "Email must not be empty";
    else if (!helpers_1.isEmail(email))
        errors.email = "Must be a valid email address";
    if (helpers_1.isEmpty(password))
        errors.password = "Password must not be empty";
    if (helpers_1.isGreater(password))
        errors.password = "Password must have at least 6 characters";
    if (helpers_1.isEmpty(username))
        errors.username = "Username must not be empty";
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};
exports.validateReg = validateReg;
const validateLogin = ({ username, password, }) => {
    const errors = {};
    if (helpers_1.isEmpty(password))
        errors.password = "Password must not be empty";
    if (helpers_1.isGreater(password))
        errors.password = "Password must have at least 6 characters";
    if (helpers_1.isEmpty(username))
        errors.username = "Username must not be empty";
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};
exports.validateLogin = validateLogin;
