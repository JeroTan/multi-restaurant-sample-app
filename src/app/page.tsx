import { Store, QrCode, ChefHat, LayoutDashboard, ArrowRight } from 'lucide-react';
import CreateDemoButton from '@/components/CreateDemoButton';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Chapter 1: The Vision (Showcase Black) */}
      <section className="section-black py-24 px-6 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="max-w-4xl w-full text-center">
          <div className="inline-flex items-center justify-center p-3 bg-graphite-a rounded-md mb-8 border border-graphite-b">
            <Store className="w-8 h-8 text-lum-blue" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-semibold leading-tight mb-6 tracking-tight">
            Precision Dining <br />
            <span className="text-gray-400">for the Modern Era.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-light">
            The edge-native platform for restaurants that demand speed, elegance, and zero friction.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <CreateDemoButton />
          </div>
        </div>
      </section>

      {/* Chapter 2: The Experience (Showcase Gray) */}
      <section className="section-gray py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Customer Interface */}
            <div className="group">
              <div className="w-14 h-14 bg-pure-white rounded-lg flex items-center justify-center mb-8 shadow-sm border border-graphite-border">
                <QrCode className="w-6 h-6 text-apple-blue" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Customer Interface</h2>
              <p className="text-near-black/70 leading-relaxed mb-6">
                Mobile-first menus that feel like a native app. Instant checkout without downloads.
              </p>
              <div className="h-1 w-0 bg-apple-blue transition-all group-hover:w-12" />
            </div>

            {/* Admin Live Orders */}
            <div className="group">
              <div className="w-14 h-14 bg-pure-white rounded-lg flex items-center justify-center mb-8 shadow-sm border border-graphite-border">
                <LayoutDashboard className="w-6 h-6 text-apple-blue" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Live Order Board</h2>
              <p className="text-near-black/70 leading-relaxed mb-6">
                Real-time Kanban synchronization powered by Durable Objects. Zero-latency coordination.
              </p>
              <div className="h-1 w-0 bg-apple-blue transition-all group-hover:w-12" />
            </div>

            {/* Menu Management */}
            <div className="group">
              <div className="w-14 h-14 bg-pure-white rounded-lg flex items-center justify-center mb-8 shadow-sm border border-graphite-border">
                <ChefHat className="w-6 h-6 text-apple-blue" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Menu Engineering</h2>
              <p className="text-near-black/70 leading-relaxed mb-6">
                A surgical dashboard for managing categories and dish availability across all tenants.
              </p>
              <div className="h-1 w-0 bg-apple-blue transition-all group-hover:w-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-pure-white border-t border-pale-gray">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-apple-blue" />
            <span className="font-semibold tracking-tight text-lg">Tangram QR</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/auth/login" className="text-sm font-semibold text-near-black/60 hover:text-apple-blue transition-colors">
              Admin Sign In
            </Link>
            <p className="text-sm text-gray-400">
              Powered by Next.js & Cloudflare D1
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
