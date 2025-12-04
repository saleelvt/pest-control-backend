import mongoose, { Schema, Document, Model } from "mongoose";

export interface Address {
  street1: string;
  street2: string;
  city: string;
  poBox: string;
  emirate: string;
  country: string;
}

export interface ContractDocument extends Document {
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

  priority: "low" | "medium" | "high" | "urgent";
  paymentTerms: "15" | "30" | "45" | "60" | "90";

  remarks: string;

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

const contractSchema = new Schema<ContractDocument>(
  {
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

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      required: true,
    },

    paymentTerms: {
      type: String,
      enum: ["15", "30", "45", "60", "90"],
      required: true,
    },

    remarks: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Contract: Model<ContractDocument> =
  mongoose.models.Contract ||
  mongoose.model<ContractDocument>("Contract", contractSchema);
