"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payments = exports.OTP = exports.Paddies = exports.Users = void 0;
var user_models_1 = require("./user.models");
Object.defineProperty(exports, "Users", { enumerable: true, get: function () { return __importDefault(user_models_1).default; } });
var paddy_models_1 = require("./paddy.models");
Object.defineProperty(exports, "Paddies", { enumerable: true, get: function () { return __importDefault(paddy_models_1).default; } });
var otp_models_1 = require("./otp.models");
Object.defineProperty(exports, "OTP", { enumerable: true, get: function () { return __importDefault(otp_models_1).default; } });
var payment_models_1 = require("./payment.models");
Object.defineProperty(exports, "Payments", { enumerable: true, get: function () { return __importDefault(payment_models_1).default; } });
