"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import AppShell from "@/components/AppShell";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppShell>{children}</AppShell>
      <Toaster richColors position="top-right" theme="light" closeButton />
    </SessionProvider>
  );
}
