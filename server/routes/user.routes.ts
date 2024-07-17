import { Router } from "express";
import { authenticate, validate } from "../middlewares";
import { userController } from "../controllers";

const router = Router();

router.post("/", validate, userController.create);
router.get("/", validate, userController.getAllUsers);

export default router;
