import { Contract } from "../model/contract.model";
import { AppError } from "../utils/AppError";

export class ContractService {
  async create(data: any) {
    return await Contract.create(data);
  }

  async list({ page = 1, limit = 10, search = "" }) {
    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { aliasName: { $regex: search, $options: "i" } },
        { trnNumber: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Contract.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Contract.countDocuments(filter),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const doc = await Contract.findById(id);
    if (!doc) {
      throw new AppError({
        message: "Contract not found",
        statusCode: 404,
      });
    }
    return doc;
  }

  async update(id: string, data: any) {
    const updated = await Contract.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new AppError({
        message: "Contract not found",
        statusCode: 404,
      });
    }

    return updated;
  }

  async delete(id: string) {
    const deleted = await Contract.findByIdAndDelete(id);
    if (!deleted) {
      throw new AppError({
        message: "Contract not found",
        statusCode: 404,
      });
    }
  }
}
