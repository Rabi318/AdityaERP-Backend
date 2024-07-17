"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.RouterPlugin = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
exports.RouterPlugin = {
    setup(app) {
        (0, fs_1.readdir)(path_1.default.join(__dirname, "../routes"), (err, files) => {
            files.forEach((filename, index) => __awaiter(this, void 0, void 0, function* () {
                const route = filename.split(".")[0];
                const router = yield Promise.resolve(`${path_1.default.join(__dirname, `../routes/${filename}`)}`).then(s => __importStar(require(s)));
                app.use(`/${config_1.configs.API_VERSION}/${route}`, router.default);
                console.log(`http://${config_1.configs.HOST}:${config_1.configs.PORT}/${config_1.configs.API_VERSION}/${route}\n`);
                if ((files === null || files === void 0 ? void 0 : files.length) - 1 === index) {
                    app.use((_req, res) => {
                        res.status(404).json({ msg: "Route not found" });
                    });
                }
            }));
        });
    },
};
