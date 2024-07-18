"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    amount: {
        type: Number,
        required: true,
    },
    paymentType: {
        type: String,
        enum: ["ADVANCE", "PAID"],
        required: true,
    },
    paymentMode: {
        type: String,
        enum: ["ONLINE", "CASH"],
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Payments", paymentSchema, "Payments");
