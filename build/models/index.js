"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paddies = exports.Users = void 0;
var user_models_1 = require("./user.models");
Object.defineProperty(exports, "Users", { enumerable: true, get: function () { return __importDefault(user_models_1).default; } });
var paddy_models_1 = require("./paddy.models");
Object.defineProperty(exports, "Paddies", { enumerable: true, get: function () { return __importDefault(paddy_models_1).default; } });
