"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { fetchJson, getErrorMessage } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkStrength = (val: string) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    setPasswordStrength(score);
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "bg-red-500", "bg-yellow-400", "bg-blue-500", "bg-green-500"];
  const strengthBorder = ["", "border-red-500", "border-yellow-400", "border-blue-500", "border-green-500"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      toast.error("Password too short.");
      return;
    }

    setLoading(true);

    try {
      await fetchJson("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (err) {
      const message = getErrorMessage(err, "Something went wrong.");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
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

        {/* Card */}
        <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000] p-8">

          {/* Badge + Title */}
          <div className="mb-6">
            <span className="inline-block bg-[#c4b5fd] text-black text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border-2 border-black mb-3">
              Get Started
            </span>
            <h1 className="text-3xl font-black text-black leading-tight">
              Create your workspace
            </h1>
            <p className="mt-1 text-sm text-gray-500 font-medium">
              Free forever. No credit card needed.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { label: "AI Chat", color: "bg-[#c4b5fd]" },
              { label: "PDF Tutor", color: "bg-[#67e8f9]" },
              { label: "Quiz Gen", color: "bg-[#fde68a]" },
              { label: "Flashcards", color: "bg-[#f9a8d4]" },
            ].map((pill) => (
              <span
                key={pill.label}
                className={`${pill.color} text-black text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full border-2 border-black`}
              >
                {pill.label}
              </span>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 border-2 border-black bg-red-100 rounded-xl px-4 py-3 shadow-[3px_3px_0px_0px_#000]">
              <p className="text-sm font-bold text-red-700">⚠ {error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-black mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Shaheer Awan"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border-2 border-black rounded-xl bg-[#f5f0e8] px-4 py-3 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                required
              />
            </div>

            {/* Email */}
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

            {/* Password */}
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
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  checkStrength(e.target.value);
                }}
                className="w-full border-2 border-black rounded-xl bg-[#f5f0e8] px-4 py-3 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
                required
              />

              {/* Password Strength Bar */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full border border-black transition-all duration-300 ${
                          i <= passwordStrength ? strengthColor[passwordStrength] : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-black uppercase tracking-widest ${
                    passwordStrength <= 1 ? "text-red-500" :
                    passwordStrength === 2 ? "text-yellow-600" :
                    passwordStrength === 3 ? "text-blue-600" : "text-green-600"
                  }`}>
                    {strengthLabel[passwordStrength]}
                  </p>
                </div>
              )}
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              By signing up, you agree to our{" "}
              <span className="font-black text-black underline underline-offset-2 cursor-pointer">Terms of Service</span>{" "}
              and{" "}
              <span className="font-black text-black underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-black uppercase tracking-widest text-sm rounded-xl py-3.5 border-2 border-black shadow-[4px_4px_0px_0px_#c4b5fd] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_#c4b5fd] disabled:hover:translate-x-0 disabled:hover:translate-y-0 mt-1"
            >
              {loading ? "Creating workspace..." : "Create account →"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-black/10" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-black/10" />
          </div>

          {/* Switch to Login */}
          <p className="text-center text-sm font-semibold text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-black text-black underline underline-offset-2 hover:text-indigo-600 transition-colors"
            >
              Log in →
            </Link>
          </p>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-gray-400 font-medium mt-6">
          Join thousands of students studying smarter with AI.
        </p>
      </div>
    </main>
  );
}