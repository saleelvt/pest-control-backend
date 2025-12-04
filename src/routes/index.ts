import { Router } from "express";
import authRoutes from "./auth.routes";
import { contractRouter } from "./contract.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/contracts", contractRouter);

export { router as rootRouter };
