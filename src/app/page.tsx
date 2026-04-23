import { Store, QrCode, ChefHat, LayoutDashboard } from 'lucide-react';
import CreateDemoButton from '@/components/CreateDemoButton';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-5xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12 mt-8">
          <div className="inline-flex items-center justify-center p-5 bg-white rounded-2xl shadow-sm mb-6 border border-gray-100">
            <Store className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Multi QR Ordering System
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-8">
            The multi-tenant edge-native platform for modern restaurants. Manage menus, process live orders, and delight customers with instant QR-based dining.
          </p>
          
          {/* Interactive Demo Orchestrator */}
          <CreateDemoButton />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {/* Customer Experience */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200/60 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <QrCode className="w-32 h-32" />
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 border border-blue-100 shrink-0">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Customer Interface</h2>
            <p className="text-gray-500 text-sm leading-relaxed flex-1">
              Scan a table's QR code to instantly access the mobile-first menu, customize orders, and checkout without installing an app.
            </p>
          </div>

          {/* Admin Live Orders */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200/60 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <LayoutDashboard className="w-32 h-32" />
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6 border border-orange-100 shrink-0">
              <LayoutDashboard className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Live Order Board</h2>
            <p className="text-gray-500 text-sm leading-relaxed flex-1">
              Real-time Kanban dashboard for staff to receive incoming orders, transition preparation states, and mark items as served.
            </p>
          </div>

          {/* Menu Management */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200/60 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <ChefHat className="w-32 h-32" />
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6 border border-green-100 shrink-0">
              <ChefHat className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Menu Management</h2>
            <p className="text-gray-500 text-sm leading-relaxed flex-1">
              Powerful dashboard for restaurant owners to organize categories, manage dish availability, and update pricing.
            </p>
          </div>
        </div>

        {/* Footer/Note */}
        <div className="mt-16 text-center text-sm text-gray-400">
          <p>Edge-Native Next.js • Cloudflare D1</p>
        </div>
      </div>
    </div>
  );
}
