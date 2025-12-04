import { Request, Response } from "express";
import { ContractService } from "../services/contract.service";

const service = new ContractService();

export const createContract = async (req: Request, res: Response) => {
  const data = await service.create(req.body);
  res.status(201).json({ success: true, data });
};

export const listContracts = async (req: Request, res: Response) => {
  const { page, limit, search } = req.query;
  const result = await service.list({
    page: Number(page),
    limit: Number(limit),
    search: search as string
  });

  res.json({ success: true, ...result });
};

export const getContractById = async (req: Request, res: Response) => {
  const data = await service.getById(req.params.id!);
  res.json({ success: true, data });
};

export const updateContract = async (req: Request, res: Response) => {
  const data = await service.update(req.params.id!, req.body);
  res.json({ success: true, data });
};

export const deleteContract = async (req: Request, res: Response) => {
  await service.delete(req.params.id!);
  res.status(204).send();
};
