import { z } from "zod";

const addressSchema = z.object({
  street1: z.string().min(1),
  street2: z.string().min(1),
  city: z.string().min(1),
  poBox: z.string().min(1),
  emirate: z.string().min(1),
  country: z.string().min(1)
});

export const createContractSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    aliasName: z.string().min(1),
    trnNumber: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    mobile: z.string().min(1),

    address: addressSchema,

    referredByEmployee: z.string().min(1),
    quoteValidityDays: z.coerce.number().min(1),
    creditLimit: z.coerce.number().min(0),

    priority: z.enum(["low", "medium", "high", "urgent"]),
    paymentTerms: z.enum(["15", "30", "45", "60", "90"]),

    remarks: z.string().min(1)
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const updateContractSchema = z.object({
  body: createContractSchema.shape.body.partial(),
  params: z.object({
    id: z.string().min(1)
  })
});

export const getContractByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});

export const deleteContractSchema = getContractByIdSchema;

export const listContractsSchema = z.object({
  query: z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    search: z.string().optional()
  })
});
