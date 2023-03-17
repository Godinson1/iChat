"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGreater = exports.isEmpty = exports.isEmail = void 0;
const isEmpty = (data) => {
    if (data.trim() === "" ||
        data.trim() === null ||
        data.trim() === undefined ||
        !data) {
        return true;
    }
    return false;
};
exports.isEmpty = isEmpty;
const isEmail = (data) => {
    const regEx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (data.match(regEx))
        return true;
    else
        return false;
};
exports.isEmail = isEmail;
const isGreater = (data) => {
    if (data.length < 6)
        return true;
    else
        return false;
};
exports.isGreater = isGreater;
