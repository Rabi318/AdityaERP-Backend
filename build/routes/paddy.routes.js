"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.post("/", middlewares_1.validate, controllers_1.paddiesController.create);
router.get("/:id", middlewares_1.validate, controllers_1.paddiesController.getByUserId);
exports.default = router;
