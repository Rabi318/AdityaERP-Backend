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
exports.authenticate = void 0;
const http_errors_1 = require("http-errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
exports.authenticate = {
    any: (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const accessToken = process.env.JWT_SECRET;
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                throw new http_errors_1.Unauthorized("Authorization header is missing");
            }
            const token = authorizationHeader.split(" ")[1];
            if (!token)
                throw new http_errors_1.Unauthorized("Token is missing");
            const decoded = jsonwebtoken_1.default.verify(token, accessToken);
            const user = yield models_1.Users.findById(decoded === null || decoded === void 0 ? void 0 : decoded.id);
            req.user = user;
            next();
        }
        catch (error) {
            next(error);
        }
    }),
    admin: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const accessToken = process.env.JWT_SECRET;
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader)
                throw new http_errors_1.Unauthorized("Authorization header is missing");
            const token = authorizationHeader.split(" ")[1];
            if (!token)
                throw new http_errors_1.Unauthorized("Token is missing");
            const decoded = jsonwebtoken_1.default.verify(token, accessToken);
            const user = yield models_1.Users.findById(decoded === null || decoded === void 0 ? void 0 : decoded.id);
            if ((user === null || user === void 0 ? void 0 : user.role) !== "ADMIN") {
                return res.status(401).json({
                    success: false,
                    msg: "Not Authorized",
                });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    }),
};
