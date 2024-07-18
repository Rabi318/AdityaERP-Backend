"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
require("dotenv/config");
const models_1 = require("../models");
exports.paymentController = {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount, userId, paymentMode, paymentType } = req.body;
                if (!amount || !userId || !paymentMode || !paymentType) {
                    return res.status(400).json({
                        success: false,
                        msg: "All fields are requireds",
                    });
                }
                const data = yield models_1.Payments.create({
                    amount,
                    paymentMode,
                    paymentType,
                    userId,
                });
                if (!data) {
                    return res.status(500).json({
                        success: false,
                        msg: "Something went wrong while creating payment",
                    });
                }
                res.json({
                    success: true,
                    msg: "Payment Done",
                    data: data,
                });
            }
            catch (error) {
                next(error);
            }
        });
    },
};
