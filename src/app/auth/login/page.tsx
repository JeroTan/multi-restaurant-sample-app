"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json() as any;
      if (res.ok) {
        router.push(`/${data.tenant.slug}/orders`);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pale-gray flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-absolute-black rounded-xl mb-6 shadow-xl">
            <Store className="w-8 h-8 text-pure-white" />
          </div>
          <h1 className="text-[32px] font-semibold tracking-tight text-near-black mb-2">Sign in to Tangram</h1>
          <p className="text-near-black/40 font-medium">Enter your credentials to manage your restaurant.</p>
        </div>

        <div className="bg-pure-white p-8 rounded-[24px] shadow-sm border border-graphite-border">
          <form onSubmit={handleLogin} className="space-y-6">
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

            <div className="space-y-1">
              <div className="flex justify-between items-end px-1">
                <label className="text-[12px] font-bold text-near-black/40 uppercase tracking-widest">Password</label>
                <Link href="/auth/forgot-password" className="text-[12px] text-apple-blue font-semibold hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
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
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[15px] text-near-black/40">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-apple-blue font-semibold hover:underline">
            Register your restaurant
          </Link>
        </p>
      </div>
    </div>
  );
}
