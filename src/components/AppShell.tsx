import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  Settings,
  ArrowLeft,
  Sparkles,
  Menu,
} from "lucide-react";
import logo from "@/assets/background.png";
import avatar from "@/assets/avatar-teacher.png";

const Logo = ({ size = "large", isOutputPage = false }: { size?: "small" | "large"; isOutputPage?: boolean }) => {
  const isLarge = size === "large";
  const containerClass = isLarge ? "w-10 h-10" : "w-8 h-8";
  const bgClass = isLarge ? "rounded-[10px] w-10 h-10" : "rounded-[8px] w-8 h-8";
  const scaleStyle = isLarge
    ? { transform: "scale(1)", transformOrigin: "top left" }
    : { transform: "scale(0.8)", transformOrigin: "top left" };

  return (
    <div className={`shrink-0 relative ${containerClass}`}>
      {isOutputPage ? (
        <div className={`bg-[#303030] absolute left-0 top-0 ${bgClass}`} />
      ) : (
        <img
          src={logo}
          className={`${bgClass} absolute left-0 top-0 max-w-none`}
          alt="background"
        />
      )}
      <div
        className="absolute w-10 h-10"
        style={scaleStyle}
      >
        <svg
          width="19"
          height="20"
          viewBox="0 0 19 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[18px] h-[19px] absolute left-1.5 top-[11px]"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.7271 17.3582C16.7271 17.3582 17.4545 19.3002 18.1212 19.4217H9.6969C7.9998 19.4217 6.48501 18.4507 5.99973 16.6298L1.09074 2.06353C1.09074 2.06353 0.666687 0.303408 0 0H8.60616C10.3033 0.0607716 11.4548 0.667588 12.1215 2.91344L16.7271 17.3582Z"
            fill="white"
          />
        </svg>
        <svg
          width="19"
          height="20"
          viewBox="0 0 19 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-20 w-[18px] h-[19px] absolute left-1.5 top-[11px]"
        >
          <path
            opacity="0.2"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.7271 17.3582C16.7271 17.3582 17.4545 19.3002 18.1212 19.4217H9.6969C7.9998 19.4217 6.48501 18.4507 5.99973 16.6298L1.09074 2.06353C1.09074 2.06353 0.666687 0.303408 0 0H8.60616C10.3033 0.0607716 11.4548 0.667588 12.1215 2.91344L16.7271 17.3582Z"
            fill="url(#paint0_linear_2_10648)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_2_10648"
              x1="9.0606"
              y1="-1.65105"
              x2="9.0606"
              y2="21.1337"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.33" stopColor="white" stopOpacity="0" />
              <stop offset="0.76" stopColor="#0E1513" />
              <stop offset="1" stopColor="#0E1513" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          width="19"
          height="20"
          viewBox="0 0 19 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[18px] h-[19px] absolute left-4 top-[11px]"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.39415 17.3577C1.39415 17.3577 0.666687 19.2997 0 19.4213H8.4243C10.1214 19.4213 11.6362 18.4503 12.1215 16.6294L16.9701 2.06353C16.9701 2.06353 17.3942 0.303408 18.0609 0H9.51504C7.81793 0 6.72719 0.606816 6.06051 2.85266L1.39415 17.3577Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
};


// Custom SVG Icons
const HomeIcon = ({ className }: { className?: string }) => (
  <div className={`shrink-0 w-5 h-5 overflow-hidden relative ${className || ""}`}>
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-1.5 h-1.5 absolute left-3 top-3"
    >
      <path
        d="M6.83333 1H1V6.83333H6.83333V1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-1.5 h-1.5 absolute left-[3px] top-3"
    >
      <path
        d="M6.83333 1H1V6.83333H6.83333V1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-1.5 h-1.5 absolute left-3 top-[3px]"
    >
      <path
        d="M6.83333 1H1V6.83333H6.83333V1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-1.5 h-1.5 absolute left-[3px] top-[3px]"
    >
      <path
        d="M6.83333 1H1V6.83333H6.83333V1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const MyGroupsIcon = ({ className }: { className?: string }) => (
  <div className={`shrink-0 w-5 h-5 overflow-hidden relative flex items-center justify-center ${className || ""}`}>
    <svg
      width="20"
      height="14"
      viewBox="0 0 20 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-3.5"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.0053 0C19.1069 0 20 0.867353 20 1.93727V12.0627C20 12.8063 19.5687 13.452 18.9357 13.7767C18.7114 13.0842 18.552 12.599 18.4574 12.321C18.403 12.1608 18.3777 12.011 18.2979 11.8819C18.2236 11.7617 18.1006 11.6182 17.9791 11.4747L17.9521 11.4428C17.5516 10.968 17.0414 10.3553 16.609 9.82839C16.1946 9.32331 15.8524 8.89639 15.7181 8.78227C15.3989 8.51105 14.9468 8.21401 14.2686 8.21401H9.66755C9.62487 8.2067 9.53035 8.1911 9.41489 8.14943C8.91888 7.97045 7.88479 7.51948 7.36702 7.30995C6.21465 6.13586 5.35029 5.25332 4.77394 4.66235C4.72638 4.61361 4.61117 4.49397 4.42827 4.30347C4.20391 4.06978 3.83109 4.04594 3.57713 4.24907C3.32508 4.45067 3.28322 4.81013 3.48253 5.06133C5.29064 7.33994 6.21755 8.50276 6.2633 8.5498C6.37468 8.66433 6.70673 8.87699 7.11436 9.1439C7.53415 9.41875 8.03354 9.75 8.41755 10.0092C8.77511 10.2505 8.97606 10.3192 9.01596 10.655C9.10394 11.3955 9.21032 12.5105 9.33511 14H1.99468C0.893058 14 0 13.1326 0 12.0627V1.93727C0 0.867353 0.893058 0 1.99468 0H18.0053ZM15.7979 11.7915C15.9066 11.7819 16.0276 11.915 16.0771 11.9594C16.2486 12.1131 16.3003 12.1721 16.4096 12.2694C16.5691 12.4114 16.7331 12.5764 16.7553 12.6051C16.9727 12.99 17.2919 13.7639 17.4073 14L15.4654 14C15.5489 13.0617 15.6021 12.459 15.625 12.1919C15.6516 11.8819 15.6891 11.8011 15.7979 11.7915ZM12.4734 3.06088C11.1955 3.06088 10.1596 4.06699 10.1596 5.30811C10.1596 6.54922 11.1955 7.55534 12.4734 7.55534C13.7513 7.55534 14.7872 6.54922 14.7872 5.30811C14.7872 4.06699 13.7513 3.06088 12.4734 3.06088Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

const AssignmentsIcon = ({ className }: { className?: string }) => (
  <div className={`shrink-0 w-5 h-5 flex items-center justify-center ${className || ""}`}>
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.6665 1.66663C7.12674 1.66663 7.49984 2.03972 7.49984 2.49996H12.4998C12.4998 2.03972 12.8729 1.66663 13.3332 1.66663C13.7934 1.66663 14.1665 2.03972 14.1665 2.49996C16.4677 2.49996 18.3332 4.36544 18.3332 6.66663V14.1666C18.3332 16.4678 16.4677 18.3333 14.1665 18.3333H5.83317C3.53198 18.3333 1.6665 16.4678 1.6665 14.1666V6.66663C1.6665 4.36544 3.53198 2.49996 5.83317 2.49996C5.83317 2.03972 6.20627 1.66663 6.6665 1.66663ZM4.99984 8.33329C4.99984 7.87306 5.37293 7.49996 5.83317 7.49996H14.1665C14.6267 7.49996 14.9998 7.87306 14.9998 8.33329C14.9998 8.79353 14.6267 9.16663 14.1665 9.16663H5.83317C5.37293 9.16663 4.99984 8.79353 4.99984 8.33329ZM12.4998 14.1666C12.4998 13.7064 12.8729 13.3333 13.3332 13.3333H14.1665C14.6267 13.3333 14.9998 13.7064 14.9998 14.1666C14.9998 14.6269 14.6267 15 14.1665 15H13.3332C12.8729 15 12.4998 14.6269 12.4998 14.1666Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

const AIToolkitIcon = ({ className }: { className?: string }) => (
  <div className={`shrink-0 w-5 h-5 flex items-center justify-center ${className || ""}`}>
    <svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[18px] h-[18px] shrink-0"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.63783 8.63783L6.18377 4H7.13246L8.6784 8.63783L13.3162 10.1838V11.1325L8.6784 12.6784L7.13246 17.3162H6.18377L4.63783 12.6784L0 11.1325V10.1838L4.63783 8.63783Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.3878 2.38783L14.1838 0H15.1325L15.9284 2.38783L18.3162 3.18377V4.13246L15.9284 4.9284L15.1325 7.31623H14.1838L13.3878 4.9284L11 4.13246V3.18377L13.3878 2.38783Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

const MyLibraryIcon = ({ className }: { className?: string }) => (
  <div className={`shrink-0 w-5 h-5 flex items-center justify-center ${className || ""}`}>
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0002 2.08329C10.0002 1.85317 9.81361 1.66663 9.5835 1.66663H6.66683C4.82588 1.66663 3.3335 3.15901 3.3335 4.99996V15C3.3335 16.8409 4.82588 18.3333 6.66683 18.3333H13.3335C15.1744 18.3333 16.6668 16.8409 16.6668 15V8.74996C16.6668 8.51984 16.4803 8.33329 16.2502 8.33329H14.1668C11.8656 8.33329 10.0002 6.46781 10.0002 4.16663V2.08329ZM16.0164 6.66663C16.2935 6.66663 16.4926 6.39907 16.3595 6.15604C16.2465 5.9497 16.1039 5.75856 15.9346 5.58922L12.7442 2.39886C12.5749 2.22951 12.3838 2.08697 12.1774 1.97396C11.9344 1.84086 11.6668 2.04 11.6668 2.31708V4.16663C11.6668 5.54734 12.7861 6.66663 14.1668 6.66663H16.0164ZM10.0002 9.16663C10.4604 9.16663 10.8335 9.53972 10.8335 9.99996V11.6666H12.5002C12.9604 11.6666 13.3335 12.0397 13.3335 12.5C13.3335 12.9602 12.9604 13.3333 12.5002 13.3333H10.8335V15C10.8335 15.4602 10.4604 15.8333 10.0002 15.8333C9.53993 15.8333 9.16683 15.4602 9.16683 15V13.3333H7.50016C7.03993 13.3333 6.66683 12.9602 6.66683 12.5C6.66683 12.0397 7.03993 11.6666 7.50016 11.6666H9.16683V9.99996C9.16683 9.53972 9.53993 9.16663 10.0002 9.16663Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

const DesktopAssignmentsIcon = ({ className }: { className?: string }) => (
  <div className={`shrink-0 w-5 h-5 relative ${className || ""}`}>
    <svg
      width="7"
      height="2"
      viewBox="0 0 7 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[5px] absolute left-2 top-3.5"
    >
      <path
        d="M1 1H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
    <svg
      width="7"
      height="2"
      viewBox="0 0 7 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[5px] absolute left-2 top-[11px]"
    >
      <path
        d="M1 1H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
    <svg
      width="3"
      height="2"
      viewBox="0 0 3 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-px absolute left-2 top-2"
    >
      <path
        d="M1 1H1.83333"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
    <svg
      width="14"
      height="17"
      viewBox="0 0 14 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-3 h-[15px] absolute left-1 top-[3px]"
    >
      <path
        d="M1 3.5C1 2.11929 2.11929 1 3.5 1H7.80964C8.25167 1 8.6756 1.17559 8.98816 1.48816L12.1785 4.67851C12.4911 4.99107 12.6667 5.415 12.6667 5.85702V13.5C12.6667 14.8807 11.5474 16 10.1667 16H3.5C2.11929 16 1 14.8807 1 13.5V3.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
    <svg
      width="6"
      height="6"
      viewBox="0 0 6 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[5px] h-[5px] absolute left-[11px] top-[3px]"
    >
      <path
        d="M1 0V1.66667C1 3.50762 2.49238 5 4.33333 5H6"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  </div>
);

const DesktopAIToolkitIcon = ({ className }: { className?: string }) => (
  <div className={`shrink-0 w-5 h-5 flex items-center justify-center ${className || ""}`}>
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
    >
      <path
        d="M3.33337 16.25C3.33337 15.6975 3.55287 15.1676 3.94357 14.7769C4.33427 14.3861 4.86417 14.1667 5.41671 14.1667H16.6667M3.33337 16.25C3.33337 16.8025 3.55287 17.3324 3.94357 17.7231C4.33427 18.1138 4.86417 18.3333 5.41671 18.3333H16.6667V1.66666H5.41671C4.86417 1.66666 4.33427 1.88615 3.94357 2.27685C3.55287 2.66755 3.33337 3.19746 3.33337 3.74999V16.25Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const DesktopMyLibraryIcon = ({ className }: { className?: string }) => (
  <div className={`shrink-0 w-5 h-5 overflow-hidden relative ${className || ""}`}>
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 absolute left-0.5 top-0.5"
    >
      <path
        d="M17.0087 11.8836C16.4785 13.1373 15.6493 14.2421 14.5936 15.1013C13.5378 15.9606 12.2876 16.5481 10.9524 16.8126C9.61709 17.077 8.23736 17.0104 6.93379 16.6184C5.63023 16.2265 4.44252 15.5211 3.47452 14.5641C2.50651 13.6071 1.78768 12.4275 1.38087 11.1285C0.974049 9.82953 0.891637 8.45065 1.14083 7.11244C1.39003 5.77423 1.96325 4.51743 2.81037 3.45194C3.6575 2.38644 4.75274 1.54468 6.00034 1.00024"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-2 h-2 absolute left-2.5 top-0.5"
    >
      <path
        d="M9.33333 9.33333C9.33333 8.23898 9.11779 7.15535 8.699 6.1443C8.28021 5.13326 7.66638 4.2146 6.89256 3.44078C6.11873 2.66696 5.20008 2.05313 4.18903 1.63434C3.17798 1.21555 2.09435 1 1 1V9.33333H9.33333Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const navItems = [
  { label: "Home", icon: HomeIcon, to: "/" as const },
  { label: "My Groups", icon: MyGroupsIcon, to: "/" as const, isPlaceholder: true },
  { label: "Assignments", icon: DesktopAssignmentsIcon, to: "/assignments" as const, match: ["/assignments"] },
  { label: "AI Teacher’s Toolkit", icon: DesktopAIToolkitIcon, to: "/" as const, isPlaceholder: true },
  { label: "My Library", icon: DesktopMyLibraryIcon, to: "/" as const, isPlaceholder: true },
];

const bottomTabs = [
  { label: "Home", icon: HomeIcon, to: "/" as const, match: ["/"] },
  { label: "Assignments", icon: AssignmentsIcon, to: "/assignments" as const, match: ["/assignments"] },
  { label: "Library", icon: MyLibraryIcon, to: "/" as const, match: ["__never__"] },
  { label: "AI Toolkit", icon: AIToolkitIcon, to: "/" as const, match: ["__never__"] },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isOutputPage = path === "/assignments/output" || path === "/assignments/output/";
  return (
    <aside className="hidden lg:flex w-[304px] shrink-0 bg-white rounded-2xl p-6 flex-col shadow-elevated sticky top-3 h-[calc(100vh-1.5rem)]">
      <div className="flex items-center gap-2">
        <Logo size="large" isOutputPage={isOutputPage} />
        <span className="text-[#303030] font-bricolageGrotesque text-[28px] font-bold leading-5 tracking-[-0.06em] flex items-center h-10 mt-1">
          VedaAI
        </span>
      </div>

      <Link
        to="/assignments/new"
        className="mt-6 relative rounded-full p-[2px] bg-gradient-to-b from-[#f97048] to-[#c2410c]"
      >
        <div className="flex items-center justify-center gap-2 rounded-full bg-[#181818] py-3 px-5 text-white">
          {isOutputPage ? (
            <>
              <AIToolkitIcon className="text-white w-4 h-4" />
              <span className="text-[15px] font-medium">AI Teacher's Toolkit</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span className="text-[15px] font-medium">Create Assignment</span>
            </>
          )}
        </div>
      </Link>

      <nav className="mt-8 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isPlaceholder
            ? false
            : item.match
              ? item.match.some((m) => (m === "/" ? path === "/" : path.startsWith(m)))
              : path === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] transition-colors ${
                active
                  ? "bg-[#F0F0F0] text-[#303030] font-semibold"
                  : "text-[rgba(94,94,94,0.80)] hover:bg-[#f9fafb]"
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

      <div className="mt-3 flex items-center gap-3 p-3 rounded-[16px] bg-[#F0F0F0]">
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
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isCreateOrOutputPage = path.startsWith("/assignments/new") || path.startsWith("/assignments/output");

  return (
    <>
      {/* Mobile: brand row */}
      <div className="lg:hidden flex items-center justify-between rounded-2xl bg-white backdrop-blur pl-3 pr-4 h-14 shadow-elevated">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 relative shrink-0">
            <div className="rounded-[7px] bg-[#303030] w-7 h-7 absolute left-0 top-0"></div>
            <svg
              width="13"
              height="14"
              viewBox="0 0 13 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[13px] h-3.5 absolute left-1 top-2"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.7089 12.1507C11.7089 12.1507 12.2182 13.5101 12.6848 13.5952H6.78783C5.59986 13.5952 4.53951 12.9155 4.19981 11.6409L0.763516 1.44447C0.763516 1.44447 0.466681 0.212386 0 0H6.02431C7.21229 0.0425401 8.01834 0.467311 8.48502 2.03941L11.7089 12.1507Z"
                fill="white"
              />
            </svg>
            <svg
              width="13"
              height="14"
              viewBox="0 0 13 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-20 w-[13px] h-3.5 absolute left-1 top-2"
            >
              <path
                opacity="0.2"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.7089 12.1507C11.7089 12.1507 12.2182 13.5101 12.6848 13.5952H6.78783C5.59986 13.5952 4.53951 12.9155 4.19981 11.6409L0.763516 1.44447C0.763516 1.44447 0.466681 0.212386 0 0H6.02431C7.21229 0.0425401 8.01834 0.467311 8.48502 2.03941L11.7089 12.1507Z"
                fill="url(#paint0_linear_19_385_mobile)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_19_385_mobile"
                  x1="6.34242"
                  y1="-1.15574"
                  x2="6.34242"
                  y2="14.7936"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0" />
                  <stop offset="0.33" stopColor="white" stopOpacity="0" />
                  <stop offset="0.76" stopColor="#0E1513" />
                  <stop offset="1" stopColor="#0E1513" />
                </linearGradient>
              </defs>
            </svg>
            <svg
              width="13"
              height="14"
              viewBox="0 0 13 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[13px] h-3.5 absolute left-[11px] top-2"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.975902 12.1504C0.975902 12.1504 0.466681 13.5098 0 13.5949H5.89701C7.08498 13.5949 8.14533 12.9152 8.48502 11.6406L11.8791 1.44447C11.8791 1.44447 12.1759 0.212386 12.6426 0H6.66052C5.47255 0 4.70904 0.424771 4.24235 1.99662L0.975902 12.1504Z"
                fill="white"
              />
            </svg>
          </div>
          <span className="text-[#303030] font-bricolageGrotesque text-xl font-bold leading-[1.4em] tracking-[-0.06em] mt-[3px]">
            VedaAI
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex justify-center items-center gap-2.5 shrink-0 rounded-[100px] bg-[#F6F6F6] w-9 h-9 relative hover:opacity-90 active:scale-95 transition-all">
            <div className="shrink-0 w-6 h-6 overflow-hidden relative">
              <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[15px] absolute left-[3px] top-0.5">
                <path d="M16 7C16 5.4087 15.3679 3.88258 14.2426 2.75736C13.1174 1.63214 11.5913 1 10 1C8.4087 1 6.88258 1.63214 5.75736 2.75736C4.63214 3.88258 4 5.4087 4 7C4 14 1 16 1 16H19C19 16 16 14 16 7Z" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg width="6" height="3" viewBox="0 0 6 3" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-1.5 h-[3px] absolute left-[9px] top-[18px]">
                <path d="M4.46024 1.00017C4.28443 1.30325 4.03209 1.55482 3.72847 1.7297C3.42485 1.90458 3.08062 1.99662 2.73024 1.99662C2.37986 1.99662 2.03563 1.90458 1.73202 1.7297C1.4284 1.55482 1.17605 1.30325 1.00024 1.00017" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="absolute right-px top-px w-2 h-2 rounded-full bg-[#FF1C1C]" />
          </button>
          
          <img src={avatar} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover shrink-0" />
          
          <button className="w-9 h-9 flex items-center justify-center hover:opacity-85 active:scale-95 transition-all">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 relative"
            >
              <path
                d="M3 18V16H21V18H3ZM3 13V11H21V13H3ZM3 8V6H21V8H3Z"
                fill="#1D1B20"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile: back + centered title */}
      {path !== "/" && path !== "/assignments/output" && path !== "/assignments/output/" && (
        <div className="lg:hidden flex items-center gap-3 px-1">
          <Link
            to={backTo ?? "/assignments"}
            className="w-10 h-10 rounded-full bg-[#e5e7eb] flex items-center justify-center shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-[#374151]" />
          </Link>
          <div className="flex-1 text-center pr-10">
            <span className="text-[16px] font-semibold text-[#1a1a1a]">
              {title === "Create New" || isCreateOrOutputPage ? "Create New" : title}
            </span>
          </div>
        </div>
      )}

      {/* Desktop top bar */}
      <div className="hidden lg:flex items-center justify-between rounded-2xl bg-[rgba(255,255,255,0.75)] backdrop-blur pl-6 pr-3 h-16 shadow-elevated">
        <div className="flex items-center gap-3">
          {path !== "/" && (
            <Link
              to={backTo ?? "/assignments"}
              className="flex justify-center items-center rounded-full bg-[#FFF] w-10 h-10 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:opacity-90 active:scale-95 transition-all mr-1"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 w-6 h-6 relative">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.7071 4.29289C11.0976 4.68342 11.0976 5.31658 10.7071 5.70711L5.41421 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H5.41421L10.7071 18.2929C11.0976 18.6834 11.0976 19.3166 10.7071 19.7071C10.3166 20.0976 9.68342 20.0976 9.29289 19.7071L2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L9.29289 4.29289C9.68342 3.90237 10.3166 3.90237 10.7071 4.29289Z" fill="#303030"/>
              </svg>
            </Link>
          )}

          <div className="flex items-center gap-2">
            {isCreateOrOutputPage ? (
              <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] shrink-0 relative">
                <path fillRule="evenodd" clipRule="evenodd" d="M4.63783 8.63783L6.18377 4H7.13246L8.6784 8.63783L13.3162 10.1838V11.1325L8.6784 12.6784L7.13246 17.3162H6.18377L4.63783 12.6784L0 11.1325V10.1838L4.63783 8.63783Z" fill="#A9A9A9"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M13.3878 2.38783L14.1838 0H15.1325L15.9284 2.38783L18.3162 3.18377V4.13246L15.9284 4.9284L15.1325 7.31623H14.1838L13.3878 4.9284L11 4.13246V3.18377L13.3878 2.38783Z" fill="#A9A9A9"/>
              </svg>
            ) : (
              <div className="w-5 h-5 overflow-hidden relative shrink-0">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-1.5 h-1.5 absolute left-3 top-3">
                  <path d="M6.83333 1H1V6.83333H6.83333V1Z" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-1.5 h-1.5 absolute left-[3px] top-3">
                  <path d="M6.83333 1H1V6.83333H6.83333V1Z" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-1.5 h-1.5 absolute left-3 top-[3px]">
                  <path d="M6.83333 1H1V6.83333H6.83333V1Z" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-1.5 h-1.5 absolute left-[3px] top-[3px]">
                  <path d="M6.83333 1H1V6.83333H6.83333V1Z" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            <span className="line-clamp-1 overflow-hidden text-[#A9A9A9] text-ellipsis font-bricolageGrotesque text-base font-semibold tracking-[-0.04em]">
              {isCreateOrOutputPage ? "Create New" : title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex justify-center items-center gap-2.5 shrink-0 rounded-[100px] bg-[#F6F6F6] w-9 h-9 relative hover:opacity-90 active:scale-95 transition-all">
            <div className="shrink-0 w-6 h-6 overflow-hidden relative">
              <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[15px] absolute left-[3px] top-0.5">
                <path d="M16 7C16 5.4087 15.3679 3.88258 14.2426 2.75736C13.1174 1.63214 11.5913 1 10 1C8.4087 1 6.88258 1.63214 5.75736 2.75736C4.63214 3.88258 4 5.4087 4 7C4 14 1 16 1 16H19C19 16 16 14 16 7Z" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg width="6" height="3" viewBox="0 0 6 3" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-1.5 h-[3px] absolute left-[9px] top-[18px]">
                <path d="M4.46 1.00017C4.28419 1.30325 4.03184 1.55482 3.72823 1.7297C3.42461 1.90458 3.08038 1.99662 2.73 1.99662C2.37962 1.99662 2.03539 1.90458 1.73177 1.7297C1.42816 1.55482 1.17581 1.30325 1 1.00017" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="absolute right-px top-px w-2 h-2 rounded-full bg-[#FF1C1C]" />
          </button>

          <button className="flex py-1.5 px-3 items-center gap-2 rounded-xl bg-white shadow-[0_16px_48px_0_rgba(0,0,0,0.12),0_32px_48px_0_rgba(0,0,0,0.20)] hover:opacity-95 active:scale-95 transition-all">
            <img src={avatar} alt="" className="rounded-[100px] w-8 h-8 shrink-0 object-cover" />
            <div className="flex items-center gap-1 w-fit">
              <span className="line-clamp-1 overflow-hidden text-[#303030] text-ellipsis font-bricolageGrotesque text-base font-semibold w-fit tracking-[-0.04em]">
                John Doe
              </span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 overflow-hidden relative shrink-0">
                <path d="M6 9L12 15L18 9" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}

export function MobileBottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path === "/assignments/output" || path === "/assignments/output/") {
    return null;
  }
  const showFloatingButton = path === "/" || path === "/assignments" || path === "/assignments/";

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex flex-col items-center gap-3 px-3 pb-3 pt-3 pointer-events-none bg-gradient-to-t from-zinc-100/5 to-transparent backdrop-blur-[1px]">
      {/* Floating Action Button */}
      {showFloatingButton && (
        <div className="flex justify-end w-full pr-1 pointer-events-auto">
          <Link
            to="/assignments/new"
            className="flex justify-center items-center rounded-full bg-white shadow-[0_16px_48px_0_rgba(0,0,0,0.12),0_32px_48px_0_rgba(0,0,0,0.20)] w-12 h-12 hover:scale-105 active:scale-95 transition-all"
          >
            <div className="shrink-0 w-5 h-5 relative">
              <div className="w-[15px] h-[15px] absolute left-[2.5px] top-[2.5px]">
                <svg width="15" height="2" viewBox="0 0 15 2" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[15px] h-0.5 absolute left-0 top-[6.5px]">
                  <path fillRule="evenodd" clipRule="evenodd" d="M0 0.833333C0 0.373096 0.373096 0 0.833333 0H14.1667C14.6269 0 15 0.373096 15 0.833333C15 1.29357 14.6269 1.66667 14.1667 1.66667H0.833333C0.373096 1.66667 0 1.29357 0 0.833333Z" fill="#FF5623"/>
                </svg>
                <svg width="2" height="15" viewBox="0 0 2 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-0.5 h-[15px] absolute left-[6.5px] top-0">
                  <path fillRule="evenodd" clipRule="evenodd" d="M0.833415 -3.64262e-08C1.29365 -1.63085e-08 1.66675 0.373096 1.66675 0.833333L1.66675 14.1667C1.66675 14.6269 1.29365 15 0.833414 15C0.373177 15 8.07806e-05 14.6269 8.08007e-05 14.1667L8.13835e-05 0.833333C8.14036e-05 0.373096 0.373177 -5.65438e-08 0.833415 -3.64262e-08Z" fill="#FF5623"/>
                </svg>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <div className="flex py-2 px-6 justify-between items-center rounded-3xl bg-[#181818] shadow-[0_16px_48px_0_rgba(0,0,0,0.12),0_32px_48px_0_rgba(0,0,0,0.20)] w-full h-[72px] pointer-events-auto">
        {bottomTabs.map((t) => {
          const Icon = t.icon;
          const active = t.match.some((m) => (m === "/" ? path === "/" : path.startsWith(m)));
          
          return (
            <Link
              key={t.label}
              to={t.to}
              className="flex flex-col justify-center items-center gap-2.5 w-[52px] h-[52px] hover:scale-105 active:scale-95 transition-all"
            >
              <div className="cursor-pointer text-nowrap flex flex-col justify-center items-center gap-1 w-fit">
                {t.label === "Home" ? (
                  // Custom 4-squares grid icon for Home
                  <div className="flex flex-col items-start gap-px w-fit relative">
                    <div className="flex items-center gap-px w-full">
                      <div className={`rounded-[2.7px] w-2 h-2 transition-colors duration-200 ${active ? "bg-white" : "bg-[rgba(255,255,255,0.25)]"}`}></div>
                      <div className={`rounded-[2.7px] w-2 h-2 transition-colors duration-200 ${active ? "bg-white" : "bg-[rgba(255,255,255,0.25)]"}`}></div>
                    </div>
                    <div className="flex items-center gap-px w-full">
                      <div className={`rounded-[2.7px] w-2 h-2 transition-colors duration-200 ${active ? "bg-white" : "bg-[rgba(255,255,255,0.25)]"}`}></div>
                      <div className={`rounded-[2.7px] w-2 h-2 transition-colors duration-200 ${active ? "bg-white" : "bg-[rgba(255,255,255,0.25)]"}`}></div>
                    </div>
                  </div>
                ) : (
                  <Icon className={`w-5 h-5 shrink-0 transition-colors duration-200 ${active ? "text-white" : "text-white/25"}`} />
                )}
                
                <p className={`font-bricolageGrotesque text-xs font-semibold leading-[1.4em] w-fit tracking-[-0.04em] transition-colors duration-200 ${active ? "text-white" : "text-white/25"}`}>
                  {t.label === "My Library" ? "Library" : t.label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* iOS Home Indicator */}
      <svg width="133" height="5" viewBox="0 0 133 5" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 mt-0.5 opacity-60">
        <path d="M2.5 2.5H130.5" stroke="#303030" strokeOpacity="0.5" strokeWidth="5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isOutputPage = path === "/assignments/output" || path === "/assignments/output/";

  return (
    <div className={`min-h-screen app-bg p-3 lg:p-3 ${isOutputPage ? "pb-3" : "pb-36"} lg:pb-3`}>
      <div className="flex gap-3 lg:min-h-[calc(100vh-1.5rem)]">
        <Sidebar />
        <main className="flex-1 flex flex-col gap-3 min-w-0">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

