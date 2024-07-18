"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    expireAt: {
        type: Date,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("OTP", otpSchema, "OTP");
