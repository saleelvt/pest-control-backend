import mongoose, { Schema, Document, Model } from "mongoose";

export interface InvoiceDocument extends Document {
    contractId: mongoose.Types.ObjectId;
    contractNumber: string;
    contractTitle: string;
    invoiceDate: Date;
    dueDate: Date;
    invoicedBy: string;
    status: "pending" | "paid" | "overdue";
    createdAt: Date;
    updatedAt: Date;
}

const invoiceSchema = new Schema<InvoiceDocument>(
    {
        contractId: { type: Schema.Types.ObjectId, ref: "Contract", required: true },
        contractNumber: { type: String, required: true },
        contractTitle: { type: String, required: true },
        invoiceDate: { type: Date, required: true },
        dueDate: { type: Date, required: true },
        invoicedBy: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "paid", "overdue"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export const Invoice: Model<InvoiceDocument> =
    mongoose.models.Invoice || mongoose.model<InvoiceDocument>("Invoice", invoiceSchema);
