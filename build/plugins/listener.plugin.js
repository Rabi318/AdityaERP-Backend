"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerPlugin = void 0;
const http_1 = __importDefault(require("http"));
const config_1 = require("../config");
exports.ListenerPlugin = {
    listen(app) {
        const server = http_1.default.createServer(app);
        server.listen(config_1.configs.PORT, () => {
            console.log(`\nServer is running on port ${config_1.configs.PORT} 💀💀💀\n`);
        });
    },
};
