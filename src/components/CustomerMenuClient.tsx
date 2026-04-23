"use client";
import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

export default function CustomerMenuClient({ tenant, table, signature, categories, dishes }: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

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
      } else {
        const error = await res.json() as any;
        alert('Failed: ' + error.error);
      }
    } catch (e) {
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Order Placed!</h2>
        <p className="text-gray-500 mt-2">Your food is being prepared.</p>
        <button onClick={() => setOrderSuccess(false)} className="mt-6 text-blue-600 font-medium">Order More</button>
      </div>
    );
  }

  return (
    <div className="relative pb-24">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-100 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900">{tenant.name}</h1>
        <p className="text-gray-500 font-medium">Table {table.tableNumber}</p>
      </div>

      {/* Menu List */}
      <div className="p-4 space-y-8">
        {categories.sort((a: any, b: any) => a.order - b.order).map((cat: any) => (
          <div key={cat.id}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">{cat.name}</h2>
            <div className="space-y-4">
              {dishes.filter((d: any) => d.categoryId === cat.id).map((dish: any) => (
                <div key={dish.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900">{dish.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{dish.description}</p>
                    <p className="font-semibold text-gray-900 mt-2">${dish.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => addToCart(dish)} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4 z-20">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-blue-600/30 flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span>{cart.reduce((s, i) => s + i.quantity, 0)} Items</span>
            </div>
            <span>View Cart • ${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="bg-white max-w-md w-full mx-auto rounded-t-2xl p-6 relative flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Order</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600">Close</button>
            </div>
            
            <div className="flex-1 overflow-auto space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.dishId} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button onClick={() => updateQuantity(item.dishId, -1)} className="p-1 text-gray-600">
                      {item.quantity === 1 ? <Trash2 className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4" />}
                    </button>
                    <span className="font-medium w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.dishId, 1)} className="p-1 text-gray-600">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              disabled={isSubmitting}
              onClick={placeOrder}
              className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-blue-600/30 disabled:opacity-70"
            >
              {isSubmitting ? 'Placing Order...' : `Place Order • ${totalPrice.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}