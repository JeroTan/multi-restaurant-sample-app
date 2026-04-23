"use client";
import { useEffect, useState } from 'react';
import { Clock, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';

export default function OrdersClient({ tenantId }: { tenantId: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?tenantId=${tenantId}`);
      const data = await res.json() as any[];
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [tenantId]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, status })
      });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Live Orders</h1>
        <button onClick={fetchOrders} className="p-2 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
          <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-orange-500"/> Pending</h2>
          <div className="space-y-4">
            {orders.filter(o => o.status === 'pending').map(order => (
              <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-gray-900">Table {order.tableId.substring(0,4)}...</span>
                  <span className="font-semibold text-blue-600">${order.totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">{new Date(order.createdAt).toLocaleTimeString()}</p>
                <button onClick={() => updateStatus(order.id, 'preparing')} className="w-full bg-orange-100 text-orange-700 font-medium py-2 rounded-lg hover:bg-orange-200 transition-colors">Start Preparing</button>
              </div>
            ))}
          </div>
        </div>

        {/* Preparing */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
          <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><RefreshCw className="w-5 h-5 text-blue-500"/> Preparing</h2>
          <div className="space-y-4">
            {orders.filter(o => o.status === 'preparing').map(order => (
              <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-gray-900">Table {order.tableId.substring(0,4)}...</span>
                  <span className="font-semibold text-blue-600">${order.totalPrice.toFixed(2)}</span>
                </div>
                <button onClick={() => updateStatus(order.id, 'served')} className="w-full bg-blue-100 text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-200 transition-colors">Mark as Served</button>
              </div>
            ))}
          </div>
        </div>

        {/* Served */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
          <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500"/> Served</h2>
          <div className="space-y-4">
            {orders.filter(o => o.status === 'served').map(order => (
              <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-gray-900">Table {order.tableId.substring(0,4)}...</span>
                  <span className="font-semibold text-blue-600">${order.totalPrice.toFixed(2)}</span>
                </div>
                <button onClick={() => updateStatus(order.id, 'completed')} className="w-full bg-green-100 text-green-700 font-medium py-2 rounded-lg hover:bg-green-200 transition-colors">Complete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}