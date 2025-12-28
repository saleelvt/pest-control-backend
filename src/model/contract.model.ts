import mongoose, { Schema, Document, Model, Types } from "mongoose";

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
  isEvery: boolean;
}

export interface InvoiceReminder {
  startDate: Date;
  endDate: Date;
  billingFrequency: "monthly" | "quarterly" | "semi_annually" | "annually" | "custom";
  customFrequencyValue?: number;
  customFrequencyUnit?: "day" | "week" | "month" | "year";
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

  jobs: Types.DocumentArray<JobType>; // Array of jobs associated with this contract

  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<Address>(
  {
    street1: { type: String },
    street2: { type: String },
    city: { type: String },
    poBox: { type: String },
    emirate: { type: String },
    country: { type: String },
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
      ]
    },
    instructions: { type: String, default: "" },
    units: { type: Number, min: 0 },
    rate: { type: Number, min: 0 },
    subtotalPerYear: { type: Number, min: 0 },
    frequencyDays: { type: Number, min: 1 },
    frequencyUnit: {
      type: String,
      enum: ["day", "week", "month", "year"],
    },
    isEvery: { type: Boolean, default: false },
  },
  { _id: false }
);

const invoiceReminderSchema = new Schema<InvoiceReminder>(
  {
    startDate: { type: Date },
    endDate: { type: Date },
    billingFrequency: {
      type: String,
      enum: ["monthly", "quarterly", "semi_annually", "annually", "custom"],
    },
    customFrequencyValue: { type: Number },
    customFrequencyUnit: {
      type: String,
      enum: ["day", "week", "month", "year"],
    },
  },
  { _id: false }
);

const jobSchema = new Schema<JobType>(
  {
    jobType: {
      type: String,
      enum: ["recurring", "one_off"],
    },
    contractDate: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },
    contractedBy: { type: String },
    expiryRemindBefore: { type: Number, min: 0 },
    isTaxExempt: { type: Boolean, default: false },

    invoiceReminder: { type: invoiceReminderSchema },
    servicesProducts: { type: [serviceProductSchema] },
    status: { type: String, enum: ["work pending", "work done", "work informed"], default: "work pending" },
    dayType: { type: String, enum: ["day", "night"] },
    subtotal: { type: Number, min: 0 },
    vat: { type: Number, min: 0 },
    grandTotal: { type: Number, min: 0 },
  },
  { timestamps: true }
);

const contractSchema = new Schema<ContractDocument>(
  {
    contractNumber: {
      type: String,
      unique: true,
      immutable: true,
    },
    title: { type: String },
    aliasName: { type: String },
    trnNumber: { type: String },
    email: { type: String },
    phone: { type: String },
    mobile: { type: String },

    address: { type: addressSchema },

    referredByEmployee: { type: String },
    quoteValidityDays: { type: Number },
    creditLimit: { type: Number },

    remarks: { type: String },

    jobs: { type: [jobSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
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
