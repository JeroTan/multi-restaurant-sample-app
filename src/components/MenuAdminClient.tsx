"use client";
import { useEffect, useState } from 'react';
import { Plus, Tag, ChevronRight, LayoutGrid, Coffee } from 'lucide-react';

export default function MenuAdminClient({ tenantId }: { tenantId: string }) {
  const [menu, setMenu] = useState({ categories: [], dishes: [] });
  const [loading, setLoading] = useState(true);
  
  // Forms
  const [catName, setCatName] = useState("");
  const [dishData, setDishData] = useState({ categoryId: "", name: "", price: "", description: "" });

  const fetchMenu = async () => {
    try {
      const res = await fetch(`/api/customer/menu?tenantId=${tenantId}`); 
      const data = await res.json() as any;
      setMenu(data);
      if (data.categories.length > 0 && !dishData.categoryId) {
        setDishData(prev => ({ ...prev, categoryId: data.categories[0].id }));
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, [tenantId]);

  const createCategory = async (e: any) => {
    e.preventDefault();
    await fetch(`/api/admin/menu/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId, name: catName, order: menu.categories.length + 1 })
    });
    setCatName("");
    fetchMenu();
  };

  const createDish = async (e: any) => {
    e.preventDefault();
    await fetch(`/api/admin/menu/dishes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        tenantId, 
        categoryId: dishData.categoryId, 
        name: dishData.name, 
        price: parseFloat(dishData.price), 
        description: dishData.description 
      })
    });
    setDishData({ ...dishData, name: "", price: "", description: "" });
    fetchMenu();
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <h1 className="text-[40px] font-semibold text-near-black tracking-tight mb-12">Menu Engineering</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Col: Management Controls */}
        <div className="space-y-8">
          <div className="bg-pure-white p-8 rounded-lg border border-graphite-border shadow-sm">
            <h2 className="text-[17px] font-semibold text-near-black mb-6 flex items-center gap-2">
              <Tag className="w-4 h-4 text-apple-blue"/> New Category
            </h2>
            <form onSubmit={createCategory} className="space-y-4">
              <input 
                value={catName} 
                onChange={e => setCatName(e.target.value)} 
                required 
                placeholder="Category Name" 
                className="w-full bg-pale-gray border border-graphite-border rounded-md px-4 py-2.5 text-[15px] focus:ring-2 focus:ring-apple-blue/20 transition-all outline-none" 
              />
              <button type="submit" className="w-full bg-near-black text-pure-white rounded-md py-2.5 font-semibold text-[14px] hover:bg-near-black/90 active:scale-95 transition-all">
                Add Category
              </button>
            </form>
          </div>

          <div className="bg-pure-white p-8 rounded-lg border border-graphite-border shadow-sm">
            <h2 className="text-[17px] font-semibold text-near-black mb-6 flex items-center gap-2">
              <Plus className="w-4 h-4 text-apple-blue"/> New Dish
            </h2>
            <form onSubmit={createDish} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-near-black/40 uppercase tracking-widest px-1">Category</label>
                <select 
                  value={dishData.categoryId} 
                  onChange={e => setDishData({...dishData, categoryId: e.target.value})} 
                  className="w-full bg-pale-gray border border-graphite-border rounded-md px-4 py-2.5 text-[15px] outline-none"
                >
                  {menu.categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <input 
                value={dishData.name} 
                onChange={e => setDishData({...dishData, name: e.target.value})} 
                required 
                placeholder="Dish Name" 
                className="w-full bg-pale-gray border border-graphite-border rounded-md px-4 py-2.5 text-[15px] outline-none" 
              />
              <textarea 
                value={dishData.description} 
                onChange={e => setDishData({...dishData, description: e.target.value})} 
                placeholder="Description" 
                className="w-full bg-pale-gray border border-graphite-border rounded-md px-4 py-2.5 text-[15px] outline-none min-h-[100px]" 
              />
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-near-black/40">$</span>
                <input 
                  value={dishData.price} 
                  onChange={e => setDishData({...dishData, price: e.target.value})} 
                  required 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  className="w-full bg-pale-gray border border-graphite-border rounded-md pl-8 pr-4 py-2.5 text-[15px] outline-none" 
                />
              </div>
              <button type="submit" className="w-full bg-apple-blue text-pure-white rounded-md py-3 font-semibold text-[15px] shadow-lg shadow-apple-blue/20 active:scale-95 transition-all">
                Create Dish
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Live Preview */}
        <div className="lg:col-span-2 space-y-10">
          {menu.categories.map((cat: any) => (
            <div key={cat.id} className="bg-pale-gray rounded-lg p-8 border border-graphite-border">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[22px] font-semibold text-near-black">{cat.name}</h3>
                <span className="text-[12px] font-bold text-near-black/30 uppercase tracking-widest">
                  {menu.dishes.filter((d: any) => d.categoryId === cat.id).length} Items
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {menu.dishes.filter((d: any) => d.categoryId === cat.id).map((dish: any) => (
                  <div key={dish.id} className="bg-pure-white p-6 rounded-lg border border-graphite-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-[17px] font-semibold text-near-black mb-1">{dish.name}</h4>
                        <p className="text-[14px] text-near-black/40 line-clamp-1">{dish.description}</p>
                      </div>
                      <span className="text-[15px] font-bold text-apple-blue">${dish.price.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-pale-gray w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
