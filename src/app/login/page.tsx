"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      const message = "Email or password is incorrect.";
      setError(message);
      toast.error(message);
      setLoading(false);
      return;
    }

    toast.success("Welcome back.");
    router.replace("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4 py-10 font-mono">
      <div className="w-full max-w-md">

        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-2xl font-black text-black tracking-tight">StudyBuddy AI</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Neo-Brutalist Study Mode
          </p>
        </div>

        <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-8">

          <div className="mb-6">
            <span className="inline-block bg-[#a8ff78] text-black text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border-2 border-black mb-3">
              Welcome Back
            </span>
            <h1 className="text-3xl font-black text-black leading-tight">
              Log in to your workspace
            </h1>
            <p className="mt-1 text-sm text-gray-500 font-medium">
              Pick up right where you left off.
            </p>
          </div>

          {error && (
            <div className="mb-4 border-2 border-black bg-red-100 rounded-xl px-4 py-3 shadow-[3px_3px_0px_0px_#000]">
              <p className="text-sm font-bold text-red-700">⚠ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-black mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border-2 border-black rounded-xl bg-[#f5f0e8] px-4 py-3 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black uppercase tracking-widest text-black">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-bold text-gray-500 hover:text-black transition-colors underline underline-offset-2"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border-2 border-black rounded-xl bg-[#f5f0e8] px-4 py-3 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-black uppercase tracking-widest text-sm rounded-xl py-3.5 border-2 border-black shadow-[4px_4px_0px_0px_#4ade80] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_#4ade80] disabled:hover:translate-x-0 disabled:hover:translate-y-0 mt-2"
            >
              {loading ? "Logging in..." : "Log in →"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-black/10" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-black/10" />
          </div>

          <p className="text-center text-sm font-semibold text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-black text-black underline underline-offset-2 hover:text-indigo-600 transition-colors"
            >
              Create one free →
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 font-medium mt-6">
          Your AI-powered study companion awaits.
        </p>
      </div>
    </main>
  );
}