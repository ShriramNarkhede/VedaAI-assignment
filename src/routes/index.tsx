import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, TopBar } from "@/components/AppShell";
import emptyIllustration from "@/assets/no-assignments.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Assignments — VedaAI" },
      { name: "description", content: "Create and manage assignments with VedaAI." },
    ],
  }),
  component: EmptyAssignmentsPage,
});

function EmptyAssignmentsPage() {
  return (
    <Shell>
      <TopBar title="Home" />
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <div className="w-full max-w-[1100px] min-h-[678px] flex flex-col justify-center items-center">
          <div className="flex-1 flex flex-col justify-center items-center gap-8 w-full px-4">
            <div className="flex flex-col justify-start items-center gap-3">
              <div className="size-72 relative flex justify-center items-center">
                <img
                  src={emptyIllustration}
                  alt="No assignments"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-full max-w-[486px] flex flex-col justify-center items-center gap-0.5">
                <div className="text-center text-zinc-800 text-xl font-bold font-['Bricolage_Grotesque'] leading-7">
                  No assignments yet
                </div>
                <div className="self-stretch text-center text-zinc-600/80 text-base font-normal font-['Bricolage_Grotesque'] leading-6">
                  Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
                </div>
              </div>
            </div>
            <Link
              to="/assignments/new"
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 transition-colors rounded-[48px] outline outline-[1.50px] outline-offset-[-1.50px] outline-white/50 inline-flex justify-start items-center gap-1"
            >
              <div className="size-5 relative">
                <div className="w-3.5 h-[1.67px] left-[2.50px] top-[9.17px] absolute bg-white" />
                <div className="w-3.5 h-[1.67px] left-[10.83px] top-[2.50px] absolute origin-top-left rotate-90 bg-white" />
              </div>
              <div className="text-center text-white text-base font-medium font-['Bricolage_Grotesque'] leading-6">
                Create Your First Assignment
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
