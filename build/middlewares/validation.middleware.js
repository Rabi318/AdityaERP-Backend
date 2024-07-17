"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const express_validator_1 = require("express-validator");
const http_errors_1 = require("http-errors");
function validate(req, res, next) {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            throw new http_errors_1.UnprocessableEntity(errors.array()[0].msg);
        next();
    }
    catch (error) {
        next(error);
    }
}
