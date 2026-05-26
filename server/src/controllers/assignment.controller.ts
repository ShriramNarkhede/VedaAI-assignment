import { Request, Response, NextFunction } from "express";
import { CreateAssignmentSchema } from "../validators/assignment.validator.js";
import {
  createAssignment,
  getAssignment,
  getPaper,
} from "../services/assignment.service.js";
import { generatePDF } from "../services/pdf.service.js";
import { Assignment } from "../models/Assignment.js";
import { GeneratedPaper } from "../models/GeneratedPaper.js";
import { Types } from "mongoose";

// ─── DELETE /api/assignments/:id ──────────────────────────────────────────────
export async function deleteAssignmentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: "Invalid assignment ID" });
      return;
    }
    const deleted = await Assignment.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: "Assignment not found" });
      return;
    }
    // Also remove the generated paper if any
    await GeneratedPaper.deleteMany({ assignmentId: id });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/assignments ─────────────────────────────────────────────────────
export async function getAllAssignmentsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, assignments });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/assignments ────────────────────────────────────────────────────
export async function createAssignmentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = CreateAssignmentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({
        success: false,
        error: "Validation failed",
        details: parsed.error.flatten(),
      });
      return;
    }

    const { assignmentId, jobId } = await createAssignment(parsed.data);
    res.status(201).json({ success: true, assignmentId, jobId });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/assignments/:id ─────────────────────────────────────────────────
export async function getAssignmentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: "Invalid assignment ID" });
      return;
    }

    const assignment = await getAssignment(id);
    if (!assignment) {
      res.status(404).json({ success: false, error: "Assignment not found" });
      return;
    }

    res.json({ success: true, assignment });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/assignments/:id/paper ──────────────────────────────────────────
export async function getPaperHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: "Invalid assignment ID" });
      return;
    }

    const assignment = await Assignment.findById(id).lean();
    if (!assignment) {
      res.status(404).json({ success: false, error: "Assignment not found" });
      return;
    }

    if (assignment.status !== "completed") {
      res.status(409).json({
        success: false,
        error: "Paper not yet generated",
        status: assignment.status,
      });
      return;
    }

    const paper = await getPaper(id);
    if (!paper) {
      res.status(404).json({ success: false, error: "Generated paper not found" });
      return;
    }

    res.json({ success: true, paper });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/assignments/:id/pdf ─────────────────────────────────────────────
export async function downloadPDFHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: "Invalid assignment ID" });
      return;
    }

    const assignment = await Assignment.findById(id).lean();
    if (!assignment || assignment.status !== "completed") {
      res.status(404).json({ success: false, error: "Paper not ready" });
      return;
    }

    const paper = await GeneratedPaper.findOne({ assignmentId: id }).lean();
    if (!paper) {
      res.status(404).json({ success: false, error: "Paper not found" });
      return;
    }

    const pdfBytes = await generatePDF(paper as any, assignment as any);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="question-paper-${id}.pdf"`
    );
    res.setHeader("Content-Length", pdfBytes.length);
    res.end(Buffer.from(pdfBytes));
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/assignments/:id/status ─────────────────────────────────────────
export async function getStatusHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id, "status jobId errorMessage").lean();
    if (!assignment) {
      res.status(404).json({ success: false, error: "Assignment not found" });
      return;
    }
    res.json({ success: true, status: assignment.status, jobId: assignment.jobId });
  } catch (err) {
    next(err);
  }
}
