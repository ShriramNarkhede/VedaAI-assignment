import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  Users,
  FileText,
  BookOpen,
  PieChart,
  Settings,
  Bell,
  ArrowLeft,
  Sparkles,
  ChevronDown,
  Menu,
} from "lucide-react";
import logo from "@/assets/vedaai-logo.png";
import avatar from "@/assets/avatar-teacher.png";

const navItems = [
  { label: "Home", icon: LayoutGrid, to: "/" as const },
  { label: "My Groups", icon: Users, to: "/" as const },
  { label: "Assignments", icon: FileText, to: "/assignments" as const, match: ["/assignments", "/"] },
  { label: "AI Teacher's Toolkit", icon: BookOpen, to: "/" as const },
  { label: "My Library", icon: PieChart, to: "/" as const },
];

const bottomTabs = [
  { label: "Home", icon: LayoutGrid, to: "/" as const, match: ["/"] },
  { label: "Assignments", icon: FileText, to: "/assignments" as const, match: ["/assignments"] },
  { label: "Library", icon: PieChart, to: "/" as const, match: ["__never__"] },
  { label: "AI Toolkit", icon: Sparkles, to: "/" as const, match: ["__never__"] },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:flex w-[304px] shrink-0 bg-white rounded-2xl p-6 flex-col shadow-elevated">
      <div className="flex items-center gap-3 px-2 pt-1">
        <img src={logo} alt="VedaAI" width={44} height={44} className="rounded-xl" />
        <span className="text-[22px] font-semibold tracking-tight text-[#1a1a1a]">VedaAI</span>
      </div>

      <Link
        to="/assignments/new"
        className="mt-6 relative rounded-full p-[2px] bg-gradient-to-b from-[#f97048] to-[#c2410c]"
      >
        <div className="flex items-center justify-center gap-2 rounded-full bg-[#1a1a1a] py-3 px-5 text-white">
          <Sparkles className="w-4 h-4" />
          <span className="text-[15px] font-medium">Create Assignment</span>
        </div>
      </Link>

      <nav className="mt-8 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.match
            ? item.match.some((m) => (m === "/" ? path === "/" : path.startsWith(m)))
            : path === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] transition-colors ${
                active
                  ? "bg-[#f3f4f6] text-[#1a1a1a] font-semibold"
                  : "text-[#4b5563] hover:bg-[#f9fafb]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] text-[#4b5563] hover:bg-[#f9fafb]">
        <Settings className="w-5 h-5" />
        <span>Settings</span>
      </button>

      <div className="mt-3 flex items-center gap-3 p-3 rounded-2xl bg-[#f9fafb]">
        <img src={avatar} alt="" width={44} height={44} className="rounded-full object-cover" />
        <div className="leading-tight">
          <div className="text-[15px] font-semibold text-[#1a1a1a]">Delhi Public School</div>
          <div className="text-[13px] text-[#6b7280]">Bokaro Steel City</div>
        </div>
      </div>
    </aside>
  );
}

export function TopBar({ title = "Assignment", backTo }: { title?: string; backTo?: string }) {
  return (
    <>
      {/* Mobile: brand row */}
      <div className="lg:hidden flex items-center gap-3 bg-white/75 backdrop-blur rounded-2xl px-4 py-3 shadow-elevated">
        <img src={logo} alt="VedaAI" width={32} height={32} className="rounded-lg" />
        <span className="text-[18px] font-semibold text-[#1a1a1a]">VedaAI</span>
        <div className="flex-1" />
        <button className="relative w-9 h-9 rounded-full bg-[#f3f4f6] flex items-center justify-center">
          <Bell className="w-4 h-4 text-[#374151]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#f97048]" />
        </button>
        <img src={avatar} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
        <button className="w-9 h-9 flex items-center justify-center">
          <Menu className="w-5 h-5 text-[#374151]" />
        </button>
      </div>

      {/* Mobile: back + centered title */}
      <div className="lg:hidden flex items-center gap-3 px-1">
        <Link
          to={backTo ?? "/assignments"}
          className="w-10 h-10 rounded-full bg-[#e5e7eb] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-[#374151]" />
        </Link>
        <div className="flex-1 text-center pr-10">
          <span className="text-[16px] font-semibold text-[#1a1a1a]">{title}</span>
        </div>
      </div>

      {/* Desktop top bar */}
      <div className="hidden lg:flex items-center gap-3 bg-white/75 backdrop-blur rounded-2xl px-6 py-3 shadow-elevated">
        <Link
          to={backTo ?? "/assignments"}
          className="w-10 h-10 rounded-full border border-[#e5e7eb] flex items-center justify-center hover:bg-[#f9fafb]"
        >
          <ArrowLeft className="w-5 h-5 text-[#374151]" />
        </Link>
        <div className="flex items-center gap-2 text-[#1a1a1a]">
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[16px] font-medium">{title}</span>
        </div>
        <div className="flex-1" />
        <button className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#f9fafb]">
          <Bell className="w-5 h-5 text-[#374151]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#f97048]" />
        </button>
        <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-[#e5e7eb] hover:bg-[#f9fafb]">
          <img src={avatar} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
          <span className="text-[15px] font-semibold text-[#1a1a1a]">John Doe</span>
          <ChevronDown className="w-4 h-4 text-[#374151]" />
        </button>
      </div>
    </>
  );
}

export function MobileBottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#1a1a1a] text-white px-4 pt-3 pb-5 rounded-t-3xl">
      <div className="flex items-center justify-around">
        {bottomTabs.map((t) => {
          const Icon = t.icon;
          const active = t.match.some((m) => (m === "/" ? path === "/" : path.startsWith(m)));
          return (
            <Link key={t.label} to={t.to} className="flex flex-col items-center gap-1 min-w-[60px]">
              <span
                className={`w-10 h-7 rounded-full flex items-center justify-center ${
                  active ? "bg-white text-[#1a1a1a]" : "text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span className="text-[11px]">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen app-bg p-3 lg:p-3 pb-28 lg:pb-3">
      <div className="flex gap-3 lg:min-h-[calc(100vh-1.5rem)]">
        <Sidebar />
        <main className="flex-1 flex flex-col gap-3 min-w-0">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

