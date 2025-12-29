import { Router } from "express";
import authRoutes from "./auth.routes";
import { contractRouter } from "./contract.routes";

import invoiceRoutes from "./invoice.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/contracts", contractRouter);
router.use("/invoices", invoiceRoutes);

export { router as rootRouter };
