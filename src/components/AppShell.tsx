"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const protectedPrefixes = [
  "/dashboard",
  "/chat",
  "/pdf-tutor",
  "/quiz",
  "/flashcards",
  "/roadmap",
  "/analytics",
  "/notes",
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProtectedApp = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtectedApp) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Sidebar />
      <main className="min-h-screen pt-16 lg:pl-72 lg:pt-0">{children}</main>
    </div>
  );
}
