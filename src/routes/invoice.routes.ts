import { Router } from "express";
import {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
} from "../controllers/invoice.controller";
import { protectRoute } from "../middlewares/auth";

const router = Router();

router.use(protectRoute);

router.route("/")
    .post(createInvoice)
    .get(getInvoices);

router.route("/:id")
    .get(getInvoiceById)
    .put(updateInvoice)
    .delete(deleteInvoice);

export default router;
