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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paddiesController = void 0;
require("dotenv/config");
const models_1 = require("../models");
const mongoose_1 = __importDefault(require("mongoose"));
exports.paddiesController = {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield models_1.Paddies.create(Object.assign({}, req.body));
                if (!data) {
                    return res.status(500).json({
                        success: false,
                        msg: "Something went wrong on server!!",
                    });
                }
                res.json({
                    success: true,
                    msg: "Create successfully",
                    data: data,
                });
            }
            catch (error) {
                next(error);
            }
        });
    },
    getByUserId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                if (!userId) {
                    return res.status(400).json({
                        success: false,
                        msg: "User id required!!",
                    });
                }
                const data = yield models_1.Paddies.aggregate([
                    {
                        $match: { userId: new mongoose_1.default.Types.ObjectId(userId) },
                    },
                    {
                        $addFields: {
                            totalQnt: { $sum: "$packet" },
                            perKg: { $divide: ["$rate", 100] },
                            nonPlasticD: { $multiply: ["$nonPlastic", "$nonPlasticRate"] },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            userId: 1,
                            totalQnt: 1,
                            date: 1,
                            rate: 1,
                            nonPlastic: 1,
                            packet: 1,
                            paddyType: 1,
                            nonPlasticRate: 1,
                            nonPlasticD: 1,
                            totalAmount: { $multiply: ["$totalQnt", "$perKg"] },
                            toPaid: {
                                $subtract: [
                                    { $multiply: ["$totalQnt", "$perKg"] },
                                    "$nonPlasticD",
                                ],
                            },
                        },
                    },
                ]);
                if (data.length === 0) {
                    return res.status(404).json({
                        success: false,
                        msg: "No data found for the provided user id",
                    });
                }
                if (!data) {
                    return res.status(500).json({
                        success: false,
                        msg: "Something wrong on server",
                    });
                }
                res.json({
                    success: true,
                    msg: "Successfully get data",
                    data: data,
                });
            }
            catch (error) {
                next(error);
            }
        });
    },
};
