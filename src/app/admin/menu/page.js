'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '@/context/ToastContext'
import { getCategoryEmoji } from '@/lib/utils'

const emptyForm = {
  name: '', price: '', category: '', description: '',
  isPopular: false, isAvailable: true, image: '',
}

export default function AdminMenu() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [form, setForm] = useState(emptyForm)
  const [customSizes, setCustomSizes] = useState([])
  const [customAddOns, setCustomAddOns] = useState([])
  const [hasSizes, setHasSizes] = useState(false)

  const [uploading, setUploading] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCat, setSelectedCat] = useState('All')
  const { toast } = useToast()

  const fetchItems = async () => { const r = await fetch('/api/menu'); const d = await r.json(); if (d.success) setItems(d.items); setLoading(false) }
  const fetchCategories = async () => { const r = await fetch('/api/categories'); const d = await r.json(); if (d.success) setCategories(d.categories.filter(c => c.status === 'active')) }

  useEffect(() => { fetchItems(); fetchCategories() }, [])

  const openAdd = () => { 
    setForm(emptyForm); 
    setCustomSizes([]);
    setCustomAddOns([]);
    setHasSizes(false);
    setEditingId(null); 
    setShowModal(true) 
  }

  const openEdit = (item) => {
    const sizes = item.sizes || []
    const existingPrices = item.sizePrices || {}
    
    setCustomSizes(sizes.map(s => ({ name: s, price: existingPrices[s] || '' })))
    setHasSizes(sizes.length > 0)
    setCustomAddOns(item.addOns || [])

    setForm({
      name: item.name, price: sizes.length === 0 ? item.price.toString() : '',
      category: item.category, description: item.description || '',
      isPopular: item.isPopular, isAvailable: item.isAvailable, image: item.image || '',
    })
    setEditingId(item._id); 
    setShowModal(true)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true); const fd = new FormData(); fd.append('image', file)
    const r = await fetch('/api/upload', { method: 'POST', body: fd }); const d = await r.json()
    if (d.success) setForm({ ...form, image: d.url }); else toast('Upload failed', 'error')
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.image && !editingId) { toast('Please upload an image', 'error'); return }
    
    const sizes = hasSizes ? customSizes.map(s => s.name.trim()).filter(Boolean) : []
    const price = hasSizes ? 0 : Number(form.price)
    const sizePrices = {}
    if (hasSizes) {
      customSizes.forEach(s => { if (s.name.trim()) sizePrices[s.name.trim()] = Number(s.price) || 0 })
    }
    
    const parsedAddOns = customAddOns.map(a => ({ name: a.name.trim(), price: Number(a.price) || 0 })).filter(a => a.name)

    const body = {
      name: form.name, price, category: form.category, description: form.description,
      isPopular: form.isPopular, isAvailable: form.isAvailable,
      sizes, sizePrices, addOns: parsedAddOns, image: form.image,
    }
    
    const url = editingId ? `/api/menu/${editingId}` : '/api/menu'
    const method = editingId ? 'PUT' : 'POST'
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); const d = await r.json()
    if (d.success) { toast(editingId ? 'Updated' : 'Created', 'success'); setShowModal(false); fetchItems() }
    else toast(d.error || 'Error', 'error')
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    await fetch(`/api/menu/${id}`, { method: 'DELETE' }); toast('Deleted', 'success'); fetchItems()
  }

  const toggleAvailable = async (item) => {
    await fetch(`/api/menu/${item._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isAvailable: !item.isAvailable }) })
    fetchItems()
  }

  const filteredItems = selectedCat === 'All' ? items : items.filter(i => i.category === selectedCat)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Menu Items</h1>
          <p className="text-xs sm:text-sm text-text-muted">{items.length} items</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex bg-card border border-border rounded-full p-1">
            <button onClick={() => setViewMode('grid')} className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-muted'}`}>Grid</button>
            <button onClick={() => setViewMode('table')} className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all ${viewMode === 'table' ? 'bg-primary text-white' : 'text-text-muted'}`}>Table</button>
          </div>
          <button onClick={openAdd} className="bg-primary text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">+ Add</button>
        </div>
      </div>

      <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={() => setSelectedCat('All')} className={`flex-shrink-0 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${selectedCat === 'All' ? 'bg-primary text-white' : 'bg-card text-text-light border border-border hover:text-primary hover:border-primary'}`}>All ({items.length})</button>
        {categories.map(cat => (
          <button key={cat._id} onClick={() => setSelectedCat(cat.name)} className={`flex-shrink-0 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${selectedCat === cat.name ? 'bg-primary text-white' : 'bg-card text-text-light border border-border hover:text-primary hover:border-primary'}`}>
            <span className="text-sm sm:text-lg">{getCategoryEmoji(cat.name)}</span> {cat.name} <span className="text-[10px] opacity-70">({items.filter(i => i.category === cat.name).length})</span>
          </button>
        ))}
      </div>

      {loading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[1,2,3,4].map(i => <div key={i} className="animate-pulse h-64 bg-card rounded-2xl border border-border" />)}
          </div>
        ) : (
          <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="animate-pulse h-14 bg-card rounded-xl border border-border" />)}</div>
        )
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredItems.map((item, i) => (
            <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/30 hover:shadow-lg transition-all flex flex-col">
              <div className="relative w-full aspect-square bg-primary/5 flex items-center justify-center text-4xl sm:text-5xl overflow-hidden">
                {item.image ? <img src={item.image.replace('/upload/', '/upload/w_500,h_500,c_fill,g_auto,f_auto,q_auto/')} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /> : <span>{getCategoryEmoji(item.category)}</span>}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex gap-1 sm:gap-1.5 z-10">
                  {item.isPopular && <span className="bg-secondary text-bg-dark text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full">⭐ Popular</span>}
                </div>
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                  <button onClick={(e) => { e.preventDefault(); toggleAvailable(item) }} className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full transition-all ${item.isAvailable ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>{item.isAvailable ? 'Available' : 'Sold Out'}</button>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <span className="text-[9px] sm:text-[10px] text-text-muted uppercase tracking-widest">{item.category}</span>
                <h3 className="font-bold text-text mt-1 text-sm truncate">{item.name}</h3>
                <p className="text-[10px] sm:text-xs text-text-muted mt-1 line-clamp-2">{item.description}</p>
                <div className="mt-2 sm:mt-3">
                  {item.sizes?.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {item.sizes.map(size => (
                        <span key={size} className="text-[9px] sm:text-[10px] bg-bg px-1.5 sm:px-2 py-0.5 rounded-full text-text-muted">{size}: <span className="text-primary font-semibold">Rs. {item.sizePrices?.[size] || item.price}</span></span>
                      ))}
                    </div>
                  ) : <p className="text-primary font-bold text-sm">Rs. {item.price}</p>}
                </div>
                <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-border">
                  <button onClick={() => openEdit(item)} className="text-[10px] sm:text-xs text-primary hover:underline font-medium">Edit</button>
                  <button onClick={() => handleDelete(item._id, item.name)} className="text-[10px] sm:text-xs text-red-500 hover:underline font-medium">Delete</button>
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/menu/${item._id}`); toast('Link copied!', 'success') }} className="text-[10px] sm:text-xs text-text-muted hover:text-text ml-auto">🔗</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto bg-card border border-border rounded-2xl">
          <table className="w-full text-left">
            <thead><tr className="border-b border-border"><th className="py-2 sm:py-3 px-3 sm:px-4 text-[10px] sm:text-xs font-medium">Item</th><th className="py-2 sm:py-3 px-3 sm:px-4 text-[10px] sm:text-xs font-medium hidden sm:table-cell">Category</th><th className="py-2 sm:py-3 px-3 sm:px-4 text-[10px] sm:text-xs font-medium">Price</th><th className="py-2 sm:py-3 px-3 sm:px-4 text-[10px] sm:text-xs font-medium hidden lg:table-cell">Available</th><th className="py-2 sm:py-3 px-3 sm:px-4 text-[10px] sm:text-xs font-medium">Actions</th></tr></thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item._id} className="border-b border-border/50 hover:bg-bg/50">
                  <td className="py-2 sm:py-3 px-3 sm:px-4"><div className="flex items-center gap-2"><div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center text-xs sm:text-sm">{item.image ? <img src={item.image.replace('/upload/', '/upload/w_100,h_100,c_fill,g_auto,f_auto,q_auto/')} alt="" className="w-full h-full object-cover rounded-lg" /> : <span>{getCategoryEmoji(item.category)}</span>}</div><span className="text-xs sm:text-sm font-medium truncate max-w-[100px] sm:max-w-[150px]">{item.name}</span></div></td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4 hidden sm:table-cell text-xs sm:text-sm text-text-muted">{item.category}</td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold text-primary">{item.sizes?.length > 0 ? `Rs. ${Math.min(...Object.values(item.sizePrices || {}))} - Rs. ${Math.max(...Object.values(item.sizePrices || {}))}` : `Rs. ${item.price}`}</td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4 hidden lg:table-cell">
                    {/* Inline Available Toggle in Table */}
                    <button onClick={() => toggleAvailable(item)} className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${item.isAvailable ? 'bg-emerald-500' : 'bg-gray-500'}`}>
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${item.isAvailable ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                    </button>
                  </td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4"><div className="flex gap-1.5 sm:gap-2"><button onClick={() => openEdit(item)} className="text-[10px] sm:text-xs text-primary hover:underline">Edit</button><button onClick={() => handleDelete(item._id, item.name)} className="text-[10px] sm:text-xs text-red-500 hover:underline">Del</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="border-b border-border px-5 sm:px-6 py-3 sm:py-4 flex justify-between sticky top-0 bg-card z-10"><h2 className="font-bold text-sm sm:text-base">{editingId ? 'Edit' : 'Add'} Item</h2><button onClick={() => setShowModal(false)} className="text-text-muted text-lg sm:text-xl">✕</button></div>
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-text mb-1">Item Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g. Mighty Burger" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-text focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-text mb-1">Category *</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} required className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-text focus:outline-none focus:border-primary">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Dynamic Pricing Logic */}
              <div className="bg-bg/50 border border-border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-[10px] sm:text-xs font-semibold text-text">Pricing & Sizes</label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input type="checkbox" checked={hasSizes} onChange={e => setHasSizes(e.target.checked)} className="accent-primary" />
                    Has Multiple Sizes?
                  </label>
                </div>

                {!hasSizes ? (
                  <div>
                    <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required placeholder="Base Price (Rs.) *" className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-text focus:outline-none focus:border-primary" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customSizes.map((size, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input type="text" value={size.name} onChange={e => { const newSizes = [...customSizes]; newSizes[idx].name = e.target.value; setCustomSizes(newSizes) }} placeholder="Size (e.g. Large) *" required className="flex-1 bg-card border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-text focus:outline-none focus:border-primary" />
                        <input type="number" value={size.price} onChange={e => { const newSizes = [...customSizes]; newSizes[idx].price = e.target.value; setCustomSizes(newSizes) }} placeholder="Price *" required className="w-24 sm:w-32 bg-card border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-text focus:outline-none focus:border-primary" />
                        <button type="button" onClick={() => setCustomSizes(customSizes.filter((_, i) => i !== idx))} className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors">✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setCustomSizes([...customSizes, { name: '', price: '' }])} className="w-full py-2 border border-dashed border-border rounded-xl text-xs sm:text-sm text-text-muted hover:text-primary hover:border-primary transition-colors">+ Add Size Option</button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-text mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the ingredients..." rows={2} className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-text resize-none focus:outline-none focus:border-primary" />
              </div>
              
              {/* Dynamic Add-ons Logic */}
              <div className="bg-bg/50 border border-border rounded-2xl p-4">
                <label className="block text-[10px] sm:text-xs font-semibold text-text mb-3">Extras & Add-ons (Optional)</label>
                <div className="space-y-3">
                  {customAddOns.map((addon, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input type="text" value={addon.name} onChange={e => { const newAddOns = [...customAddOns]; newAddOns[idx].name = e.target.value; setCustomAddOns(newAddOns) }} placeholder="Extra (e.g. Cheese)" required className="flex-1 bg-card border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-text focus:outline-none focus:border-primary" />
                      <input type="number" value={addon.price} onChange={e => { const newAddOns = [...customAddOns]; newAddOns[idx].price = e.target.value; setCustomAddOns(newAddOns) }} placeholder="Price" required className="w-24 sm:w-32 bg-card border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-text focus:outline-none focus:border-primary" />
                      <button type="button" onClick={() => setCustomAddOns(customAddOns.filter((_, i) => i !== idx))} className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors">✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setCustomAddOns([...customAddOns, { name: '', price: '' }])} className="w-full py-2 border border-dashed border-border rounded-xl text-xs sm:text-sm text-text-muted hover:text-primary hover:border-primary transition-colors">+ Add Extra Option</button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-text mb-1">Image {!editingId && '*'}</label>
                <div className="flex items-center gap-4">
                  {form.image && <img src={form.image.replace('/upload/', '/upload/w_150,h_150,c_fill,g_auto,f_auto,q_auto/')} alt="" className="h-16 aspect-square object-cover rounded-xl border border-border" />}
                  <div className="flex-1">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-xs sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                    {uploading && <p className="text-[10px] sm:text-xs text-primary mt-2">Uploading image...</p>}
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isPopular} onChange={e => setForm({...form, isPopular: e.target.checked})} className="accent-primary w-4 h-4" /><span className="text-sm font-medium">Mark as Popular ⭐</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isAvailable} onChange={e => setForm({...form, isAvailable: e.target.checked})} className="accent-primary w-4 h-4" /><span className="text-sm font-medium">In Stock</span></label>
              </div>

              <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-full font-bold text-sm hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 mt-4">{editingId ? 'Update Menu Item' : 'Publish Item'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}