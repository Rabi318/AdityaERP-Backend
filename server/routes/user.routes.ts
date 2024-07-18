import { Router } from "express";
import { authenticate, validate } from "../middlewares";
import { userController } from "../controllers";

const router = Router();

router.post("/", validate, authenticate.admin, userController.create);
router.post("/login", validate, userController.login);
router.post("/sendOtp", validate, userController.addEmailSendOptforPasswordset);
router.post(
  "/verifyOtpSetPass",
  validate,
  userController.verifyOtpAndSetPassword
);
router.get("/", validate, authenticate.admin, userController.getAllUsers);
router.get("/self", validate, authenticate.any, userController.getUserById);
export default router;
