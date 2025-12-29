import { Router } from "express";
import { createInvoice, listInvoices, checkInvoiceStatus } from "../controllers/invoice.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/", asyncHandler(createInvoice));
router.get("/", asyncHandler(listInvoices));
router.get("/status", asyncHandler(checkInvoiceStatus));

export default router;
