"use client";

import { useState } from "react";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json() as any;
        setError(data.error || "Something went wrong");
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-pale-gray flex flex-col items-center justify-center p-6">
        <div className="bg-pure-white p-12 rounded-[32px] shadow-sm border border-graphite-border text-center max-w-[500px]">
          <div className="inline-flex items-center justify-center p-4 bg-apple-blue/10 rounded-full mb-6 text-apple-blue">
            <Mail className="w-12 h-12" />
          </div>
          <h1 className="text-[32px] font-semibold tracking-tight text-near-black mb-4">Email Sent</h1>
          <p className="text-near-black/40 text-[17px] mb-8 leading-relaxed">
            If an account matches <b>{email}</b>, you will receive an email with instructions to reset your password shortly.
          </p>
          <Link 
            href="/auth/login"
            className="inline-flex items-center gap-2 text-apple-blue font-bold text-[17px] hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pale-gray flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        <div className="mb-10">
          <Link href="/auth/login" className="inline-flex items-center gap-1 text-[15px] text-near-black/40 font-semibold hover:text-near-black transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
          <h1 className="text-[32px] font-semibold tracking-tight text-near-black mb-2">Reset Password</h1>
          <p className="text-near-black/40 font-medium">Enter your email and we'll send you a link.</p>
        </div>

        <div className="bg-pure-white p-8 rounded-[24px] shadow-sm border border-graphite-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-near-black/40 uppercase tracking-widest px-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full bg-pale-gray border border-graphite-border rounded-lg px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[13px] font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-apple-blue text-pure-white py-4 rounded-xl font-bold text-[17px] shadow-lg shadow-apple-blue/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
