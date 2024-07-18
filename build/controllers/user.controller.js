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
exports.userController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv/config");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
const services_1 = require("../services");
exports.userController = {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phone, email, password, gender, village, name } = req.body;
                const findUser = yield models_1.Users.findOne({ phone: phone });
                if (findUser) {
                    return res.status(400).json({
                        success: false,
                        msg: "Phone Number Already Registered",
                    });
                }
                const userData = {
                    phone: phone,
                    email: email || null,
                    password: null,
                    name: name,
                    village: village,
                    gender: gender,
                };
                if (password) {
                    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                    userData.password = hashedPassword;
                }
                const data = yield models_1.Users.create(userData);
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
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phone, password } = req.body;
                const findUser = yield models_1.Users.findOne({ phone: phone });
                if (!findUser) {
                    return res.status(404).json({
                        success: false,
                        msg: "Invalid phone number!!",
                    });
                }
                if (findUser.email === null) {
                    return res.status(400).json({
                        success: false,
                        msg: "Please add your email before login!!",
                    });
                }
                // Check if the user has a password set
                if (!findUser.password) {
                    return res.status(400).json({
                        success: false,
                        msg: "No password set for this user. Please use a different login method.",
                    });
                }
                const passwordMatch = yield bcrypt_1.default.compare(password, findUser === null || findUser === void 0 ? void 0 : findUser.password);
                if (!passwordMatch) {
                    return res.status(400).json({
                        success: false,
                        msg: "Incorrect password. Please try again.",
                    });
                }
                const token = yield (0, middlewares_1.GenerateToken)(findUser._id.toString());
                if (!token) {
                    return res.status(500).json({
                        success: false,
                        msg: "Something went wrong while token create!!",
                    });
                }
                res.json({
                    success: true,
                    msg: "Login successfully",
                    user: findUser,
                    token: token,
                });
            }
            catch (error) {
                next(error);
            }
        });
    },
    getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                // console.log("UserID===========>", userId);
                if (!userId) {
                    return res.status(400).json({
                        success: false,
                        msg: "UserId required!!",
                    });
                }
                const findUser = yield models_1.Users.findById(userId).select("-password");
                if (!findUser) {
                    return res.status(404).json({
                        success: false,
                        msg: "User not found!!",
                    });
                }
                res.json({
                    success: true,
                    msg: "Successful",
                    data: findUser,
                });
            }
            catch (error) {
                next(error);
            }
        });
    },
    addEmailSendOptforPasswordset(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, phone } = req.body;
                const findUser = yield models_1.Users.findOne({ phone: phone });
                if (!findUser) {
                    return res.status(404).json({
                        success: false,
                        msg: "User not found with the phoen number!!",
                    });
                }
                const otp = Math.floor(Math.random() * 999999);
                let expireTime = new Date();
                expireTime.setMinutes(expireTime.getMinutes() + 3);
                const data = yield models_1.OTP.findOneAndUpdate({ phone: phone }, {
                    otp: otp,
                    expireAt: expireTime,
                    email: email,
                    userId: findUser._id,
                }, {
                    upsert: true,
                    new: true,
                });
                if (!data) {
                    return res.status(500).json({
                        success: false,
                        msg: "Something went wrong while set otp at model",
                    });
                }
                const sendMail = yield services_1.EmailServices.setPasswordEmail(email, findUser.name, otp);
                if (!sendMail) {
                    return res.status(500).json({
                        success: false,
                        msg: "Something went wrong on server while sending email",
                    });
                }
                const setEmailForUser = yield models_1.Users.findOneAndUpdate({ phone: phone }, {
                    email: email,
                }, { upsert: true, new: true });
                if (!setEmailForUser) {
                    return res.status(500).json({
                        success: false,
                        msg: "Email not set for the user",
                    });
                }
                res.json({
                    success: true,
                    msg: "Otp Send Successfully",
                    data: data,
                });
            }
            catch (error) {
                next(error);
            }
        });
    },
    verifyOtpAndSetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp, password } = req.body;
                const findOtp = yield models_1.OTP.findOne({
                    otp: otp,
                    expireAt: { $gte: new Date() },
                });
                if (!findOtp) {
                    return res.status(400).json({
                        success: false,
                        msg: "OTP Expired",
                    });
                }
                if (otp !== findOtp.otp) {
                    return res.status(400).json({
                        success: false,
                        msg: "Invalid OTP",
                    });
                }
                const hashPassword = yield bcrypt_1.default.hash(password, 10);
                const data = yield models_1.Users.findByIdAndUpdate(findOtp.userId, { password: hashPassword }, { new: true });
                if (!data) {
                    return res.status(500).json({
                        success: false,
                        msg: "Something went wrong while set password",
                    });
                }
                res.json({
                    success: true,
                    msg: "Password Set Successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    },
};
