"use client";
import { useEffect, useState, useCallback } from 'react';
import { Plus, Tag, ChevronRight, LayoutGrid, Coffee, Edit3, Trash2, X, AlertCircle } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
  useDroppable,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface Dish {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
}

interface Category {
  id: string;
  name: string;
  order: number;
}

// --- DRAGGABLE DISH CARD ---
const DraggableDishCard = ({ dish, onEdit, onDelete }: { dish: Dish; onEdit: (d: Dish) => void; onDelete: (id: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: dish.id,
    data: dish,
  });

  const style = {
    transform: isDragging ? undefined : CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-pure-white p-6 rounded-lg border border-graphite-border shadow-sm hover:shadow-md transition-shadow group relative ${isDragging ? 'z-50 ring-2 ring-apple-blue' : ''}`}
    >
      {/* Drag Handle Area */}
      <div {...listeners} className="absolute inset-0 cursor-grab active:cursor-grabbing z-0" title="Drag to reorder/move" />

      <div className="flex gap-4 mb-4 relative z-10 pointer-events-none">
        {dish.imageUrl && (
          <img src={dish.imageUrl} alt={dish.name} className="w-16 h-16 rounded-md object-cover shrink-0 border border-pale-gray" />
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-[17px] font-semibold text-near-black mb-1">{dish.name}</h4>
            <span className="text-[15px] font-bold text-apple-blue">${dish.price.toFixed(2)}</span>
          </div>
          <p className="text-[14px] text-near-black/40 line-clamp-2">{dish.description}</p>
        </div>
      </div>

      <div className="h-px bg-pale-gray w-full mb-4 relative z-10 pointer-events-none" />

      {/* Actions */}
      <div className="flex justify-end gap-3 relative z-10">
        <button 
          onClick={() => onEdit(dish)}
          className="p-2 hover:bg-apple-blue/10 rounded-full transition-colors text-near-black/30 hover:text-apple-blue"
          title="Edit Dish"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(dish.id)}
          className="p-2 hover:bg-red-50 rounded-full transition-colors text-near-black/30 hover:text-red-500"
          title="Delete Dish"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// --- DROPPABLE CATEGORY SECTION ---
const DroppableCategory = ({ 
  cat, 
  dishes, 
  onEdit, 
  onDelete, 
  onEditCat, 
  onDeleteCat 
}: { 
  cat: Category; 
  dishes: Dish[]; 
  onEdit: (d: Dish) => void; 
  onDelete: (id: string) => void;
  onEditCat: (c: Category) => void;
  onDeleteCat: (id: string) => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: cat.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-pale-gray rounded-lg p-8 border transition-all duration-200 ${
        isOver ? 'bg-apple-blue/5 border-apple-blue ring-4 ring-apple-blue/10' : 'border-graphite-border'
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h3 className="text-[22px] font-semibold text-near-black">{cat.name}</h3>
          <div className="flex gap-1">
            <button 
              onClick={() => onEditCat(cat)}
              className="p-1.5 hover:bg-near-black/5 rounded-full transition-colors text-near-black/20 hover:text-near-black/60"
              title="Edit Category"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => onDeleteCat(cat.id)}
              className="p-1.5 hover:bg-red-50 rounded-full transition-colors text-near-black/20 hover:text-red-400"
              title="Delete Category"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <span className="text-[12px] font-bold text-near-black/30 uppercase tracking-widest">
          {dishes.length} Items
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-h-[100px]">
        {dishes.map((dish) => (
          <DraggableDishCard key={dish.id} dish={dish} onEdit={onEdit} onDelete={onDelete} />
        ))}
        {dishes.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-near-black/10 rounded-lg text-near-black/30 italic text-[14px]">
            No items in this category. Drag dishes here to move them.
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function MenuAdminClient({ tenantId }: { tenantId: string }) {
  const [menu, setMenu] = useState<{ categories: Category[]; dishes: Dish[] }>({ categories: [], dishes: [] });
  const [loading, setLoading] = useState(true);
  
  // Create Form State
  const [catName, setCatName] = useState("");
  const [dishData, setDishData] = useState({ categoryId: "", name: "", price: "", description: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Edit/Delete States (Dish)
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [dishToDelete, setDishToDelete] = useState<string | null>(null);
  
  // Edit/Delete States (Category)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const [activeDragDish, setActiveDragDish] = useState<Dish | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const fetchMenu = useCallback(async () => {
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
  }, [tenantId, dishData.categoryId]);

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

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
    let finalImageUrl = "";
    setIsUploading(true);

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('tenantId', tenantId);
      try {
        const res = await fetch('/api/admin/menu/upload', { method: 'POST', body: formData });
        const data = await res.json() as any;
        if (data.url) finalImageUrl = data.url;
      } catch (err) {
        console.error('Upload failed:', err);
        setIsUploading(false);
        return;
      }
    }

    await fetch(`/api/admin/menu/dishes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        tenantId, 
        categoryId: dishData.categoryId, 
        name: dishData.name, 
        price: parseFloat(dishData.price), 
        description: dishData.description,
        imageUrl: finalImageUrl
      })
    });
    
    setDishData({ ...dishData, name: "", price: "", description: "" });
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setIsUploading(false);
    fetchMenu();
  };

  const handleUpdateDish = async (e: any) => {
    e.preventDefault();
    if (!editingDish) return;
    setIsUploading(true);

    await fetch(`/api/admin/menu/dishes/${editingDish.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId,
        categoryId: editingDish.categoryId,
        name: editingDish.name,
        price: editingDish.price,
        description: editingDish.description,
      })
    });

    setEditingDish(null);
    setIsUploading(false);
    fetchMenu();
  };

  const handleDeleteDish = async () => {
    if (!dishToDelete) return;
    await fetch(`/api/admin/menu/dishes/${dishToDelete}?tenantId=${tenantId}`, {
      method: 'DELETE'
    });
    setDishToDelete(null);
    fetchMenu();
  };

  const handleUpdateCategory = async (e: any) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    await fetch(`/api/admin/menu/categories/${editingCategory.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId,
        name: editingCategory.name,
      })
    });

    setEditingCategory(null);
    fetchMenu();
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    await fetch(`/api/admin/menu/categories/${categoryToDelete}?tenantId=${tenantId}`, {
      method: 'DELETE'
    });
    setCategoryToDelete(null);
    fetchMenu();
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragDish(event.active.data.current as Dish);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragDish(null);

    if (over && active.id !== over.id) {
      const newCategoryId = over.id as string;
      const dish = active.data.current as Dish;

      if (dish.categoryId !== newCategoryId) {
        // Optimistic UI Update
        setMenu(prev => ({
          ...prev,
          dishes: prev.dishes.map(d => d.id === dish.id ? { ...d, categoryId: newCategoryId } : d)
        }));

        // Persist to DB
        await fetch(`/api/admin/menu/dishes/${dish.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenantId, categoryId: newCategoryId })
        });
        
        fetchMenu();
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-[40px] font-semibold text-near-black tracking-tight mb-12">Menu Management</h1>
        
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

                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-near-black/40 uppercase tracking-widest px-1">Dish Image</label>
                  <div className="flex items-center gap-4">
                    {previewUrl && (
                      <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded-md object-cover border border-graphite-border" />
                    )}
                    <input 
                      type="file" 
                      onChange={handleFileSelection}
                      accept="image/*"
                      className="text-[12px] text-near-black/60 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[12px] file:font-semibold file:bg-pale-gray file:text-apple-blue hover:file:bg-apple-blue/10 cursor-pointer"
                    />
                  </div>
                  {isUploading && <p className="text-[10px] text-apple-blue animate-pulse">Processing asset and saving dish...</p>}
                </div>

                <button type="submit" disabled={isUploading} className="w-full bg-apple-blue text-pure-white rounded-md py-3 font-semibold text-[15px] shadow-lg shadow-apple-blue/20 active:scale-95 transition-all disabled:opacity-50">
                  {isUploading ? 'Saving...' : 'Create Dish'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Col: Live Preview */}
          <div className="lg:col-span-2 space-y-10">
            {menu.categories.map((cat) => (
              <DroppableCategory 
                key={cat.id} 
                cat={cat} 
                dishes={menu.dishes.filter(d => d.categoryId === cat.id)} 
                onEdit={setEditingDish}
                onDelete={setDishToDelete}
                onEditCat={setEditingCategory}
                onDeleteCat={setCategoryToDelete}
              />
            ))}
          </div>
        </div>
      </div>

      {/* --- DISH EDIT MODAL --- */}
      {editingDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-near-black/60 backdrop-blur-md" onClick={() => setEditingDish(null)} />
          <div className="bg-pure-white w-full max-w-lg rounded-[24px] p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[24px] font-semibold text-near-black">Edit Menu Item</h2>
              <button onClick={() => setEditingDish(null)} className="p-2 hover:bg-pale-gray rounded-full transition-colors">
                <X className="w-6 h-6 text-near-black/40" />
              </button>
            </div>

            <form onSubmit={handleUpdateDish} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-near-black/40 uppercase tracking-widest px-1">Category</label>
                <select 
                  value={editingDish.categoryId} 
                  onChange={e => setEditingDish({...editingDish, categoryId: e.target.value})} 
                  className="w-full bg-pale-gray border border-graphite-border rounded-md px-4 py-2.5 text-[15px] outline-none"
                >
                  {menu.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <input 
                value={editingDish.name} 
                onChange={e => setEditingDish({...editingDish, name: e.target.value})} 
                required 
                placeholder="Dish Name" 
                className="w-full bg-pale-gray border border-graphite-border rounded-md px-4 py-2.5 text-[15px] outline-none" 
              />
              <textarea 
                value={editingDish.description || ""} 
                onChange={e => setEditingDish({...editingDish, description: e.target.value})} 
                placeholder="Description" 
                className="w-full bg-pale-gray border border-graphite-border rounded-md px-4 py-2.5 text-[15px] outline-none min-h-[100px]" 
              />
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-near-black/40">$</span>
                <input 
                  value={editingDish.price} 
                  onChange={e => setEditingDish({...editingDish, price: parseFloat(e.target.value) || 0})} 
                  required 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  className="w-full bg-pale-gray border border-graphite-border rounded-md pl-8 pr-4 py-2.5 text-[15px] outline-none" 
                />
              </div>

              <button type="submit" disabled={isUploading} className="w-full bg-near-black text-pure-white py-4 rounded-lg font-bold text-[17px] active:scale-95 transition-all disabled:opacity-50">
                {isUploading ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- CATEGORY EDIT MODAL --- */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-near-black/60 backdrop-blur-md" onClick={() => setEditingCategory(null)} />
          <div className="bg-pure-white w-full max-w-md rounded-[24px] p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[24px] font-semibold text-near-black">Edit Category</h2>
              <button onClick={() => setEditingCategory(null)} className="p-2 hover:bg-pale-gray rounded-full transition-colors">
                <X className="w-6 h-6 text-near-black/40" />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-6">
              <input 
                value={editingCategory.name} 
                onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} 
                required 
                placeholder="Category Name" 
                className="w-full bg-pale-gray border border-graphite-border rounded-md px-4 py-2.5 text-[15px] outline-none" 
              />
              <button type="submit" className="w-full bg-near-black text-pure-white py-4 rounded-lg font-bold text-[17px] active:scale-95 transition-all">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- DISH DELETE CONFIRMATION --- */}
      {dishToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-near-black/20 backdrop-blur-sm" onClick={() => setDishToDelete(null)} />
          <div className="bg-pure-white w-full max-w-sm rounded-[24px] p-8 relative shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-[20px] font-semibold text-near-black mb-2">Delete Dish?</h2>
              <p className="text-[15px] text-near-black/40 mb-8">This action is permanent and cannot be undone.</p>
              
              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={handleDeleteDish}
                  className="w-full bg-red-500 text-pure-white py-3 rounded-md font-semibold text-[15px] active:scale-95 transition-all"
                >
                  Delete Item
                </button>
                <button 
                  onClick={() => setDishToDelete(null)}
                  className="w-full bg-pale-gray text-near-black py-3 rounded-md font-semibold text-[15px] active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CATEGORY DELETE CONFIRMATION --- */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-near-black/20 backdrop-blur-sm" onClick={() => setCategoryToDelete(null)} />
          <div className="bg-pure-white w-full max-w-sm rounded-[24px] p-8 relative shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-[20px] font-semibold text-near-black mb-2">Delete Category?</h2>
              <p className="text-[15px] text-near-black/40 mb-8">All dishes in this category will also be removed. This cannot be undone.</p>
              
              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={handleDeleteCategory}
                  className="w-full bg-red-500 text-pure-white py-3 rounded-md font-semibold text-[15px] active:scale-95 transition-all"
                >
                  Delete Category & Items
                </button>
                <button 
                  onClick={() => setCategoryToDelete(null)}
                  className="w-full bg-pale-gray text-near-black py-3 rounded-md font-semibold text-[15px] active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
      }}>
        {activeDragDish ? (
          <div className="bg-pure-white p-6 rounded-lg border border-apple-blue shadow-2xl scale-105 cursor-grabbing opacity-90 w-[300px]">
             <div className="flex gap-4">
              {activeDragDish.imageUrl && (
                <img src={activeDragDish.imageUrl} alt={activeDragDish.name} className="w-12 h-12 rounded-md object-cover" />
              )}
              <div>
                <h4 className="text-[15px] font-semibold text-near-black">{activeDragDish.name}</h4>
                <p className="text-[13px] font-bold text-apple-blue">${activeDragDish.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
