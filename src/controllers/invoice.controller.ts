import { Request, Response } from "express";
import { InvoiceService } from "../services/invoice.service";

const service = new InvoiceService();

export const createInvoice = async (req: Request, res: Response) => {
    const data = await service.create(req.body);
    res.status(201).json({ success: true, data });
};

export const listInvoices = async (req: Request, res: Response) => {
    const data = await service.list(req.query);
    res.json({ success: true, data });
};

export const checkInvoiceStatus = async (req: Request, res: Response) => {
    const { contractId, jobId, scheduledDate } = req.query;
    if (!contractId || !jobId || !scheduledDate) {
        return res.status(400).json({ success: false, message: "Missing required parameters" });
    }

    const invoice = await service.getByScheduledDate(
        contractId as string,
        jobId as string,
        scheduledDate as string
    );

    res.json({ success: true, collected: !!invoice, data: invoice });
};
