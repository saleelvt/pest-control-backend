import { Request, Response } from "express";
import { InvoiceService } from "../services/invoice.service";

export const createInvoice = async (req: Request, res: Response) => {
    const service = new InvoiceService();
    const invoice = await service.create(req.body);
    res.status(201).json(invoice);
};

export const getInvoices = async (req: Request, res: Response) => {
    const service = new InvoiceService();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const result = await service.list({ page, limit, search });
    res.json(result);
};

export const getInvoiceById = async (req: Request, res: Response) => {
    const service = new InvoiceService();
    const invoice = await service.getById(req.params.id as string);
    res.json(invoice);
};

export const updateInvoice = async (req: Request, res: Response) => {
    const service = new InvoiceService();
    const invoice = await service.update(req.params.id as string, req.body);
    res.json(invoice);
};

export const deleteInvoice = async (req: Request, res: Response) => {
    const service = new InvoiceService();
    await service.delete(req.params.id as string);
    res.status(204).send();
};
