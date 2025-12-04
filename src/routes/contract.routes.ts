import { Router } from "express";
import { validateRequest } from "../middlewares/validation";
import {
  createContractSchema,
  updateContractSchema,
  deleteContractSchema,
  getContractByIdSchema,
  listContractsSchema,
} from "../validations/contract.validation";
import {
  createContract,
  listContracts,
  getContractById,
  updateContract,
  deleteContract,
} from "../controllers/contract.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { protectRoute } from "../middlewares/auth";

const router = Router();

router.post(
  "/",
  protectRoute,
  validateRequest(createContractSchema),
  asyncHandler(createContract)
);

router.get(
  "/",
  protectRoute,
  validateRequest(listContractsSchema),
  asyncHandler(listContracts)
);

router.get(
  "/:id",
  protectRoute,
  validateRequest(getContractByIdSchema),
  asyncHandler(getContractById)
);

router.patch(
  "/:id",
  protectRoute,
  validateRequest(updateContractSchema),
  asyncHandler(updateContract)
);

router.delete(
  "/:id",
  protectRoute,
  validateRequest(deleteContractSchema),
  asyncHandler(deleteContract)
);

export { router as contractRouter };
