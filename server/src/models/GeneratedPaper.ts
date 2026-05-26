import mongoose, { Schema, Document, Types } from "mongoose";

export interface IQuestion {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IPaperMetadata {
  totalQuestions: number;
  totalMarks: number;
  generatedAt: Date;
}

export interface IGeneratedPaper extends Document {
  _id: Types.ObjectId;
  assignmentId: Types.ObjectId;
  sections: ISection[];
  metadata: IPaperMetadata;
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    question: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    marks: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const SectionSchema = new Schema<ISection>(
  {
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
  },
  { _id: false }
);

const PaperMetadataSchema = new Schema<IPaperMetadata>(
  {
    totalQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    generatedAt: { type: Date, default: () => new Date() },
  },
  { _id: false }
);

const GeneratedPaperSchema = new Schema<IGeneratedPaper>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true, index: true },
    sections: { type: [SectionSchema], required: true },
    metadata: { type: PaperMetadataSchema, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const GeneratedPaper = mongoose.model<IGeneratedPaper>(
  "GeneratedPaper",
  GeneratedPaperSchema
);
