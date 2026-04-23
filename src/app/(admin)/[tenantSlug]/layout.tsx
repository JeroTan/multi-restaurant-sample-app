"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UtensilsCrossed } from 'lucide-react';

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tenantSlug: string };
}) {
  const pathname = usePathname();
  const slug = params.tenantSlug;

  const isActive = (path: string) => pathname.includes(path) ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50';

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Restaurant Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Tenant: {slug}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href={`/${slug}/orders`} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/orders')}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Live Orders</span>
          </Link>
          <Link href={`/${slug}/menu`} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/menu')}`}>
            <UtensilsCrossed className="w-5 h-5" />
            <span className="font-medium">Menu Management</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
