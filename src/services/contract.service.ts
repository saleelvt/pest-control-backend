import { Contract, JobType } from "../model/contract.model";
import { AppError } from "../utils/AppError";

export class ContractService {
  async create(data: any) {
    return await Contract.create(data);
  }

  async list({ page = 1, limit = 10, search = "", startDate = null, endDate = null }: any) {
    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { aliasName: { $regex: search, $options: "i" } },
        { trnNumber: { $regex: search, $options: "i" } },
        { contractNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (startDate && endDate) {
      filter["jobs"] = {
        $elemMatch: {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      };
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

  async addJobToContract(id: string, jobData: JobType) {
    const contract = await Contract.findById(id);
    if (!contract) {
      throw new AppError({ message: "Contract not found", statusCode: 404 });
    }


    contract.jobs.forEach((job: any) => {
      if (!job.dayType) job.dayType = "day";
      if (job.status === "pending") job.status = "work pending";
      if (job.servicesProducts) {
        job.servicesProducts.forEach((sp: any) => {
          if (!sp.frequencyUnit) sp.frequencyUnit = "month";
        });
      }
    });

    const newJob = contract.jobs.create(jobData);
    contract.jobs.push(newJob);

    await contract.save();
    return contract;
  }

  async getJobById(contractId: string, jobId: string) {
    const contract = await Contract.findById(contractId);
    console.log("contract jobs:", contract);
    if (!contract) {
      throw new AppError({ message: "Contract not found", statusCode: 404 });
    }

    const job = await contract.jobs.find(
      (j: JobType) => j._id?.toString() === jobId.toString()
    );
    console.log("jobs:", job);

    if (!job) {
      throw new AppError({ message: "Job not found", statusCode: 404 });
    }

    return job;
  }

  async updateJob(contractId: string, jobId: string, updates: any) {
    const flatUpdates: any = {};
    for (const [key, val] of Object.entries(updates)) {
      if (key === "invoiceReminder" || key === "servicesProducts") {
        flatUpdates[`jobs.$.${key}`] = val;
      } else {
        flatUpdates[`jobs.$.${key}`] = val;
      }
    }

    const result = await Contract.findOneAndUpdate(
      { _id: contractId, "jobs._id": jobId },
      { $set: flatUpdates },
      { new: true, runValidators: true }
    );

    if (!result)
      throw new AppError({
        message: "Job or contract not found",
        statusCode: 404,
      });

    const updatedJob = result.jobs.find(
      (j: any) => j._id.toString() === jobId.toString()
    );
    return updatedJob;
  }

  async deleteJob(contractId: string, jobId: string) {
    const result = await Contract.findByIdAndUpdate(
      contractId,
      { $pull: { jobs: { _id: jobId } } },
      { new: true }
    );

    if (!result)
      throw new AppError({
        message: "Contract not found or job not removed",
        statusCode: 404,
      });

    return { success: true };
  }

  async getDashboardStats() {
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const contracts = await Contract.find().lean();

    const expiredContracts: any[] = [];
    const expiringContracts: any[] = [];
    const overdueSchedules: any[] = [];
    let scheduledThisWeek = 0;
    let totalActiveContracts = 0;

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    for (const contract of contracts) {
      if (!contract.jobs || contract.jobs.length === 0) continue;

      const jobs = contract.jobs as JobType[];
      const latestEndDate = new Date(
        Math.max(...jobs.map((j) => new Date(j.endDate).getTime()))
      );

      if (latestEndDate < today) {
        expiredContracts.push({
          id: contract.contractNumber,
          client: contract.title,
          expiry: latestEndDate.toISOString().split("T")[0],
          status: "expired",
        });
      } else {
        totalActiveContracts++;
        if (latestEndDate <= next30Days) {
          expiringContracts.push({
            id: contract.contractNumber,
            client: contract.title,
            expiry: latestEndDate.toISOString().split("T")[0],
            status: "expiring",
          });
        }
      }

      for (const job of jobs) {
        const jobDate = new Date(job.startDate);

        if (jobDate >= startOfWeek && jobDate <= endOfWeek) {
          scheduledThisWeek++;
        }

        if (job.status === "work pending" && jobDate < today) {
          const diffTime = Math.abs(today.getTime() - jobDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          overdueSchedules.push({
            id: job._id,
            client: contract.title,
            service: job.servicesProducts?.[0]?.serviceType || "Service",
            dueDate: jobDate.toISOString().split("T")[0],
            daysOverdue: diffDays,
          });
        }
      }
    }

    return {
      expiredContracts,
      expiringContracts,
      overdueSchedules,
      stats: {
        totalActiveContracts,
        scheduledThisWeek,
        actionRequired: expiredContracts.length + overdueSchedules.length,
      },
    };
  }
}
