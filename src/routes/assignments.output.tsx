import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, TopBar } from "@/components/AppShell";
import { api, GeneratedPaper, Section } from "@/lib/api";

export const Route = createFileRoute("/assignments/output")({
  head: () => ({ meta: [{ title: "Assignment Output — VedaAI" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    assignmentId: (search.assignmentId as string) ?? "",
  }),
  component: AssignmentOutputPage,
});

const DIFFICULTY_STYLE: Record<string, string> = {
  easy: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200",
  hard: "bg-red-50 text-red-700 border border-red-200",
};

function AssignmentOutputPage() {
  const { assignmentId } = Route.useSearch();
  const [paper, setPaper] = useState<GeneratedPaper | null>(null);
  const [loading, setLoading] = useState(!!assignmentId);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!assignmentId) return;
    setLoading(true);
    api
      .getPaper(assignmentId)
      .then((res) => setPaper(res.paper))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load paper")
      )
      .finally(() => setLoading(false));
  }, [assignmentId]);

  return (
    <Shell>
      <TopBar title="Assignment" backTo="/assignments" />

      <div className="bg-[#5E5E5E] p-3 lg:p-6 rounded-[32px] flex flex-col gap-4 lg:gap-6">
        {/* Intro bar */}
        <div className="flex py-6 px-4 lg:px-8 flex-col justify-center items-start lg:items-center gap-3 lg:gap-6 rounded-[32px] bg-[#303030] lg:bg-[rgba(24,24,24,0.80)] shadow-[0_16px_48px_0_rgba(0,0,0,0.12),0_32px_48px_0_rgba(0,0,0,0.20)] lg:shadow-none w-full">
          <div className="flex flex-col items-start gap-4 w-full">
            <div className="flex flex-col items-start gap-3 lg:gap-6 w-full">
              <p className="text-[#F0F0F0] lg:text-[#FFF] font-bricolageGrotesque text-sm lg:text-xl font-bold w-full tracking-[-0.04em] leading-[1.4em]">
                {loading
                  ? "Generating your question paper..."
                  : error
                    ? error
                    : "Your AI-generated question paper is ready!"}
              </p>
            </div>

            {/* Desktop Download Button */}
            {paper && (
              <div className="hidden lg:flex justify-center items-start gap-4 w-fit">
                <a
                  href={api.getPdfUrl(assignmentId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex py-0 px-6 justify-center items-center gap-6 rounded-[100px] bg-[#FFF] hover:bg-[#f3f4f6] transition-all w-fit h-11 border-none cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 w-fit">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 overflow-hidden relative">
                      <path fillRule="evenodd" clipRule="evenodd" d="M13.224 5.05526C13.0206 5.00643 12.7929 5 12.0116 5H9.7998C8.94322 5 8.36092 5.00078 7.91083 5.03755C7.47242 5.07337 7.24821 5.1383 7.09181 5.21799C6.71549 5.40974 6.40953 5.7157 6.21778 6.09202C6.13809 6.24842 6.07317 6.47262 6.03735 6.91104C6.00057 7.36113 5.9998 7.94342 5.9998 8.8V12H3.9998L3.99979 8.7587C3.99978 7.95373 3.99977 7.28937 4.04399 6.74818C4.08991 6.18608 4.18848 5.66938 4.43577 5.18404C4.81926 4.43139 5.43118 3.81947 6.18383 3.43598C6.66917 3.18869 7.18587 3.09012 7.74797 3.0442C8.28916 2.99998 8.95353 2.99999 9.7585 3L12.0116 3C12.046 3 12.0799 2.99999 12.1135 2.99997C12.7484 2.99967 13.2282 2.99944 13.6909 3.11052C14.0991 3.20851 14.4893 3.37013 14.8471 3.58944C15.2529 3.83807 15.592 4.17749 16.0408 4.62672C16.0645 4.65043 16.0885 4.67445 16.1128 4.69878L18.301 6.88701C18.3253 6.91134 18.3494 6.93534 18.3731 6.95903C18.8223 7.40782 19.1617 7.74693 19.4104 8.15265C19.6297 8.51054 19.7913 8.90072 19.8893 9.30886C20.0004 9.77155 20.0001 10.2513 19.9998 10.8863C19.9998 10.9199 19.9998 10.9538 19.9998 10.9882V15.2413C19.9998 16.0463 19.9998 16.7106 19.9556 17.2518C19.9097 17.8139 19.8111 18.3306 19.5638 18.816C19.1803 19.5686 18.5684 20.1805 17.8158 20.564C17.3304 20.8113 16.8137 20.9099 16.2516 20.9558C15.7104 21 15.0461 21 14.2411 21H12.9998V19H14.1998C15.0564 19 15.6387 18.9992 16.0888 18.9625C16.5272 18.9266 16.7514 18.8617 16.9078 18.782C17.2841 18.5903 17.5901 18.2843 17.7818 17.908C17.8615 17.7516 17.9264 17.5274 17.9622 17.089C17.999 16.6389 17.9998 16.0566 17.9998 15.2V10.9882C17.9998 10.2069 17.9934 9.97916 17.9445 9.77575C17.8955 9.57168 17.8147 9.37659 17.7051 9.19765C17.5958 9.01929 17.4393 8.85373 16.8868 8.30122L14.6986 6.113C14.1461 5.56048 13.9805 5.40402 13.8022 5.29472C13.6232 5.18506 13.4281 5.10426 13.224 5.05526Z" fill="#303030"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M5.52545 16.5257L6.43059 13.8103H7.56901L8.47414 16.5257L11.1895 17.4308V18.5692L8.47414 19.4743L7.56901 22.1897H6.43059L5.52545 19.4743L2.81006 18.5692V17.4308L5.52545 16.5257Z" fill="#303030"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M13.9998 5V9H17.9998V11H12.9998C12.4475 11 11.9998 10.5523 11.9998 10V5H13.9998Z" fill="#303030"/>
                    </svg>
                    <span className="text-[#303030] font-bricolageGrotesque text-base font-medium leading-[22px] w-fit tracking-[-0.04em]">Download as PDF</span>
                  </div>
                </a>
              </div>
            )}

            {/* Mobile Download Button */}
            {paper && (
              <div className="lg:hidden flex items-start gap-2 w-fit">
                <a
                  href={api.getPdfUrl(assignmentId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center gap-2.5 rounded-[100px] bg-[rgba(246,246,246,0.10)] active:bg-[rgba(246,246,246,0.20)] transition-all w-9 h-9 cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 w-5 h-5 overflow-hidden relative">
                    <path d="M9.99967 13.3333L5.83301 9.16668L6.99967 7.95834L9.16634 10.125V3.33334H10.833V10.125L12.9997 7.95834L14.1663 9.16668L9.99967 13.3333ZM4.99967 16.6667C4.54134 16.6667 4.14898 16.5035 3.82259 16.1771C3.4962 15.8507 3.33301 15.4583 3.33301 15V12.5H4.99967V15H14.9997V12.5H16.6663V15C16.6663 15.4583 16.5031 15.8507 16.1768 16.1771C15.8504 16.5035 15.458 16.6667 14.9997 16.6667H4.99967Z" fill="white"/>
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Paper */}
        <div className="bg-white rounded-2xl p-4 lg:p-10 shadow-sm">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#303030] border-t-transparent animate-spin" />
              <p className="text-[14px] text-[#6b7280] font-bricolageGrotesque">
                Generating your question paper with AI...
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <p className="text-[15px] font-semibold text-red-500">{error}</p>
              <p className="text-[13px] text-[#6b7280]">Please try generating again.</p>
            </div>
          )}

          {!paper && !loading && !error && (
            <div className="text-center py-16">
              <p className="text-[14px] text-[#6b7280]">No assignment ID provided.</p>
            </div>
          )}

          {paper && !loading && (
            <>
              {/* Paper Header */}
              <div className="text-center pb-5 border-b border-gray-200">
                <h2 className="text-[22px] lg:text-[28px] font-extrabold text-[#1a1a1a] tracking-tight">
                  Question Paper
                </h2>
                <div className="mt-3 flex flex-wrap justify-center gap-3 lg:gap-5">
                  <span className="inline-flex items-center gap-1.5 text-[14px] text-[#374151] bg-gray-50 px-3 py-1 rounded-full">
                    <span className="font-bold text-[#1a1a1a]">Total Questions:</span>
                    {paper.metadata.totalQuestions}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[14px] text-[#374151] bg-gray-50 px-3 py-1 rounded-full">
                    <span className="font-bold text-[#1a1a1a]">Total Marks:</span>
                    {paper.metadata.totalMarks}
                  </span>
                </div>
              </div>

              {/* Student Info */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[14px] text-[#1a1a1a]">
                <div className="sm:col-span-2 flex items-baseline gap-2">
                  <span className="font-semibold shrink-0">Name:</span>
                  <span className="flex-1 border-b border-dashed border-gray-300 min-h-[1.2em]"></span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold shrink-0">Roll Number:</span>
                  <span className="flex-1 border-b border-dashed border-gray-300 min-h-[1.2em]"></span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold shrink-0">Class / Section:</span>
                  <span className="flex-1 border-b border-dashed border-gray-300 min-h-[1.2em]"></span>
                </div>
              </div>

              {/* Sections */}
              {paper.sections.map((section: Section, sIdx: number) => (
                <div key={sIdx} className="mt-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <h3 className="text-[18px] lg:text-[20px] font-bold text-[#1a1a1a] shrink-0">
                      {section.title}
                    </h3>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                  <p className="text-[13px] italic text-[#6b7280] text-center">
                    {section.instruction}
                  </p>

                  <ol className="mt-5 space-y-5 list-decimal pl-6 text-[14px] text-[#1a1a1a]">
                    {section.questions.map((q, qIdx) => (
                      <li key={qIdx} className="leading-relaxed">
                        <div className="flex items-start justify-between gap-4">
                          <span className="flex-1">{q.question}</span>
                          <span className="font-bold shrink-0 text-[13px] text-[#374151] bg-gray-100 px-2 py-0.5 rounded-md">
                            {q.marks} mark{q.marks > 1 ? "s" : ""}
                          </span>
                        </div>
                        <span
                          className={`text-[11px] font-semibold mt-1 inline-block px-2.5 py-0.5 rounded-full ${DIFFICULTY_STYLE[q.difficulty] ?? "bg-gray-50 text-gray-400"}`}
                        >
                          {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}

              <div className="mt-10 pt-4 border-t border-gray-200 text-center">
                <p className="text-[13px] font-medium text-[#9ca3af] italic">
                  — End of Question Paper —
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}
