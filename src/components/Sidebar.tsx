"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

type IconProps = {
  className?: string;
};

type NavItem = {
  href: string;
  label: string;
  icon: (props: IconProps) => React.ReactNode;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/chat", label: "AI Chat", icon: BotIcon },
  { href: "/pdf-tutor", label: "PDF Tutor", icon: FileIcon },
  { href: "/quiz", label: "Quiz Generator", icon: PenIcon },
  { href: "/flashcards", label: "Flashcards", icon: CardsIcon },
  { href: "/roadmap", label: "Exam Roadmap", icon: MapIcon },
  { href: "/analytics", label: "Analytics", icon: ChartIcon },
  { href: "/notes", label: "Saved Notes", icon: NoteIcon },
];

function SvgIcon({ children, className }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

function HomeIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </SvgIcon>
  );
}

function BotIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 8V4" />
      <rect x="5" y="8" width="14" height="11" rx="3" />
      <path d="M9 13h.01" />
      <path d="M15 13h.01" />
      <path d="M9 17h6" />
    </SvgIcon>
  );
}

function FileIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </SvgIcon>
  );
}

function PenIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </SvgIcon>
  );
}

function CardsIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="4" y="5" width="12" height="15" rx="2" />
      <path d="M8 9h4" />
      <path d="M8 13h4" />
      <path d="M18 7.5 20 8a2 2 0 0 1 1.4 2.4l-2 7.5" />
    </SvgIcon>
  );
}

function MapIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </SvgIcon>
  );
}

function ChartIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 16v-5" />
      <path d="M12 16V8" />
      <path d="M16 16v-3" />
    </SvgIcon>
  );
}

function NoteIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M15 3v4h4" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </SvgIcon>
  );
}

function MenuIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </SvgIcon>
  );
}

function CloseIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </SvgIcon>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-stone-50 text-slate-700">
      <div className="border-b-2 border-slate-900 bg-white px-5 py-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
        <Link href="/dashboard" className="block">
          <p className="text-lg font-black tracking-tight text-slate-900">StudyBuddy AI</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            Neo-brutalist study mode
          </p>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex min-h-[46px] items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all duration-200 active:translate-y-0.5 active:shadow-none ${
                isActive
                  ? "border-slate-900 bg-slate-900 text-white shadow-[3px_3px_0px_0px_rgba(132,204,22,1)]"
                  : "border-transparent text-slate-700 hover:bg-stone-200/80 hover:text-slate-900"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t-2 border-slate-900 bg-white p-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex min-h-[44px] w-full items-center justify-center rounded-xl border-2 border-slate-900 bg-lime-400 px-3 py-2.5 text-sm font-black text-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b-2 border-slate-900 bg-stone-50 px-4 lg:hidden">
        <Link href="/dashboard" className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">
          StudyBuddy AI
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation"
          className="rounded-xl border-2 border-slate-900 bg-white p-2 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r-2 border-slate-900 bg-stone-50 lg:block">
        <SidebarContent />
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative h-full w-80 max-w-[86vw] border-r-2 border-slate-900 bg-stone-50 shadow-[8px_0_0_0_rgba(15,23,42,1)]">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-xl border-2 border-slate-900 bg-white p-2 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
            <SidebarContent onNavigate={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
