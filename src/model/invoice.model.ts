import mongoose, { Schema, Document, Model } from "mongoose";

export interface InvoiceItem {
    description: string;
    units: number;
    rate: number;
    subtotal: number;
}

export interface InvoiceDocument extends Document {
    contractId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    contractNumber: string;

    scheduledDate: Date;
    collectionDate: Date;

    items: InvoiceItem[];
    grandTotal: number;

    createdAt: Date;
    updatedAt: Date;
}

const invoiceItemSchema = new Schema<InvoiceItem>(
    {
        description: { type: String, required: true },
        units: { type: Number, required: true, min: 0 },
        rate: { type: Number, required: true, min: 0 },
        subtotal: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const invoiceSchema = new Schema<InvoiceDocument>(
    {
        contractId: { type: Schema.Types.ObjectId, ref: "Contract", required: true },
        jobId: { type: Schema.Types.ObjectId, required: true },
        contractNumber: { type: String },

        scheduledDate: { type: Date, required: true },
        collectionDate: { type: Date, required: true },

        items: { type: [invoiceItemSchema], required: true },
        grandTotal: { type: Number, required: true },
    },
    { timestamps: true }
);

invoiceSchema.index({ contractId: 1, jobId: 1, scheduledDate: 1 });

export const Invoice: Model<InvoiceDocument> =
    mongoose.models.Invoice || mongoose.model<InvoiceDocument>("Invoice", invoiceSchema);
