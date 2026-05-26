import { Router } from "express";
import {
  createAssignmentHandler,
  getAllAssignmentsHandler,
  getAssignmentHandler,
  deleteAssignmentHandler,
  getPaperHandler,
  downloadPDFHandler,
  getStatusHandler,
} from "../controllers/assignment.controller.js";

const router = Router();

router.get("/", getAllAssignmentsHandler);
router.post("/", createAssignmentHandler);
router.get("/:id", getAssignmentHandler);
router.delete("/:id", deleteAssignmentHandler);
router.get("/:id/status", getStatusHandler);
router.get("/:id/paper", getPaperHandler);
router.get("/:id/pdf", downloadPDFHandler);

export { router as assignmentRouter };
