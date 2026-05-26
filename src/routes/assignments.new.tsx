import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { UploadCloud, Minus, Plus, ChevronDown, ArrowRight, ArrowLeft, Mic, X } from "lucide-react";
import { Shell, TopBar } from "@/components/AppShell";
import { api } from "@/lib/api";
import { subscribeToJob } from "@/lib/socket";

export const Route = createFileRoute("/assignments/new")({
  head: () => ({ meta: [{ title: "Create Assignment — VedaAI" }] }),
  component: CreateAssignmentPage,
});

type Row = { type: string; count: number; marks: number };

const initialRows: Row[] = [
  { type: "Multiple Choice Questions", count: 4, marks: 1 },
  { type: "Short Questions", count: 3, marks: 2 },
  { type: "Diagram/Graph-Based Questions", count: 5, marks: 5 },
  { type: "Numerical Problems", count: 5, marks: 5 },
];

function MobileStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="w-full max-w-[130px] h-10 px-3 bg-white rounded-[100px] border border-zinc-200/50 flex justify-between items-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="text-[#303030] hover:opacity-70 transition-all shrink-0 flex items-center justify-center"
      >
        <Minus className="w-3 h-3" strokeWidth={2.5} />
      </button>
      <span className="text-base font-bold font-bricolageGrotesque text-[#303030] select-none">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="text-[#303030] hover:opacity-70 transition-all shrink-0 flex items-center justify-center"
      >
        <Plus className="w-3 h-3" strokeWidth={2.5} />
      </button>
    </div>
  );
}

