"use client";
import { useEffect, useState } from 'react';
import { Plus, Tag } from 'lucide-react';

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
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Menu Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Forms */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Tag className="w-5 h-5"/> New Category</h2>
            <form onSubmit={createCategory} className="space-y-4">
              <input value={catName} onChange={e => setCatName(e.target.value)} required placeholder="Category Name (e.g. Drinks)" className="w-full border border-gray-300 rounded-lg p-2" />
              <button type="submit" className="w-full bg-gray-900 text-white rounded-lg py-2 font-medium hover:bg-gray-800">Add Category</button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Plus className="w-5 h-5"/> New Dish</h2>
            <form onSubmit={createDish} className="space-y-4">
              <select value={dishData.categoryId} onChange={e => setDishData({...dishData, categoryId: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2">
                {menu.categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input value={dishData.name} onChange={e => setDishData({...dishData, name: e.target.value})} required placeholder="Dish Name" className="w-full border border-gray-300 rounded-lg p-2" />
              <input value={dishData.description} onChange={e => setDishData({...dishData, description: e.target.value})} placeholder="Description" className="w-full border border-gray-300 rounded-lg p-2" />
              <input value={dishData.price} onChange={e => setDishData({...dishData, price: e.target.value})} required type="number" step="0.01" placeholder="Price ($)" className="w-full border border-gray-300 rounded-lg p-2" />
              <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700">Add Dish</button>
            </form>
          </div>
        </div>

        {/* Right Col: Menu Preview */}
        <div className="lg:col-span-2 space-y-6">
          {menu.categories.map((cat: any) => (
            <div key={cat.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{cat.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {menu.dishes.filter((d: any) => d.categoryId === cat.id).map((dish: any) => (
                  <div key={dish.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">{dish.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{dish.description}</p>
                      </div>
                      <span className="font-semibold text-blue-600">${dish.price.toFixed(2)}</span>
                    </div>
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