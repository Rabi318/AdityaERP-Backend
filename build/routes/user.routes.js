"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.post("/", middlewares_1.validate, controllers_1.userController.create);
router.get("/", middlewares_1.validate, controllers_1.userController.getAllUsers);
exports.default = router;