function MobileQuestionTypeCard({
  row,
  index,
  update,
  remove
}: {
  row: Row;
  index: number;
  update: (i: number, patch: Partial<Row>) => void;
  remove: (i: number) => void;
}) {
  return (
    <div className="w-full bg-white rounded-3xl p-4 flex flex-col gap-4 border border-[rgba(0,0,0,0.05)] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      {/* Top row: Select and Delete */}
      <div className="flex justify-between items-center w-full gap-3">
        <div className="relative flex-1 h-11 px-4 py-2.5 bg-transparent flex justify-between items-center">
          <select
            value={row.type}
            onChange={(e) => update(index, { type: e.target.value })}
            className="w-full appearance-none bg-transparent text-[#303030] text-base font-bold font-bricolageGrotesque outline-none pr-8 cursor-pointer"
          >
            <option>Multiple Choice Questions</option>
            <option>Short Questions</option>
            <option>Long Questions</option>
            <option>Diagram/Graph-Based Questions</option>
            <option>Numerical Problems</option>
          </select>
          <ChevronDown className="w-5 h-5 text-[#303030] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <button
          onClick={() => remove(index)}
          className="text-[#303030] hover:opacity-70 transition-opacity w-6 h-6 flex items-center justify-center shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Gray box with two steppers */}
      <div className="bg-[#F6F6F6] rounded-2xl p-4 flex justify-between items-center gap-4 w-full">
        {/* Left Column: Questions */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <span className="text-[#303030] text-sm font-semibold font-bricolageGrotesque leading-[1.4em] tracking-[-0.04em]">
            No. of Questions
          </span>
          <MobileStepper value={row.count} onChange={(v) => update(index, { count: v })} />
        </div>

        {/* Right Column: Marks */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <span className="text-[#303030] text-sm font-semibold font-bricolageGrotesque leading-[1.4em] tracking-[-0.04em]">
            Marks
          </span>
          <MobileStepper value={row.marks} onChange={(v) => update(index, { marks: v })} />
        </div>
      </div>
    </div>
  );
}

function CreateAssignmentPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [dueDate, setDueDate] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const totalQ = rows.reduce((a, r) => a + r.count, 0);
  const totalM = rows.reduce((a, r) => a + r.count * r.marks, 0);

  const update = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const remove = (i: number) => setRows((rs) => rs.filter((_, idx) => idx !== i));
  const add = () =>
    setRows((rs) => [...rs, { type: "Multiple Choice Questions", count: 1, marks: 1 }]);

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");
    setStatusMsg("Submitting assignment...");
    try {
      const { assignmentId, jobId } = await api.createAssignment({
        questionTypes: rows.map((r) => ({ type: r.type, count: r.count, marks: r.marks })),
        dueDate: dueDate || undefined,
        additionalInfo: additionalInfo || undefined,
      });

      setStatusMsg("Queued — waiting for generation...");

      const cleanup = subscribeToJob(
        jobId,
        (e) => setStatusMsg(e.message ?? e.status),
        () => {
          cleanup();
          navigate({ to: "/assignments/output", search: { assignmentId } });
        },
        (e) => {
          cleanup();
          setSubmitting(false);
          setSubmitError(`Generation failed: ${e.error}`);
          setStatusMsg("");
        }
      );
      cleanupRef.current = cleanup;
    } catch (err: unknown) {
      setSubmitting(false);
      setStatusMsg("");
      setSubmitError(err instanceof Error ? err.message : "Submission failed");
    }
  }

  return (
    <Shell>
      <TopBar backTo="/assignments" />
      <div className="flex-1 flex flex-col w-full relative gap-6 lg:px-2 pb-48 lg:pb-8">
        {/* Header (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-3 px-2 mt-2">
          <span className="w-3 h-3 rounded-full bg-[#4BC26D] ring-4 ring-[#4BC26D]/40" />
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-bold tracking-[-0.04em] text-[#303030] leading-[1.4em]">
              Create Assignment
            </h1>
            <p className="text-sm tracking-[-0.04em] text-[rgba(94,94,94,0.55)] leading-[1.4em]">
              Set up a new assignment for your students
            </p>
          </div>
        </div>

        {/* progress */}
        <div className="flex gap-2 px-2 mt-1 w-full max-w-[810px] self-center">
          <div className="flex-1 h-1.5 rounded-full bg-[#303030]" />
          <div className="flex-1 h-1.5 rounded-full bg-[#e5e7eb]" />
        </div>

        <div className="w-full max-w-[810px] self-center p-6 lg:p-8 bg-white/50 backdrop-blur-md rounded-[32px] border border-white/60 flex flex-col justify-start items-start gap-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col justify-center items-start gap-0.5">
            <h2 className="text-[#303030] text-xl font-bold font-bricolageGrotesque leading-[1.4em] tracking-[-0.04em]">Assignment Details</h2>
            <p className="text-[rgba(94,94,94,0.55)] text-sm font-normal font-bricolageGrotesque leading-[1.4em] tracking-[-0.04em]">Basic information about your assignment</p>
          </div>

          <div className="self-stretch flex flex-col justify-start items-start gap-4 w-full">
            {/* Upload Zone */}
            <div className="self-stretch flex flex-col justify-start items-start gap-3 w-full">
              <div className="relative self-stretch px-8 py-6 bg-white rounded-3xl flex flex-col justify-center items-center gap-4">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    x="1"
                    y="1"
                    width="calc(100% - 2px)"
                    height="calc(100% - 2px)"
                    rx="24"
                    fill="none"
                    stroke="#d4d4d8"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                  />
                </svg>
                
                <div className="w-12 h-12 rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-zinc-100 flex items-center justify-center shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 16.5c-1.38 0-2.5-1.12-2.5-2.5 0-1.21.86-2.22 2.01-2.45A3.5 3.5 0 0 1 13 8c1.6 0 2.97 1.07 3.4 2.55 1.15.11 2.1.86 2.5 1.95A2.5 2.5 0 0 1 16.5 16.5m-4.5-5.5v7m0-7-2.5 2.5m2.5-2.5 2.5 2.5" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch text-center text-[#303030] text-base font-bold font-bricolageGrotesque leading-[1.4em] tracking-[-0.04em]">
                    {selectedFile ? selectedFile.name : "Choose a file or drag & drop it here"}
                  </div>
                  <div className="self-stretch text-center text-[rgba(94,94,94,0.55)] text-sm font-normal font-bricolageGrotesque leading-[1.4em] tracking-[-0.04em]">
                    {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "JPEG, PNG, upto 10MB"}
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg, image/png, application/pdf"
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-[#F6F6F6] hover:bg-neutral-100 transition-all rounded-[48px] text-[#303030] text-sm font-bold font-bricolageGrotesque leading-[1.4em] tracking-[-0.04em] cursor-pointer"
                >
                  {selectedFile ? "Change File" : "Browse Files"}
                </button>
              </div>
              <p className="self-stretch text-center text-[rgba(94,94,94,0.55)] text-[15px] font-medium font-bricolageGrotesque leading-[1.4em] tracking-[-0.04em]">
                Upload images of your preferred document/image
              </p>
            </div>

            {/* Due date */}
            <div className="self-stretch flex flex-col justify-start items-start gap-2 mt-2 w-full">
              <label className="self-stretch text-[#303030] text-base font-bold font-bricolageGrotesque leading-[1.4em] tracking-[-0.04em]">
                Due Date
              </label>
              <div className="self-stretch h-11 px-4 py-2.5 bg-[#f3f4f6] rounded-[100px] border border-zinc-200 flex justify-between items-center shadow-sm">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="DD-MM-YYYY"
                  className="bg-transparent outline-none text-[#303030] placeholder:text-neutral-400 text-base font-medium font-bricolageGrotesque leading-[1.4em] tracking-[-0.04em] flex-1"
                />
              </div>
            </div>

            {/* Question Type */}
            <div className="self-stretch flex flex-col justify-start items-start gap-4 mt-4 w-full">
              
              {/* DESKTOP VIEW */}
              <div className="hidden md:flex flex-col items-start gap-4 w-full">
                {/* Headers */}
                <div className="flex justify-between items-center w-full">
                  <p className="text-[#303030] font-bricolageGrotesque text-base font-bold leading-[1.4em] tracking-[-0.04em] w-[475px]">
                    Question Type
                  </p>
                  <div className="flex items-center gap-4">
                    <p className="text-[#303030] font-bricolageGrotesque text-base font-medium leading-[1.4em] w-[100px] text-center tracking-[-0.04em]">
                      No. of Questions
                    </p>
                    <p className="text-[#303030] font-bricolageGrotesque text-base font-medium leading-[1.4em] w-[100px] text-center tracking-[-0.04em]">
                      Marks
                    </p>
                  </div>
                </div>

                {/* Rows */}
                <div className="flex flex-col gap-4 w-full">
                  {rows.map((row, index) => (
                    <div key={index} className="flex justify-between items-center w-full">
                      {/* Left: Dropdown select + Delete */}
                      <div className="flex items-center gap-3 w-[475px] shrink-0">
                        <div className="flex py-[11px] px-4 justify-between items-center rounded-[100px] bg-[#FFF] w-[443px] h-11 relative border border-zinc-200/50 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                          <p className="text-[#303030] font-bricolageGrotesque text-base font-medium leading-[1.4em] w-fit tracking-[-0.04em]">
                            {row.type}
                          </p>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="shrink-0 w-4 h-4 overflow-hidden relative "
                          >
                            <path
                              d="M4 6L8 10L12 6"
                              stroke="#303030"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <select
                            value={row.type}
                            onChange={(e) => update(index, { type: e.target.value })}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          >
                            <option>Multiple Choice Questions</option>
                            <option>Short Questions</option>
                            <option>Long Questions</option>
                            <option>Diagram/Graph-Based Questions</option>
                            <option>Numerical Problems</option>
                          </select>
                        </div>
                        <button
                          onClick={() => remove(index)}
                          className="hover:opacity-75 transition-opacity shrink-0 flex items-center justify-center cursor-pointer"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 overflow-hidden relative "
                          >
                            <path
                              d="M12 4L4 12M4 4L12 12"
                              stroke="#303030"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Right: Steppers */}
                      <div className="flex items-center gap-4">
                        {/* No. of Questions Stepper */}
                        <div className="flex py-[11px] px-2 justify-between items-center rounded-[100px] bg-[#FFF] w-[100px] h-11 border border-zinc-200/50 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                          <button
                            onClick={() => update(index, { count: Math.max(0, row.count - 1) })}
                            className="hover:opacity-75 transition-opacity shrink-0 flex items-center justify-center cursor-pointer"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="shrink-0 w-4 h-4 relative "
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M13.3333 8.66665L2.66667 8.66665C2.29848 8.66665 2 8.36817 2 7.99998C2 7.63179 2.29848 7.33331 2.66667 7.33331L13.3333 7.33331C13.7015 7.33331 14 7.63179 14 7.99998C14 8.36817 13.7015 8.66665 13.3333 8.66665Z"
                                fill={row.count <= 0 ? "#DADADA" : "#303030"}
                              />
                            </svg>
                          </button>
                          <p className="text-[#303030] font-bricolageGrotesque text-base font-medium leading-[1.4em] w-fit tracking-[-0.04em] select-none">
                            {row.count}
                          </p>
                          <button
                            onClick={() => update(index, { count: row.count + 1 })}
                            className="hover:opacity-75 transition-opacity shrink-0 flex items-center justify-center cursor-pointer"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="shrink-0 w-4 h-4 overflow-hidden relative "
                            >
                              <path
                                d="M8.00016 3.33331V12.6666M3.3335 7.99998H12.6668"
                                stroke="#303030"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Marks Stepper */}
                        <div className="flex py-[11px] px-2 justify-between items-center rounded-[100px] bg-[#FFF] w-[100px] h-11 border border-zinc-200/50 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                          <button
                            onClick={() => update(index, { marks: Math.max(0, row.marks - 1) })}
                            className="hover:opacity-75 transition-opacity shrink-0 flex items-center justify-center cursor-pointer"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="shrink-0 w-4 h-4 relative "
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M13.3333 8.66665L2.66667 8.66665C2.29848 8.66665 2 8.36817 2 7.99998C2 7.63179 2.29848 7.33331 2.66667 7.33331L13.3333 7.33331C13.7015 7.33331 14 7.63179 14 7.99998C14 8.36817 13.7015 8.66665 13.3333 8.66665Z"
                                fill={row.marks <= 0 ? "#DADADA" : "#303030"}
                              />
                            </svg>
                          </button>
                          <p className="text-[#303030] font-bricolageGrotesque text-base font-medium leading-[1.4em] w-fit tracking-[-0.04em] select-none">
                            {row.marks}
                          </p>
                          <button
                            onClick={() => update(index, { marks: row.marks + 1 })}
                            className="hover:opacity-75 transition-opacity shrink-0 flex items-center justify-center cursor-pointer"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="shrink-0 w-4 h-4 overflow-hidden relative "
                            >
                              <path
                                d="M8.00016 3.33331V12.6666M3.3335 7.99998H12.6668"
                                stroke="#303030"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add button */}
                  <button
                    onClick={add}
                    className="flex items-center gap-2 w-fit hover:opacity-85 active:scale-95 transition-all cursor-pointer mt-2"
                  >
                    <div className="flex p-2 items-center gap-1 rounded-[48px] bg-[#2B2B2B] w-fit">
                      <div className="w-5 h-5 relative">
                        <div className="w-[15px] h-[15px] absolute left-[3px] top-[3px]">
                          <svg
                            width="15"
                            height="2"
                            viewBox="0 0 15 2"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-[15px] h-0.5 absolute left-0 top-[7px] "
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0 0.833333C0 0.373096 0.373096 0 0.833333 0H14.1667C14.6269 0 15 0.373096 15 0.833333C15 1.29357 14.6269 1.66667 14.1667 1.66667H0.833333C0.373096 1.66667 0 1.29357 0 0.833333Z"
                              fill="white"
                            />
                          </svg>
                          <svg
                            width="2"
                            height="15"
                            viewBox="0 0 2 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-[15px] h-0.5 absolute left-2 top-0 "
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.833171 -3.64262e-08C1.29341 -1.63085e-08 1.6665 0.373096 1.6665 0.833333L1.6665 14.1667C1.6665 14.6269 1.29341 15 0.83317 15C0.372933 15 -0.00016336 14.6269 -0.00016334 14.1667L-0.000162757 0.833333C-0.000162737 0.373096 0.372933 -5.65438e-08 0.833171 -3.64262e-08Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p className="text-[#303030] font-bricolageGrotesque text-sm font-bold leading-[1.4em] w-fit tracking-[-0.04em]">
                      Add Question Type
                    </p>
                  </button>
                </div>
              </div>

              {/* MOBILE VIEW */}
              <div className="md:hidden self-stretch flex flex-col justify-start items-start gap-4 w-full">
                <label className="self-stretch text-[#303030] text-base font-bold font-bricolageGrotesque leading-[1.4em] tracking-[-0.04em]">
                  Question Type
                </label>
                <div className="flex flex-col gap-4 w-full">
                  {rows.map((row, index) => (
                    <MobileQuestionTypeCard
                      key={index}
                      row={row}
                      index={index}
                      update={update}
                      remove={remove}
                    />
                  ))}
                </div>
                {/* Add button for mobile */}
                <button
                  onClick={add}
                  className="self-start inline-flex items-center gap-3 mt-2 hover:opacity-85 active:scale-95 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 bg-[#181818] rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-[#303030] text-base font-bold font-bricolageGrotesque leading-[1.4em] tracking-[-0.04em]">
                    Add Question Type
                  </span>
                </button>
              </div>

              {/* Totals */}
              <div className="w-full flex flex-col justify-end items-end gap-1.5 mt-4 pr-1.5">
                <div className="text-[#303030] text-[15px] font-medium font-bricolageGrotesque leading-[1.4em] tracking-[-0.04em]">
                  Total Questions : <span className="font-bold">{totalQ}</span>
                </div>
                <div className="text-[#303030] text-[15px] font-medium font-bricolageGrotesque leading-[1.4em] tracking-[-0.04em]">
                  Total Marks : <span className="font-bold">{totalM}</span>
                </div>
              </div>
            </div>

            {/* Additional info */}
            <div className="hidden lg:flex self-stretch flex flex-col justify-start items-start gap-2 mt-6 w-full">
              <label className="text-[#303030] text-base font-bold font-bricolageGrotesque leading-[1.4em] tracking-[-0.04em]">
                Additional Information (For better output)
              </label>
              <div className="relative self-stretch h-24 p-4 bg-white/50 rounded-2xl flex flex-col justify-between items-end shadow-sm">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    x="1"
                    y="1"
                    width="calc(100% - 2px)"
                    height="calc(100% - 2px)"
                    rx="16"
                    fill="none"
                    stroke="#d4d4d8"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                  />
                </svg>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="e.g Generate a question paper for 3 hour exam duration..."
                  rows={3}
                  className="w-full bg-transparent outline-none text-sm text-[#303030] placeholder:text-zinc-400 font-medium font-bricolageGrotesque resize-none relative z-10"
                />
                <div className="relative z-10 w-[36px] h-[36px] shrink-0 bg-[#F0F0F0] hover:bg-[#e4e4e7] transition-all rounded-[18px] flex items-center justify-center shadow-sm cursor-pointer">
                  <div className="shrink-0 w-4 h-4 relative">
                    <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[11px] h-3.5 absolute left-[2.5px] top-[1px]">
                      <path fillRule="evenodd" clipRule="evenodd" d="M2.04545 2.72727C2.04545 1.22104 3.2665 0 4.77273 0H6.13636C7.64259 0 8.86364 1.22104 8.86364 2.72727V6.81818C8.86364 8.32441 7.64259 9.54545 6.13636 9.54545H4.77273C3.2665 9.54545 2.04545 8.32441 2.04545 6.81818V2.72727ZM0.681818 5.45455C1.05838 5.45455 1.36364 5.75981 1.36364 6.13636V6.81818C1.36364 8.70097 2.88994 10.2273 4.77273 10.2273H5.45455H6.13636C8.01915 10.2273 9.54545 8.70097 9.54545 6.81818V6.13636C9.54545 5.75981 9.85071 5.45455 10.2273 5.45455C10.6038 5.45455 10.9091 5.75981 10.9091 6.13636V6.81818C10.9091 9.45409 8.77227 11.5909 6.13636 11.5909V12.9545C6.13636 13.3311 5.8311 13.6364 5.45455 13.6364C5.07799 13.6364 4.77273 13.3311 4.77273 12.9545L4.77273 11.5909C2.13682 11.5909 0 9.45409 0 6.81818V6.13636C0 5.75981 0.30526 5.45455 0.681818 5.45455Z" fill="#303030"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex flex-col items-center gap-3 w-full max-w-[810px] self-center px-6 lg:px-2
          fixed bottom-[108px] left-0 right-0 z-20 pointer-events-none
          lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:z-0 lg:pointer-events-auto">
          {submitError && (
            <p className="text-sm text-red-500 font-medium font-bricolageGrotesque w-full text-center pointer-events-auto">
              {submitError}
            </p>
          )}
          {statusMsg && (
            <p className="text-sm text-[#303030]/70 font-medium font-bricolageGrotesque w-full text-center pointer-events-auto animate-pulse">
              {statusMsg}
            </p>
          )}
          <div className="flex items-center justify-between w-full pointer-events-auto">
            <Link
              to="/assignments"
              className="inline-flex items-center gap-2 bg-white border border-[#e5e7eb] rounded-full px-6 py-3 text-[15px] font-bold font-bricolageGrotesque text-[#181818] shadow-md lg:shadow-none hover:bg-neutral-50 active:scale-95 transition-all pointer-events-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Link>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-[#181818] text-white rounded-full px-7 py-3 text-[15px] font-bold font-bricolageGrotesque shadow-md lg:shadow-none hover:opacity-90 active:scale-95 transition-all pointer-events-auto cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Generating..." : "Generate"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
