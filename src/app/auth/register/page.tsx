"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    restaurantName: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        const data = await res.json() as any;
        setError(data.error || "Registration failed");
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
          <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mb-6 text-green-600">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-[32px] font-semibold tracking-tight text-near-black mb-4">Registration Successful!</h1>
          <p className="text-near-black/40 text-[17px] mb-8 leading-relaxed">
            Your restaurant account has been created. We're redirecting you to the login page now.
          </p>
          <div className="w-8 h-8 border-4 border-apple-blue border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pale-gray flex flex-col items-center py-20 px-6">
      <div className="w-full max-w-[450px]">
        <div className="text-center mb-12">
          <h1 className="text-[40px] font-semibold tracking-tight text-near-black mb-3">Join QResto</h1>
          <p className="text-near-black/40 font-medium text-[17px]">Start your precision-engineered ordering platform.</p>
        </div>

        <div className="bg-pure-white p-10 rounded-[32px] shadow-sm border border-graphite-border">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-near-black/40 uppercase tracking-widest px-1">Restaurant Name</label>
                <input 
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                  required
                  placeholder="The Coffee House"
                  className="w-full bg-pale-gray border border-graphite-border rounded-lg px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-bold text-near-black/40 uppercase tracking-widest px-1">Your Full Name</label>
                <input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="John Appleseed"
                  className="w-full bg-pale-gray border border-graphite-border rounded-lg px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-bold text-near-black/40 uppercase tracking-widest px-1">Work Email</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="name@restaurant.com"
                  className="w-full bg-pale-gray border border-graphite-border rounded-lg px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-bold text-near-black/40 uppercase tracking-widest px-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                <label className="text-[12px] font-bold text-near-black/40 uppercase tracking-widest px-1">Confirm Password</label>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                  placeholder="Repeat password"
                  className="w-full bg-pale-gray border border-graphite-border rounded-lg px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[14px] font-medium">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-absolute-black text-pure-white py-4 rounded-xl font-bold text-[17px] shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              Create Account
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[15px] text-near-black/40 font-medium">
          Already using QResto?{" "}
          <Link href="/auth/login" className="text-apple-blue font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
