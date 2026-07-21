import Providers from "@/components/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StudyBuddy AI",
  description: "A polished AI study workspace for notes, quizzes, PDFs, and exam planning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable}`}>
      <body className="min-h-full bg-slate-50 text-slate-900"> 
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
