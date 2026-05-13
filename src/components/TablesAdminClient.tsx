"use client";
import { useEffect, useState, useRef } from 'react';
import { Plus, Printer, Download, QrCode as QrIcon, Trash2, Edit2, Copy, Check, AlertTriangle } from 'lucide-react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

export default function TablesAdminClient({ tenant }: { tenant: any }) {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTableNumber, setNewTableNumber] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [editingTable, setEditingTable] = useState<any | null>(null);
  const [editValue, setEditValue] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tables?tenantId=${tenant.id}`);
      const data = await res.json() as any;
      
      if (res.ok && Array.isArray(data)) {
        setTables(data);
      } else {
        const errorMsg = data.error || "Failed to load tables";
        console.error("API Error:", errorMsg);
        toast.error(errorMsg);
        setTables([]); // Set to empty array to prevent map crash
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error: Failed to load tables");
      setTables([]);
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
    
    const res = await fetch(`/api/admin/tables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId: tenant.id, tableNumbers: [newTableNumber] })
    });

    if (res.ok) {
      toast.success(`Table ${newTableNumber} created`);
      setNewTableNumber("");
      fetchTables();
    } else {
      const data = await res.json() as any;
      toast.error(data.error || "Failed to create table");
    }
  };

  const updateTable = async () => {
    if (!editingTable || !editValue) return;
    
    const res = await fetch(`/api/admin/tables/${editingTable.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId: tenant.id, tableNumber: editValue })
    });

    if (res.ok) {
      toast.success("Table updated. QR code invalidated.");
      setEditingTable(null);
      fetchTables();
    } else {
      const data = await res.json() as any;
      toast.error(data.error || "Failed to update table");
    }
  };

  const deleteTable = async (id: string, number: string) => {
    if (!confirm(`Are you sure you want to delete Table ${number}?`)) return;

    const res = await fetch(`/api/admin/tables/${id}?tenantId=${tenant.id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      toast.success("Table deleted");
      fetchTables();
    } else {
      const data = await res.json() as any;
      toast.error(data.error || "Failed to delete table");
    }
  };

  const bulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} tables?`)) return;

    const res = await fetch(`/api/admin/tables`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId: tenant.id, tableIds: selectedIds })
    });

    if (res.ok) {
      toast.success("Tables deleted");
      setSelectedIds([]);
      fetchTables();
    } else {
      const data = await res.json() as any;
      toast.error(data.error || "Failed to delete tables");
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
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

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="print:p-0 max-w-[1200px] mx-auto px-4 md:px-8 pb-24">
      {/* Admin Chrome */}
      <div className="print:hidden pt-8 md:pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-semibold text-near-black tracking-tight leading-tight mb-4">Tables & Access</h1>
            <p className="text-near-black/40 text-[16px] md:text-[17px]">Manage physical touchpoints and QR signatures.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {selectedIds.length > 0 && (
              <button 
                onClick={bulkDelete}
                className="flex items-center gap-2 bg-apple-red text-pure-white px-5 md:px-6 py-3 rounded-md font-semibold text-[14px] md:text-[15px] transition-all active:scale-95 shadow-lg shadow-apple-red/10"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected ({selectedIds.length})
              </button>
            )}
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-near-black text-pure-white px-5 md:px-6 py-3 rounded-md font-semibold text-[14px] md:text-[15px] transition-all active:scale-95 shadow-lg shadow-near-black/10"
            >
              <Printer className="w-4 h-4" />
              Print All Assets
            </button>
          </div>
        </div>

        <div className="bg-pure-white p-6 md:p-8 rounded-lg border border-graphite-border shadow-sm mb-12 max-w-lg">
          <h2 className="text-[17px] font-semibold text-near-black mb-6 flex items-center gap-2">
            <Plus className="w-4 h-4 text-apple-blue"/> Provision New Table
          </h2>
          <form onSubmit={createTable} className="flex flex-col sm:flex-row gap-4">
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
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apple-blue"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 print:grid-cols-3 print:gap-12 print:w-full">
          {Array.isArray(tables) && tables.map(table => {
            const qrUrl = `${origin}/${tenant.slug}/${table.tableNumber}?sig=${table.qrCodeSignature}`;
            const isSelected = selectedIds.includes(table.id);
            
            return (
              <div 
                key={table.id} 
                className={`relative bg-pure-white p-6 md:p-8 rounded-lg border transition-all print:shadow-none print:border-gray-300 print:break-inside-avoid group flex flex-col
                  ${isSelected ? 'border-apple-blue ring-2 ring-apple-blue/10 shadow-md' : 'border-graphite-border shadow-sm hover:shadow-md'}
                `}
              >
                {/* Header Row: Selection & Actions */}
                <div className="flex justify-between items-center mb-6 print:hidden">
                  <div className="flex items-center">
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(table.id)}
                      className="w-5 h-5 rounded border-graphite-border text-apple-blue focus:ring-apple-blue cursor-pointer"
                    />
                  </div>
                  <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setEditingTable(table); setEditValue(table.tableNumber); }}
                      className="p-2 text-apple-blue hover:bg-apple-blue/5 rounded-md transition-colors"
                      title="Edit Table"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteTable(table.id, table.tableNumber)}
                      className="p-2 text-apple-red hover:bg-apple-red/5 rounded-md transition-colors"
                      title="Delete Table"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="text-[11px] font-bold text-near-black/20 uppercase tracking-widest mb-1">{tenant.name}</div>
                  <h3 className="text-[20px] font-semibold text-near-black leading-tight">Table {table.tableNumber}</h3>
                </div>
                
                <div className="bg-pure-white p-6 md:p-8 rounded-lg border border-pale-gray shadow-inner mb-6 flex justify-center items-center">
                  {isClient && (
                    <QRCode 
                      id={`qr-${table.id}`}
                      value={qrUrl} 
                      size={160} 
                      level="H" 
                      className="w-full max-w-[140px] md:max-w-[160px] h-auto"
                    />
                  )}
                </div>
                
                <div className="w-full space-y-4 mt-auto print:hidden">
                  {/* Visible Link & Copy Button */}
                  <div className="flex items-center gap-2 bg-pale-gray border border-graphite-border rounded-md px-3 py-2 group/link relative overflow-hidden">
                    <div className="text-[10px] md:text-[11px] text-near-black/60 font-mono truncate flex-1">
                      {qrUrl}
                    </div>
                    <button 
                      onClick={() => copyToClipboard(qrUrl, table.id)}
                      className="text-apple-blue hover:text-apple-blue/70 transition-colors shrink-0"
                      title="Copy Link"
                    >
                      {copiedId === table.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    onClick={() => downloadQR(table.tableNumber, table.id)}
                    className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold text-apple-blue bg-apple-blue/5 py-2.5 rounded-md hover:bg-apple-blue/10 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Save as PNG
                  </button>
                </div>

                <div className="mt-6 text-[11px] text-near-black font-semibold hidden print:flex items-center gap-2 justify-center">
                  <QrIcon className="w-3 h-3" />
                  Scan to order
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingTable && (
        <div className="fixed inset-0 bg-near-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-pure-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-graphite-border animate-in fade-in zoom-in duration-200">
            <div className="p-6 md:p-8">
              <h2 className="text-[24px] font-semibold text-near-black mb-2">Edit Table Number</h2>
              <p className="text-near-black/40 text-[15px] mb-8">Update the designation for this physical location.</p>
              
              <div className="bg-apple-red/5 border border-apple-red/10 rounded-xl p-4 mb-8 flex gap-4">
                <AlertTriangle className="w-6 h-6 text-apple-red shrink-0" />
                <div>
                  <h4 className="text-[14px] font-bold text-apple-red uppercase tracking-wider mb-1">Critical Warning</h4>
                  <p className="text-[14px] text-apple-red/80 leading-relaxed">
                    Changing the table number will <span className="font-bold underline">permanently invalidate</span> all existing printed QR codes for this table.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[13px] font-bold text-near-black/40 uppercase tracking-widest mb-3">Table Designation</label>
                  <input 
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="w-full bg-pale-gray border border-graphite-border rounded-md px-4 py-3 text-[17px] outline-none focus:ring-2 focus:ring-apple-blue/20"
                    autoFocus
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-pale-gray/30 p-6 flex flex-col sm:flex-row gap-3 border-t border-graphite-border">
              <button 
                onClick={() => setEditingTable(null)}
                className="flex-1 px-6 py-3 rounded-md font-semibold text-[15px] text-near-black/60 hover:bg-pale-gray transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button 
                onClick={updateTable}
                className="flex-1 bg-apple-blue text-pure-white px-6 py-3 rounded-md font-semibold text-[15px] active:scale-95 transition-all shadow-lg shadow-apple-blue/20 order-1 sm:order-2"
              >
                Update Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
