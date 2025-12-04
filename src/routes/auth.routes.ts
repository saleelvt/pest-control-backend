import { Router } from "express";
import { loginController } from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validation";
import { loginSchema } from "../validations/auth.validation";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post(
  "/login",
  validateRequest(loginSchema),
  asyncHandler(loginController)
);

export default router;
