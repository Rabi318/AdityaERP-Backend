import { Router } from "express";
import { authenticate, validate } from "../middlewares";
import { paymentController } from "../controllers";
const router = Router();

router.post("/", validate, authenticate.admin, paymentController.create);

export default router;
