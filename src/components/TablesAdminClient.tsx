"use client";
import { useEffect, useState } from 'react';
import { Plus, Printer, Download, QrCode as QrIcon } from 'lucide-react';
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

  const downloadQR = (tableNumber: string, tableId: string) => {
    const svg = document.getElementById(`qr-${tableId}`);
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      const padding = 20;
      canvas.width = img.width + (padding * 2);
      canvas.height = img.height + (padding * 2);
      
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, padding, padding);
      }
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `Table-${tableNumber}-QR.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  const origin = isClient ? window.location.origin : '';

  return (
    <div className="print:p-0 max-w-[1200px] mx-auto">
      {/* Admin Chrome */}
      <div className="print:hidden">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-[40px] font-semibold text-near-black tracking-tight leading-none mb-4">Tables & Access</h1>
            <p className="text-near-black/40 text-[17px]">Manage physical touchpoints and QR signatures.</p>
          </div>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-near-black text-pure-white px-6 py-3 rounded-md font-semibold text-[15px] transition-all active:scale-95 shadow-lg shadow-near-black/10"
          >
            <Printer className="w-4 h-4" />
            Print All Assets
          </button>
        </div>

        <div className="bg-pure-white p-8 rounded-lg border border-graphite-border shadow-sm mb-12 max-w-lg">
          <h2 className="text-[17px] font-semibold text-near-black mb-6 flex items-center gap-2">
            <Plus className="w-4 h-4 text-apple-blue"/> Provision New Table
          </h2>
          <form onSubmit={createTable} className="flex gap-4">
            <input 
              value={newTableNumber} 
              onChange={e => setNewTableNumber(e.target.value)} 
              required 
              placeholder="Table Number (e.g. 12)" 
              className="flex-1 bg-pale-gray border border-graphite-border rounded-md px-4 py-2.5 text-[15px] outline-none focus:ring-2 focus:ring-apple-blue/20" 
            />
            <button type="submit" className="bg-apple-blue text-pure-white rounded-md px-8 py-2.5 font-semibold text-[15px] active:scale-95 transition-all">
              Provision
            </button>
          </form>
        </div>
      </div>

      {/* QR Code Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 print:grid-cols-3 print:gap-12 print:w-full">
        {tables.map(table => {
          const qrUrl = `${origin}/${tenant.slug}/${table.tableNumber}?sig=${table.qrCodeSignature}`;
          return (
            <div key={table.id} className="bg-pure-white p-8 rounded-lg border border-graphite-border shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-md transition-all print:shadow-none print:border-gray-300 print:break-inside-avoid">
              <div className="mb-6">
                <div className="text-[12px] font-bold text-near-black/20 uppercase tracking-widest mb-1">{tenant.name}</div>
                <h3 className="text-[20px] font-semibold text-near-black leading-none">Table {table.tableNumber}</h3>
              </div>
              
              <div className="bg-pure-white p-8 rounded-lg border border-pale-gray shadow-inner mb-6 group-hover:scale-[1.02] transition-transform">
                {isClient && (
                  <QRCode 
                    id={`qr-${table.id}`}
                    value={qrUrl} 
                    size={160} 
                    level="H" 
                    className="w-full max-w-[160px] h-auto"
                  />
                )}
              </div>
              
              <div className="w-full space-y-3 print:hidden">
                <button
                  onClick={() => downloadQR(table.tableNumber, table.id)}
                  className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold text-apple-blue bg-apple-blue/5 py-2.5 rounded-md hover:bg-apple-blue/10 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Save as PNG
                </button>
                <div className="text-[10px] text-near-black/20 font-mono break-all line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {qrUrl}
                </div>
              </div>

              <div className="mt-6 text-[11px] text-near-black font-semibold hidden print:flex items-center gap-2">
                <QrIcon className="w-3 h-3" />
                Scan to order
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
