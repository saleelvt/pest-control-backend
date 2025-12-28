import { Router } from "express";
import {
  createContract,
  listContracts,
  getContractById,
  updateContract,
  deleteContract,
  addJobToContract,
  getJobById,
  updateJob,
  deleteJob,
  getDashboardStats,
} from "../controllers/contract.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { protectRoute } from "../middlewares/auth";

const router = Router();

router.post(
  "/",
  protectRoute,
  asyncHandler(createContract)
);

router.get(
  "/",
  protectRoute,
  asyncHandler(listContracts)
);

router.get(
  "/stats",
  protectRoute,
  asyncHandler(getDashboardStats)
);

router.get(
  "/:id",
  protectRoute,
  asyncHandler(getContractById)
);

router.patch(
  "/:id",
  protectRoute,
  asyncHandler(updateContract)
);

router.delete(
  "/:id",
  protectRoute,
  asyncHandler(deleteContract)
);

router.post("/:id/jobs", protectRoute, asyncHandler(addJobToContract));

router.get("/:id/jobs/:jobId", protectRoute, asyncHandler(getJobById));

router.patch("/:id/jobs/:jobId", protectRoute, asyncHandler(updateJob));
router.delete("/:id/jobs/:jobId", protectRoute, asyncHandler(deleteJob));

export { router as contractRouter };
