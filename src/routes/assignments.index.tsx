import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Filter, Plus, MoreVertical } from "lucide-react";
import { Shell, TopBar } from "@/components/AppShell";
import { api, Assignment } from "@/lib/api";

export const Route = createFileRoute("/assignments/")({
  head: () => ({
    meta: [{ title: "Assignments — VedaAI" }],
  }),
  component: AssignmentsListPage,
});

function AssignmentsListPage() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api.getAssignments()
      .then(res => setAssignments(res.assignments))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredAssignments = assignments.filter((it) => {
    const query = searchQuery.toLowerCase();
    const mainTopic = it.questionTypes.length > 0 ? it.questionTypes[0].type : "General Assignment";
    const title = `${mainTopic} Quiz`.toLowerCase();
    const info = (it.additionalInfo ?? "").toLowerCase();
    return title.includes(query) || info.includes(query);
  });

  return (
    <Shell>
      <TopBar backTo="/" />
      <div className="flex-1 flex flex-col w-full relative gap-6 lg:px-2">
        {/* Header */}
        <div className="flex items-center gap-3 px-2 mt-2">
          <span className="w-3 h-3 rounded-full bg-[#4BC26D] ring-4 ring-[#4BC26D]/40" />
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-bold tracking-[-0.04em] text-[#303030] leading-[1.4em]">
              Assignments
            </h1>
            <p className="text-sm tracking-[-0.04em] text-[rgba(94,94,94,0.55)] leading-[1.4em]">
              Manage and create assignments for your classes.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex items-center justify-between rounded-2xl lg:rounded-[20px] bg-white h-16 px-4 shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <button className="flex items-center gap-1 text-[#A9A9A9] text-sm leading-[1.4em] tracking-[-0.04em] hover:text-gray-700 transition-colors px-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 relative shrink-0"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.5 4.82153C2.5 3.53938 3.53938 2.5 4.82153 2.5H15.1785C16.4606 2.5 17.5 3.53938 17.5 4.82153C17.5 5.49412 17.2594 6.14453 16.8217 6.6552L14.4599 9.41062C13.5537 10.4679 13.0556 11.8144 13.0556 13.2069V15C13.0556 16.3807 11.9363 17.5 10.5556 17.5H9.44444C8.06373 17.5 6.94444 16.3807 6.94444 15V13.2069C6.94444 11.8144 6.44632 10.4679 5.54011 9.41062L3.17832 6.6552C2.7406 6.14453 2.5 5.49412 2.5 4.82153ZM4.82153 4.16667C4.45986 4.16667 4.16667 4.45986 4.16667 4.82153C4.16667 5.09627 4.26495 5.36195 4.44375 5.57054L6.80554 8.32597C7.97067 9.68529 8.61111 11.4166 8.61111 13.2069V15C8.61111 15.4602 8.98421 15.8333 9.44444 15.8333H10.5556C11.0158 15.8333 11.3889 15.4602 11.3889 15V13.2069C11.3889 11.4166 12.0293 9.68529 13.1945 8.32597L15.5563 5.57054C15.7351 5.36195 15.8333 5.09627 15.8333 4.82153C15.8333 4.45986 15.5401 4.16667 15.1785 4.16667H4.82153Z"
                fill="#A9A9A9"
              />
            </svg>
            <span className="font-bricolageGrotesque">Filter</span>
          </button>
          
          <div className="flex items-center gap-2.5 rounded-[100px] border border-[rgba(0,0,0,0.20)] w-[228px] lg:w-full lg:max-w-[380px] h-11 px-4">
            <div className="w-5 h-5 relative shrink-0">
              <div className="w-[17px] h-[17px] absolute left-0.5 top-0.5">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[15px] h-[15px] absolute left-0 top-0"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.5 1.66667C4.27834 1.66667 1.66667 4.27834 1.66667 7.5C1.66667 10.7217 4.27834 13.3333 7.5 13.3333C10.7217 13.3333 13.3333 10.7217 13.3333 7.5C13.3333 4.27834 10.7217 1.66667 7.5 1.66667ZM0 7.5C0 3.35786 3.35786 0 7.5 0C11.6421 0 15 3.35786 15 7.5C15 11.6421 11.6421 15 7.5 15C3.35786 15 0 11.6421 0 7.5Z"
                    fill="#A9A9A9"
                  />
                </svg>
                <svg
                  width="5"
                  height="5"
                  viewBox="0 0 5 5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[5px] h-[5px] absolute left-3 top-3"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.244078 0.244078C0.569515 -0.0813592 1.09715 -0.0813592 1.42259 0.244078L4.75592 3.57741C5.08136 3.90285 5.08136 4.43049 4.75592 4.75592C4.43049 5.08136 3.90285 5.08136 3.57741 4.75592L0.244078 1.42259C-0.0813592 1.09715 -0.0813592 0.569515 0.244078 0.244078Z"
                    fill="#A9A9A9"
                  />
                </svg>
              </div>
            </div>
            <input
              placeholder="Search Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[#A9A9A9] font-bricolageGrotesque text-sm font-bold leading-[1.4em] tracking-[-0.04em] placeholder:text-[#A9A9A9]"
            />
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pb-32">
          {loading ? (
            <div className="col-span-1 xl:col-span-2 flex justify-center py-10">
              <div className="w-8 h-8 rounded-full border-2 border-[#303030] border-t-transparent animate-spin" />
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="col-span-1 xl:col-span-2 text-center text-gray-500 py-10">
              No assignments found.
            </div>
          ) : filteredAssignments.map((it) => {
            const assignedDate = new Date(it.createdAt).toLocaleDateString();
            const dueDate = it.dueDate ? new Date(it.dueDate).toLocaleDateString() : "No due date";
            // Check if there are specific sections or fall back to generic title
            const mainTopic = it.questionTypes.length > 0 ? it.questionTypes[0].type : "General Assignment";
            
            return (
            <Link
              key={it._id}
              to="/assignments/output"
              search={{ assignmentId: it._id }}
              className="relative flex flex-col justify-between p-5 rounded-3xl bg-[rgba(255,255,255,0.75)] lg:bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-md transition-all h-[142px] lg:h-[162px]"
            >
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col justify-center items-start gap-[11px] w-fit">
                  <h3 className="text-[#303030] text-lg lg:text-[22px] xl:text-2xl font-bold lg:font-extrabold tracking-[-0.04em] leading-[1.4em] lg:leading-[1.2em]">
                    {mainTopic} Quiz
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenMenu(openMenu === it._id ? null : it._id);
                  }}
                  className="w-6 h-6 relative shrink-0 flex items-center justify-center rounded-md hover:bg-gray-100/50"
                >
                  <div className="w-6 h-6 relative flex flex-col items-center justify-center gap-0.5">
                    <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-1 h-1">
                      <path fillRule="evenodd" clipRule="evenodd" d="M2 0C3.10457 0 4 0.89543 4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2C0 0.89543 0.895431 0 2 0Z" fill="black" />
                    </svg>
                    <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-1 h-1">
                      <path fillRule="evenodd" clipRule="evenodd" d="M2 0C3.10457 0 4 0.89543 4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2C0 0.89543 0.895431 0 2 0Z" fill="black" />
                    </svg>
                    <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-1 h-1">
                      <path fillRule="evenodd" clipRule="evenodd" d="M2 0C3.10457 0 4 0.89543 4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2C0 0.89543 0.895431 0 2 0Z" fill="black" />
                    </svg>
                  </div>
                </button>
              </div>
              
              {it.status !== "completed" && (
                <div className={`mt-1 text-xs font-semibold inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full w-fit ${
                  it.status === "pending" || it.status === "processing"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : it.status === "failed"
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-gray-50 text-gray-600 border border-gray-200"
                }`}>
                  {it.status === "pending" || it.status === "processing" ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  ) : it.status === "failed" ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  ) : null}
                  {it.status.charAt(0).toUpperCase() + it.status.slice(1)}
                </div>
              )}

              {it.status === "completed" && (
                <div className="mt-1 text-xs font-semibold inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full w-fit bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {it.totalQuestions} Qs · {it.totalMarks} Marks
                </div>
              )}

              <div className="flex items-start gap-2.5 w-full mt-auto lg:mt-0">
                <div className="flex items-start gap-[11px] w-fit">
                  <p className="text-[rgba(0,0,0,0.50)] font-bricolageGrotesque text-base leading-[1.2em] w-fit tracking-[-0.04em]">
                    <span className="lg:font-bold lg:text-[#303030]">Assigned on :</span> {assignedDate}
                  </p>
                </div>
                <div className="flex items-start gap-[11px] w-fit">
                  <p className="text-[rgba(0,0,0,0.50)] font-bricolageGrotesque text-base leading-[1.2em] w-fit tracking-[-0.04em]">
                    <span className="lg:font-bold lg:text-[#303030]">Due :</span> {dueDate}
                  </p>
                </div>
              </div>

              {openMenu === it._id && (
                <div 
                  className="absolute right-12 top-12 flex flex-col gap-1 p-2 rounded-2xl bg-white shadow-[0_16px_48px_0_rgba(0,0,0,0.20),0_32px_48px_0_rgba(0,0,0,0.05)] w-fit z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Link 
                    to="/assignments/output"
                    search={{ assignmentId: it._id }}
                    className="flex items-center px-3 py-0 h-8 rounded-lg w-full hover:bg-gray-50"
                  >
                    <span className="text-[#303030] text-sm font-medium tracking-[-0.04em]">View Assignment</span>
                  </Link>
                  <button 
                    onClick={() => {
                      api.deleteAssignment(it._id)
                        .then(() => setAssignments((prev) => prev.filter((a) => a._id !== it._id)))
                        .catch(console.error);
                      setOpenMenu(null);
                    }}
                    className="flex items-center px-3 py-0 h-8 rounded-lg bg-[#F6F6F6] w-full hover:bg-red-50 mt-1"
                  >
                    <span className="text-[#C53535] text-sm font-medium tracking-[-0.04em]">Delete</span>
                  </button>
                </div>
              )}
            </Link>
          );
          })}
        </div>

        {/* Desktop Bottom Blur Fade Overlay */}
        <div className="bottom-gradient-blur hidden lg:block fixed bottom-0 left-[328px] right-3 h-36 pointer-events-none z-20" />

        {/* Desktop Floating Create Button */}
        <div className="hidden lg:flex fixed bottom-0 left-[328px] right-3 h-36 justify-center items-end pb-7 pointer-events-none z-30">
          <Link
            to="/assignments/new"
            aria-label="Create Assignment"
            className="flex py-3 px-6 items-center gap-1.5 rounded-[48px] border-[1.5px] border-[rgba(255,255,255,0.50)] bg-[#181818] shadow-lg hover:opacity-100 active:scale-95 transition-all pointer-events-auto"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[15px] h-[15px] shrink-0">
              <path d="M7.5 1.5V13.5M1.5 7.5H13.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span className="text-[#FFF] font-bricolageGrotesque text-base font-medium leading-[1.4em] tracking-[-0.04em]">
              Create Assignment
            </span>
          </Link>
        </div>
      </div>
    </Shell>
  );
}
