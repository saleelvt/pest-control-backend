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
    search: search as string,
  });

  res.json({ success: true, ...result });
};

export const getDashboardStats = async (req: Request, res: Response) => {
  const stats = await service.getDashboardStats();
  res.json({ success: true, data: stats });
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

export const addJobToContract = async (req: Request, res: Response) => {
  const { id } = req.params;
  const jobData = req.body;

  const contract = await service.addJobToContract(id!, jobData);

  return res.status(201).json({
    success: true,
    message: "Job added successfully",
    data: contract,
  });
};

export const getJobById = async (req: Request, res: Response) => {
  const jobs = await service.getJobById(req.params.id!, req.params.jobId!);
  return res.status(200).json({
    success: true,
    data: jobs,
  });
};

export const updateJob = async (req: Request, res: Response) => {
  const { id, jobId } = req.params;
  const updates = req.body;
  const updatedJob = await service.updateJob(id!, jobId!, updates!);
  res.json({ success: true, data: updatedJob });
};

export const deleteJob = async (req: Request, res: Response) => {
  const { id, jobId } = req.params;
  await service.deleteJob(id!, jobId!);
  res.status(204).send();
};
