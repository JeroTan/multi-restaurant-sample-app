"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CreateDemoButton() {
  const [loading, setLoading] = useState(false);
  const [demoData, setDemoData] = useState<{
    slug: string;
    tableNumber: string;
    signature: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      const slug = `demo-${Math.floor(Date.now() / 1000)}`;
      
      // 1. Create Tenant
      const tenantRes = await fetch("/api/admin/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Demo Restaurant", slug }),
      });
      if (!tenantRes.ok) throw new Error("Failed to create tenant");
      const tenant = await tenantRes.json() as any;

      // 2. Create Table
      const tableRes = await fetch("/api/admin/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId: tenant.id, tableNumbers: ["1"] }),
      });
      if (!tableRes.ok) throw new Error("Failed to create table");
      const tables = await tableRes.json() as any[];

      // 3. Create Sample Menu Category
      const catRes = await fetch("/api/admin/menu/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId: tenant.id, name: "Signature Dishes", order: 1 }),
      });
      const category = await catRes.json() as any;

      // 4. Create Sample Dish
      if (category.id) {
        await fetch("/api/admin/menu/dishes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenantId: tenant.id,
            categoryId: category.id,
            name: "Classic Burger",
            description: "A perfect demo burger with edge-native sauce.",
            price: 14.99,
          }),
        });
      }

      setDemoData({
        slug,
        tableNumber: tables[0].tableNumber,
        signature: tables[0].qrCodeSignature,
      });
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (demoData) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-left w-full max-w-2xl mx-auto shadow-sm">
        <h3 className="text-xl font-bold text-green-900 mb-2">🎉 Demo Environment Ready!</h3>
        <p className="text-green-800 mb-6">We've created a temporary restaurant, table, and menu just for you.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            href={`/${demoData.slug}/${demoData.tableNumber}?sig=${demoData.signature}`}
            className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-shadow group"
            target="_blank"
          >
            <div>
              <p className="font-bold text-gray-900">Customer H5 Menu</p>
              <p className="text-xs text-gray-500 mt-1">Simulate scanning a QR code</p>
            </div>
            <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href={`/${demoData.slug}/orders`}
            className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-shadow group"
            target="_blank"
          >
            <div>
              <p className="font-bold text-gray-900">Admin Dashboard</p>
              <p className="text-xs text-gray-500 mt-1">Manage orders and menu</p>
            </div>
            <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <button
        onClick={createDemo}
        disabled={loading}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-colors disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Generating Demo...
          </>
        ) : (
          "Generate Live Demo Environment"
        )}
      </button>
      {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
    </div>
  );
}
