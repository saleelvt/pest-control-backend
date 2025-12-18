import { Router } from "express";
import authRoutes from "./auth.routes";
import { contractRouter } from "./contract.routes";
import invoiceRouter from "./invoice.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/contracts", contractRouter);
router.use("/invoices", invoiceRouter);

export { router as rootRouter };
