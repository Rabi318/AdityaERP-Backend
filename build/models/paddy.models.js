"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paddySchema = new mongoose_1.Schema({
    nonPlastic: {
        type: Number,
        required: true,
        default: 0,
    },
    packet: [
        {
            type: Number,
            required: true,
        },
    ],
    paddyType: {
        type: String,
        enum: ["1009", "1001", "DERADUN", "BHULAXMI"],
        required: true,
    },
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    rate: {
        type: Number,
        required: true,
    },
    nonPlasticRate: {
        type: Number,
        required: true,
        default: 12,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Paddies", paddySchema, "Paddies");
