import { Invoice } from "../model/invoice.model";
import { AppError } from "../utils/AppError";

export class InvoiceService {
    async create(data: any) {
        return await Invoice.create(data);
    }

    async list({ page = 1, limit = 10, search = "" }) {
        const filter: any = {};

        if (search) {
            filter.$or = [
                { contractNumber: { $regex: search, $options: "i" } },
                { contractTitle: { $regex: search, $options: "i" } },
                { invoicedBy: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Invoice.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Invoice.countDocuments(filter),
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
        const doc = await Invoice.findById(id);
        if (!doc) {
            throw new AppError({
                message: "Invoice not found",
                statusCode: 404,
            });
        }
        return doc;
    }

    async update(id: string, data: any) {
        const updated = await Invoice.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
        if (!updated) {
            throw new AppError({
                message: "Invoice not found",
                statusCode: 404,
            });
        }
        return updated;
    }

    async delete(id: string) {
        const deleted = await Invoice.findByIdAndDelete(id);
        if (!deleted) {
            throw new AppError({
                message: "Invoice not found",
                statusCode: 404,
            });
        }
    }
}
