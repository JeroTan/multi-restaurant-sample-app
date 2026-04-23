"use client";
import { useEffect, useState } from 'react';
import { Plus, Printer } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function TablesAdminClient({ tenant }: { tenant: any }) {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTableNumber, setNewTableNumber] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tables?tenantId=${tenant.id}`);
      const data = await res.json() as any[];
      setTables(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [tenant.id]);

  const createTable = async (e: any) => {
    e.preventDefault();
    if (!newTableNumber) return;
    
    await fetch(`/api/admin/tables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId: tenant.id, tableNumbers: [newTableNumber] })
    });
    setNewTableNumber("");
    fetchTables();
  };

  const handlePrint = () => {
    window.print();
  };

  // Base URL for QR codes
  const origin = isClient ? window.location.origin : '';

  return (
    <div className="print:p-0">
      {/* Admin Chrome - Hidden when printing */}
      <div className="print:hidden">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tables & QRs</h1>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print All QRs
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 max-w-md">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Plus className="w-5 h-5"/> Add New Table</h2>
          <form onSubmit={createTable} className="flex gap-4">
            <input 
              value={newTableNumber} 
              onChange={e => setNewTableNumber(e.target.value)} 
              required 
              placeholder="Table Number (e.g. 5 or Patio-1)" 
              className="flex-1 border border-gray-300 rounded-lg p-2" 
            />
            <button type="submit" className="bg-gray-900 text-white rounded-lg px-6 py-2 font-medium hover:bg-gray-800">
              Add
            </button>
          </form>
        </div>
      </div>

      {/* QR Code Grid - Optimized for both dashboard and print */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 print:grid-cols-3 print:gap-4 print:w-full">
        {tables.map(table => {
          const qrUrl = `${origin}/${tenant.slug}/${table.tableNumber}?sig=${table.qrCodeSignature}`;
          return (
            <div key={table.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center print:shadow-none print:border-gray-400 print:break-inside-avoid">
              <h3 className="font-bold text-gray-900 text-lg mb-1">{tenant.name}</h3>
              <p className="text-gray-500 font-medium mb-6">Table {table.tableNumber}</p>
              
              <div className="bg-white p-2 rounded-lg border border-gray-100">
                {isClient && (
                  <QRCode 
                    value={qrUrl} 
                    size={150} 
                    level="H" 
                    className="w-full max-w-[150px] h-auto"
                  />
                )}
              </div>
              
              <p className="mt-4 text-xs text-gray-400 font-mono break-all print:hidden">
                {qrUrl}
              </p>
              <p className="mt-4 text-xs text-gray-800 font-medium hidden print:block">
                Scan to order
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
