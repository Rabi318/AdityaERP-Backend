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
exports.userController = void 0;
require("dotenv/config");
const models_1 = require("../models");
exports.userController = {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phone } = req.body;
                const findUser = yield models_1.Users.findOne({ phone: phone });
                if (findUser) {
                    return res.status(400).json({
                        success: false,
                        msg: "Phone Number Already Registered",
                    });
                }
                const data = yield models_1.Users.create(req.body);
                if (!data) {
                    return res.status(500).json({
                        success: false,
                        msg: "Internal Server Error While Signup",
                    });
                }
                res.json({
                    success: true,
                    msg: "Registration successfully",
                    data: data,
                });
            }
            catch (error) {
                next(error);
            }
        });
    },
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = req.query.pageNumber
                    ? Number(req.query.pageNumber)
                    : 1;
                const limit = req.query.limit ? Number(req.query.limit) : 10;
                const search = req.query.search ? String(req.query.search) : null;
                const village = req.query.village ? String(req.query.village) : null;
                const phone = req.query.phone ? Number(req.query.phone) : null;
                const name = req.query.name ? String(req.query.name) : null;
                const sortBy = req.query.sortBy === "desc" ? -1 : 1;
                const matchPipeline = [];
                const dataPipeline = [];
                if (search) {
                    matchPipeline.push({
                        $match: { name: { $regex: search, $options: "i" } },
                    });
                }
                if (village) {
                    matchPipeline.push({ $match: { village: village } });
                }
                if (name) {
                    matchPipeline.push({ $match: { name: name } });
                }
                if (phone) {
                    matchPipeline.push({ $match: { phone: phone } });
                }
                dataPipeline.push(...matchPipeline);
                // Count total documents
                const countPipeline = [...matchPipeline, { $count: "totalCount" }];
                const totalCountData = yield models_1.Users.aggregate(countPipeline);
                const totalCount = totalCountData.length > 0 ? totalCountData[0].totalCount : 0;
                // Pagination and sorting
                dataPipeline.push({ $sort: { name: sortBy } });
                dataPipeline.push({ $skip: (pageNumber - 1) * limit });
                dataPipeline.push({ $limit: limit }); // Projecting fields
                dataPipeline.push({
                    $project: {
                        _id: 1,
                        name: 1,
                        village: 1,
                        phone: 1,
                        email: 1,
                        gender: 1,
                    },
                });
                const data = yield models_1.Users.aggregate(dataPipeline);
                res.json({
                    success: true,
                    msg: "User Get Successfully",
                    data: data,
                    pagination: {
                        totalCount: totalCount,
                        page: pageNumber,
                        limit: limit,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    },
};
