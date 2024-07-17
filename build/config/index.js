"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = exports.configs = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const mongoose_1 = require("mongoose");
const configs = {
    PORT: process.env.PORT,
    API_VERSION: `api/v1`,
    HOST: `${process.env.HOST}`,
    JWT_SECRET: `${process.env.JWT_SECRET}`,
};
exports.configs = configs;
const dbConnect = () => {
    try {
        (0, mongoose_1.connect)(`${process.env.DB_URL}`);
        console.log("Database connected 🚀🚀🚀");
    }
    catch (error) {
        console.log(error);
    }
};
exports.dbConnect = dbConnect;
