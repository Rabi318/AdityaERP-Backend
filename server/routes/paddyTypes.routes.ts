import { Router } from "express";
import { authenticate, validate } from "../middlewares";
import { paddyTypesController } from "../controllers";
const router = Router();

router.post("/", validate, authenticate.admin, paddyTypesController.create);
router.get("/", validate, authenticate.admin, paddyTypesController.getAll);
router.delete(
  "/:id",
  validate,
  authenticate.admin,
  paddyTypesController.delete
);
export default router;
