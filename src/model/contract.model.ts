import mongoose, { Schema, Document, Model } from "mongoose";

export interface Address {
  street1: string;
  street2: string;
  city: string;
  poBox: string;
  emirate: string;
  country: string;
}

export interface ServiceProduct {
  serviceType:
  | "building_cleaning"
  | "tanks_containers_cleaning"
  | "disinfection_sterilization"
  | "pest_control";
  instructions: string;
  units: number;
  rate: number;
  subtotalPerYear: number;
  frequencyDays: number;
  frequencyUnit: "day" | "week" | "month" | "year";
  isEveryDay: boolean;
}

export interface InvoiceReminder {
  startDate: Date;
  endDate: Date;
  isAdvanceInvoice: boolean;
  invoiceAfterJobsClosed: boolean;
  billingFrequency: "monthly" | "quarterly" | "semi_annually" | "annually";
}

export interface JobType {
  _id?: string;
  jobType: "recurring" | "one_off";
  contractDate: Date;
  startDate: Date;
  endDate: Date;
  contractedBy: string; // Employee ID or name
  expiryRemindBefore: number; // Days before expiry
  isTaxExempt: boolean;

  invoiceReminder: InvoiceReminder;
  servicesProducts: ServiceProduct[];

  subtotal: number;
  vat: number; // 5% of subtotal
  grandTotal: number;
  status: "work pending" | "work done" | "work informed";
  dayType: "day" | "night";
  createdAt: Date;
  updatedAt: Date;
}

export interface ContractDocument extends Document {
  contractNumber: string;
  title: string;
  aliasName: string;
  trnNumber: string;
  email: string;
  phone: string;
  mobile: string;
  address: Address;

  referredByEmployee: string;
  quoteValidityDays: number;
  creditLimit: number;

  remarks: string;

  jobs: JobType[]; // Array of jobs associated with this contract

  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<Address>(
  {
    street1: { type: String, required: true },
    street2: { type: String, required: true },
    city: { type: String, required: true },
    poBox: { type: String, required: true },
    emirate: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const serviceProductSchema = new Schema<ServiceProduct>(
  {
    serviceType: {
      type: String,
      enum: [
        "building_cleaning",
        "tanks_containers_cleaning",
        "disinfection_sterilization",
        "pest_control",
      ],
      required: true,
    },
    instructions: { type: String, default: "" },
    units: { type: Number, required: true, min: 0 },
    rate: { type: Number, required: true, min: 0 },
    subtotalPerYear: { type: Number, required: true, min: 0 },
    frequencyDays: { type: Number, required: true, min: 1 },
    frequencyUnit: {
      type: String,
      enum: ["day", "week", "month", "year"],
      required: true,
    },
    isEveryDay: { type: Boolean, default: false },
  },
  { _id: false }
);

const invoiceReminderSchema = new Schema<InvoiceReminder>(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isAdvanceInvoice: { type: Boolean, default: false },
    invoiceAfterJobsClosed: { type: Boolean, default: false },
    billingFrequency: {
      type: String,
      enum: ["monthly", "quarterly", "semi_annually", "annually"],
      required: true,
    },
  },
  { _id: false }
);

const jobSchema = new Schema<JobType>(
  {
    jobType: {
      type: String,
      enum: ["recurring", "one_off"],
      required: true,
    },
    contractDate: { type: Date, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    contractedBy: { type: String, required: true },
    expiryRemindBefore: { type: Number, required: true, min: 0 },
    isTaxExempt: { type: Boolean, default: false },

    invoiceReminder: { type: invoiceReminderSchema, required: true },
    servicesProducts: { type: [serviceProductSchema], required: true },
    status: { type: String, enum: ["work pending", "work done", "work informed"], default: "work pending" },
    dayType: { type: String, enum: ["day", "night"], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    vat: { type: Number, required: true, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const contractSchema = new Schema<ContractDocument>(
  {
    contractNumber: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    title: { type: String, required: true },
    aliasName: { type: String, required: true },
    trnNumber: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    mobile: { type: String, required: true },

    address: { type: addressSchema, required: true },

    referredByEmployee: { type: String, required: true },
    quoteValidityDays: { type: Number, required: true },
    creditLimit: { type: Number, required: true },

    remarks: { type: String, required: true },

    jobs: { type: [jobSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

contractSchema.pre("validate", async function (this: ContractDocument) {
  if (this.contractNumber) return;

  const lastContract = await Contract.findOne().sort({ createdAt: -1 });

  let nextNumber = 1;
  if (lastContract?.contractNumber) {
    const lastNum = parseInt(lastContract.contractNumber.replace("PST", ""));
    nextNumber = lastNum + 1;
  }

  this.contractNumber = "PST" + nextNumber.toString().padStart(3, "0");
});

export const Contract: Model<ContractDocument> =
  mongoose.models.Contract ||
  mongoose.model<ContractDocument>("Contract", contractSchema);
