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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        uppercase: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE"],
        default: "MALE",
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER",
    },
    password: {
        type: String,
    },
    village: {
        type: String,
        required: true,
        uppercase: true,
    },
    email: {
        type: String,
        lowercase: true,
        // default: null,
    },
}, { timestamps: true });
// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   const hashedPassword = await bcrypt.hash(this.password as string, 10);
//   this.password = hashedPassword;
//   next();
// });
UserSchema.methods.isPasswordMatched = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
exports.default = (0, mongoose_1.model)("Users", UserSchema, "Users");
