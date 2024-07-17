"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const configs = {
    PORT: process.env.PORT,
    API_VERSION: `api/v1`,
    HOST: `${process.env.HOST}`,
};
exports.configs = configs;
