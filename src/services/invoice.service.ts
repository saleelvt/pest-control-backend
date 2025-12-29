import { Invoice } from "../model/invoice.model";
import { AppError } from "../utils/AppError";

export class InvoiceService {
    async create(data: any) {
        const invoice = await Invoice.create(data);
        return invoice;
    }

    async list(filters: any = {}) {
        const { contractId, jobId, startDate, endDate } = filters;
        const query: any = {};

        if (contractId) query.contractId = contractId;
        if (jobId) query.jobId = jobId;
        if (startDate && endDate) {
            query.collectionDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        if (filters.scheduledStartDate && filters.scheduledEndDate) {
            query.scheduledDate = { $gte: new Date(filters.scheduledStartDate), $lte: new Date(filters.scheduledEndDate) };
        }

        return await Invoice.find(query).sort({ collectionDate: -1 });
    }

    async getByScheduledDate(contractId: string, jobId: string, scheduledDate: string) {
        const start = new Date(scheduledDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(scheduledDate);
        end.setHours(23, 59, 59, 999);

        return await Invoice.findOne({
            contractId,
            jobId,
            scheduledDate: { $gte: start, $lte: end }
        });
    }
}
