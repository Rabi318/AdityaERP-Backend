import { Router } from "express";
import { authenticate, validate } from "../middlewares";
import { paddiesController } from "../controllers";

const router = Router();

router.post("/", validate, authenticate.admin, paddiesController.create);
router.get("/:id", validate, paddiesController.getByUserId);
export default router;
