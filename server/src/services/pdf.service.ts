import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";
import { IGeneratedPaper } from "../models/GeneratedPaper.js";
import { IAssignment } from "../models/Assignment.js";

const DIFFICULTY_COLOR: Record<string, [number, number, number]> = {
  easy: [0.18, 0.7, 0.42],
  medium: [0.95, 0.6, 0.0],
  hard: [0.85, 0.2, 0.2],
};

const PAGE_MARGIN = 50;
const LINE_HEIGHT = 16;
const SECTION_FONT_SIZE = 13;
const BODY_FONT_SIZE = 11;
const SMALL_FONT_SIZE = 9;

function ensurePage(
  doc: PDFDocument,
  pages: PDFPage[],
  y: number,
  minY = 80
): { page: PDFPage; y: number } {
  if (y < minY) {
    const page = doc.addPage([595, 842]); // A4
    pages.push(page);
    return { page, y: 842 - PAGE_MARGIN };
  }
  return { page: pages[pages.length - 1], y };
}

function wrapText(text: string, maxWidth: number, font: PDFFont, size: number): string[] {
  // Replace tabs with spaces and split by explicit newlines
  const rawLines = text.replace(/\t/g, "    ").split(/\r?\n/);
  const lines: string[] = [];

  for (const rawLine of rawLines) {
    const words = rawLine.split(/\s+/);
    let current = "";

    for (const word of words) {
      if (!word) continue;
      const test = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth) {
        if (current) lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) {
      lines.push(current);
    } else if (rawLine.trim() === "") {
      lines.push(""); // preserve intentional blank lines
    }
  }
  return lines;
}

export async function generatePDF(
  paper: IGeneratedPaper,
  assignment: IAssignment
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await doc.embedFont(StandardFonts.Helvetica);
  const oblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  const pages: PDFPage[] = [doc.addPage([595, 842])];
  let page = pages[0];
  let y = 842 - PAGE_MARGIN;
  const contentWidth = 595 - PAGE_MARGIN * 2;

  // ─── Header ───────────────────────────────────────────────────────────────
  page.drawText("VedaAI — Question Paper", {
    x: PAGE_MARGIN,
    y,
    size: 18,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= LINE_HEIGHT * 1.8;

  page.drawLine({
    start: { x: PAGE_MARGIN, y },
    end: { x: 595 - PAGE_MARGIN, y },
    thickness: 1.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  y -= LINE_HEIGHT;

  // Meta
  const metaItems = [
    `Total Questions: ${paper.metadata.totalQuestions}`,
    `Total Marks: ${paper.metadata.totalMarks}`,
    assignment.dueDate
      ? `Due: ${new Date(assignment.dueDate).toLocaleDateString()}`
      : null,
  ].filter(Boolean) as string[];

  page.drawText(metaItems.join("   |   "), {
    x: PAGE_MARGIN,
    y,
    size: SMALL_FONT_SIZE,
    font: regularFont,
    color: rgb(0.45, 0.45, 0.45),
  });
  y -= LINE_HEIGHT * 1.5;

  // Student info box
  ["Name: _______________________", "Class / Section: ___________   Roll No: ________"].forEach(
    (line) => {
      page.drawText(line, {
        x: PAGE_MARGIN,
        y,
        size: BODY_FONT_SIZE,
        font: regularFont,
        color: rgb(0.2, 0.2, 0.2),
      });
      y -= LINE_HEIGHT;
    }
  );
  y -= LINE_HEIGHT;

  page.drawLine({
    start: { x: PAGE_MARGIN, y },
    end: { x: 595 - PAGE_MARGIN, y },
    thickness: 0.5,
    color: rgb(0.85, 0.85, 0.85),
  });
  y -= LINE_HEIGHT;

  // ─── Sections ─────────────────────────────────────────────────────────────
  for (const section of paper.sections) {
    ({ page, y } = ensurePage(doc, pages, y - LINE_HEIGHT * 2));
    y -= LINE_HEIGHT;

    // Section title
    page.drawText(section.title.toUpperCase(), {
      x: PAGE_MARGIN,
      y,
      size: SECTION_FONT_SIZE,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= LINE_HEIGHT * 0.6;

    // Instruction
    page.drawText(section.instruction, {
      x: PAGE_MARGIN,
      y,
      size: SMALL_FONT_SIZE,
      font: oblique,
      color: rgb(0.45, 0.45, 0.45),
    });
    y -= LINE_HEIGHT * 1.5;

    // Questions
    section.questions.forEach((q, idx) => {
      const diffColor = DIFFICULTY_COLOR[q.difficulty] ?? [0.3, 0.3, 0.3];
      const questionNumber = `${idx + 1}.`;
      const marksText = `[${q.marks} mark${q.marks > 1 ? "s" : ""}]`;

      const wrappedLines = wrapText(
        q.question,
        contentWidth - 80,
        regularFont,
        BODY_FONT_SIZE
      );
      const neededHeight = wrappedLines.length * LINE_HEIGHT + LINE_HEIGHT * 1.2;
      ({ page, y } = ensurePage(doc, pages, y - neededHeight));

      // Question number
      page.drawText(questionNumber, {
        x: PAGE_MARGIN,
        y,
        size: BODY_FONT_SIZE,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      });

      // Question text (wrapped)
      wrappedLines.forEach((line, lineIdx) => {
        page.drawText(line, {
          x: PAGE_MARGIN + 22,
          y: y - lineIdx * LINE_HEIGHT,
          size: BODY_FONT_SIZE,
          font: regularFont,
          color: rgb(0.1, 0.1, 0.1),
        });
      });

      // Difficulty badge
      const lastLineY = y - (wrappedLines.length - 1) * LINE_HEIGHT;
      page.drawText(`[${q.difficulty}]`, {
        x: PAGE_MARGIN + 22,
        y: lastLineY - LINE_HEIGHT,
        size: SMALL_FONT_SIZE,
        font: oblique,
        color: rgb(...(diffColor as [number, number, number])),
      });

      // Marks (right-aligned)
      const marksWidth = regularFont.widthOfTextAtSize(marksText, BODY_FONT_SIZE);
      page.drawText(marksText, {
        x: 595 - PAGE_MARGIN - marksWidth,
        y,
        size: BODY_FONT_SIZE,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2),
      });

      y -= wrappedLines.length * LINE_HEIGHT + LINE_HEIGHT * 1.8;
    });

    y -= LINE_HEIGHT;
  }

  // Footer on each page
  pages.forEach((p, i) => {
    p.drawText(`Page ${i + 1} of ${pages.length}  |  Generated by VedaAI`, {
      x: PAGE_MARGIN,
      y: 30,
      size: 8,
      font: regularFont,
      color: rgb(0.6, 0.6, 0.6),
    });
  });

  return doc.save();
}
