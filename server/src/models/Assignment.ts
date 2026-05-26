import mongoose, { Schema, Document, Types } from "mongoose";

export type AssignmentStatus =
  | "pending"
  | "queued"
  | "processing"
  | "generating"
  | "completed"
  | "failed";

export interface IQuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface IAssignment extends Document {
  _id: Types.ObjectId;
  dueDate?: Date;
  additionalInfo?: string;
  questionTypes: IQuestionType[];
  totalQuestions: number;
  totalMarks: number;
  status: AssignmentStatus;
  jobId?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionTypeSchema = new Schema<IQuestionType>(
  {
    type: { type: String, required: true, trim: true },
    count: { type: Number, required: true, min: 0 },
    marks: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    dueDate: { type: Date },
    additionalInfo: { type: String, trim: true, maxlength: 1000 },
    questionTypes: {
      type: [QuestionTypeSchema],
      required: true,
      validate: {
        validator: (v: IQuestionType[]) => v.length > 0,
        message: "At least one question type is required",
      },
    },
    totalQuestions: { type: Number, required: true, min: 1 },
    totalMarks: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["pending", "queued", "processing", "generating", "completed", "failed"],
      default: "pending",
    },
    jobId: { type: String },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

AssignmentSchema.index({ status: 1, createdAt: -1 });

export const Assignment = mongoose.model<IAssignment>("Assignment", AssignmentSchema);
