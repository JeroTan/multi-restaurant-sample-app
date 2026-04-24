"use client";
import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Clock, CheckCircle2, RefreshCw, ChevronRight } from 'lucide-react';

export default function CustomerMenuClient({ tenant, table, signature, categories, dishes }: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Tracking State
  const [activeOrders, setActiveOrders] = useState<any[]>([]);

  const fetchActiveOrders = async () => {
    try {
      const res = await fetch(`/api/customer/orders?tenantId=${tenant.id}&tableId=${table.id}&tableNumber=${table.tableNumber}&signature=${signature}`);
      if (res.ok) {
        const data = await res.json() as any[];
        setActiveOrders(data);
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    }
  };

  useEffect(() => {
    fetchActiveOrders();
    
    // WebSocket Setup
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws?tenantId=${tenant.id}`;
    let ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'order-update' && data.tableId === table.id) {
        fetchActiveOrders();
      }
    };

    ws.onclose = () => {
      setTimeout(() => {
        fetchActiveOrders(); 
      }, 3000);
    };

    return () => ws.close();
  }, [tenant.id, table.id, signature]);

  const addToCart = (dish: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.dishId === dish.id);
      if (existing) {
        return prev.map(item => item.dishId === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { dishId: dish.id, name: dish.name, price: dish.price, quantity: 1, notes: "" }];
    });
  };

  const updateQuantity = (dishId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.dishId === dishId) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/customer/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: tenant.id,
          tableId: table.id,
          tableNumber: table.tableNumber,
          signature,
          items: cart,
          totalPrice
        })
      });
      if (res.ok) {
        setCart([]);
        setIsCartOpen(false);
        setOrderSuccess(true);
        fetchActiveOrders();
      } else {
        const error = await res.json() as any;
        console.error('Order failed:', error.error);
      }
    } catch (e) {
      console.error('Network error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'text-apple-blue bg-apple-blue/5 border-apple-blue/10';
      case 'served': return 'text-green-600 bg-green-50 border-green-100';
      default: return 'text-near-black/60 bg-pale-gray border-graphite-border';
    }
  };

  return (
    <div className="relative pb-24 bg-pale-gray min-h-screen">
      {/* Header (Showcase Mode) */}
      <header className="px-6 pt-12 pb-8 bg-pure-white border-b border-graphite-border">
        <h1 className="text-[34px] font-semibold text-near-black tracking-tight leading-none mb-2">{tenant.name}</h1>
        <div className="flex items-center gap-2 text-near-black/50 font-medium">
          <span>Table {table.tableNumber}</span>
          <div className="w-1 h-1 rounded-full bg-near-black/20" />
          <span className="text-apple-blue">Order Live</span>
        </div>
      </header>

      {/* Active Orders Section (Transactional) */}
      {activeOrders.length > 0 && (
        <section className="px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[14px] font-semibold text-near-black uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-apple-blue" />
              Live Progress
            </h2>
          </div>
          <div className="space-y-4">
            {activeOrders.map(order => (
              <div key={order.id} className="retail-card p-5">
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[12px] font-bold px-3 py-1 rounded-full border ${getStatusColor(order.status)} uppercase tracking-wider`}>
                    {order.status}
                  </span>
                  <span className="text-[12px] text-near-black/40 font-mono">#{order.id.substring(0, 4)}</span>
                </div>
                <div className="space-y-2">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-[15px] text-near-black/80">
                      <span>{item.quantity}x {dishes.find((d: any) => d.id === item.dishId)?.name || 'Dish'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Menu List (Showcase Content) */}
      <div className="px-6 py-12 space-y-16">
        {orderSuccess && (
          <div className="bg-apple-blue text-pure-white p-4 rounded-lg shadow-lg flex justify-between items-center animate-in slide-in-from-top duration-500">
            <span className="font-semibold">Order placed successfully.</span>
            <button onClick={() => setOrderSuccess(false)} className="opacity-70 hover:opacity-100">Dismiss</button>
          </div>
        )}

        {categories.sort((a: any, b: any) => a.order - b.order).map((cat: any) => (
          <div key={cat.id}>
            <h2 className="text-[28px] font-semibold text-near-black mb-8 border-b border-graphite-border pb-4">{cat.name}</h2>
            <div className="space-y-6">
              {dishes.filter((d: any) => d.categoryId === cat.id).map((dish: any) => (
                <div key={dish.id} className="bg-pure-white p-6 rounded-lg border border-graphite-border shadow-sm flex flex-col sm:flex-row gap-6 group active:scale-[0.98] transition-all">
                  {dish.imageUrl && (
                    <div className="w-full sm:w-32 h-48 sm:h-32 rounded-lg overflow-hidden border border-graphite-border shrink-0">
                      <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[19px] font-semibold text-near-black mb-1">{dish.name}</h3>
                      <p className="text-[15px] text-near-black/50 mb-4 line-clamp-2 leading-relaxed">{dish.description}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[17px] font-bold text-near-black">${dish.price.toFixed(2)}</p>
                      <button 
                        onClick={() => addToCart(dish)} 
                        className="w-11 h-11 bg-pale-gray text-apple-blue rounded-full flex items-center justify-center hover:bg-apple-blue hover:text-pure-white transition-all shadow-sm"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button (Apple Capsule) */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-0 right-0 px-6 z-30">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-apple-blue text-pure-white p-5 rounded-xl font-bold shadow-2xl shadow-apple-blue/30 flex justify-between items-center active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-pure-white/20 px-2.5 py-1 rounded-md text-[13px]">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </div>
              <span className="text-[17px]">Review Order</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[17px]">${totalPrice.toFixed(2)}</span>
              <ChevronRight className="w-5 h-5 opacity-50" />
            </div>
          </button>
        </div>
      )}

      {/* Bottom Sheet Cart */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-near-black/60 backdrop-blur-md" onClick={() => setIsCartOpen(false)} />
          <div className="bg-pure-white w-full rounded-t-[24px] p-8 relative flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
            
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[28px] font-semibold text-near-black">Your Order</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-apple-blue font-semibold">Done</button>
            </div>
            
            <div className="flex-1 overflow-auto space-y-6 mb-8 pr-2">
              {cart.map(item => (
                <div key={item.dishId} className="flex justify-between items-center">
                  <div>
                    <h3 className="text-[17px] font-semibold text-near-black mb-1">{item.name}</h3>
                    <p className="text-[15px] text-near-black/40">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-pale-gray rounded-md p-1.5 border border-graphite-border">
                    <button onClick={() => updateQuantity(item.dishId, -1)} className="p-1.5 text-near-black/60 hover:text-apple-blue">
                      {item.quantity === 1 ? <Trash2 className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4" />}
                    </button>
                    <span className="font-bold w-5 text-center text-[15px]">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.dishId, 1)} className="p-1.5 text-near-black/60 hover:text-apple-blue">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              disabled={isSubmitting}
              onClick={placeOrder}
              className="w-full bg-apple-blue text-pure-white py-5 rounded-lg font-bold text-[17px] shadow-lg disabled:opacity-50 active:scale-95 transition-all"
            >
              {isSubmitting ? 'Processing...' : `Confirm Order • $${totalPrice.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
