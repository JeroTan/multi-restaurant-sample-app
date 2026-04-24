"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!token) {
    return (
      <div className="text-center p-8 bg-red-50 border border-red-100 rounded-2xl">
        <p className="text-red-600 font-bold">Invalid Reset Link</p>
        <p className="text-red-500/60 text-sm mt-2">The password reset link is missing a token. Please request a new one.</p>
        <Link href="/auth/forgot-password" className="inline-block mt-4 text-apple-blue font-bold hover:underline">
          Forgot Password
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/auth/login"), 3000);
      } else {
        const data = await res.json() as any;
        setError(data.error || "Failed to reset password");
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-pure-white p-12 rounded-[32px] shadow-sm border border-graphite-border text-center">
        <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mb-6 text-green-600">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-[32px] font-semibold tracking-tight text-near-black mb-4">Password Reset</h1>
        <p className="text-near-black/40 text-[17px] mb-8 leading-relaxed">
          Your password has been successfully updated. We're redirecting you to sign in.
        </p>
        <div className="w-8 h-8 border-4 border-apple-blue border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-pure-white p-10 rounded-[32px] shadow-sm border border-graphite-border w-full max-w-[450px]">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-pale-gray rounded-xl mb-6">
          <Lock className="w-8 h-8 text-apple-blue" />
        </div>
        <h1 className="text-[32px] font-semibold tracking-tight text-near-black mb-2">Set New Password</h1>
        <p className="text-near-black/40 font-medium">Please enter your new secure password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="text-[12px] font-bold text-near-black/40 uppercase tracking-widest px-1">New Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min. 8 characters"
              className="w-full bg-pale-gray border border-graphite-border rounded-lg px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all pr-12"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-near-black/20 hover:text-near-black/60 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[12px] font-bold text-near-black/40 uppercase tracking-widest px-1">Confirm New Password</label>
          <input 
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Repeat new password"
            className="w-full bg-pale-gray border border-graphite-border rounded-lg px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[13px] font-medium">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-absolute-black text-pure-white py-4 rounded-xl font-bold text-[17px] shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          Update Password
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-pale-gray flex flex-col items-center justify-center p-6">
      <Suspense fallback={<Loader2 className="w-10 h-10 animate-spin text-apple-blue" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
