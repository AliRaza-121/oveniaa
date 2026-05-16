'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function MenuClient({ items, categories, activeCategory, searchTerm: initialSearch }) {
  const [category, setCategory] = useState(activeCategory)
  const [search, setSearch] = useState(initialSearch)
  const [openCategories, setOpenCategories] = useState([])

useEffect(() => {
  if (items.length > 0) {
    const cats = [...new Set(items.map(i => i.category))]
    setOpenCategories(cats)
  }
}, [items])
  const router = useRouter()

  const toggleCategory = (cat) => {
    setOpenCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    const params = new URLSearchParams()
    if (cat !== 'All') params.set('category', cat)
    if (search) params.set('search', search)
    router.push(`/menu?${params.toString()}`)
  }

  const grouped = {}
  items.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = []
    grouped[item.category].push(item)
  })

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black font-display">Our Menu</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sticky top-16 bg-bg py-3 z-30">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => handleCategoryChange('All')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${category === 'All' ? 'bg-primary text-white' : 'bg-card text-text-light hover:bg-border'}`}>All</button>
            {categories.map(cat => (
              <button key={cat._id} onClick={() => handleCategoryChange(cat.name)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${category === cat.name ? 'bg-primary text-white' : 'bg-card text-text-light hover:bg-border'}`}>{cat.name}</button>
            ))}
          </div>
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); router.push(`/menu?category=${category}&search=${e.target.value}`) }} placeholder="Search..." className="px-4 py-2 rounded-full border border-border bg-card text-text text-sm focus:outline-none focus:border-primary w-full sm:w-48" />
        </div>

        <p className="text-sm text-text-muted mb-6">{items.length} items found</p>

        {/* Accordion Menu */}
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat}>
              <button onClick={() => toggleCategory(cat)} className="w-full flex items-center gap-3 text-left mb-4">
                <span className="text-xl">{cat === 'Burgers' ? '🍔' : cat === 'Pizzas' ? '🍕' : cat === 'Fries & Sides' ? '🍟' : '🥤'}</span>
                <h2 className="text-xl font-bold font-display">{cat}</h2>
                <span className="text-sm text-text-muted">({catItems.length})</span>
                <motion.svg animate={{ rotate: openCategories.includes(cat) ? 180 : 0 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-auto text-text-muted">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </motion.svg>
              </button>

              <AnimatePresence>
                {openCategories.includes(cat) && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                      {catItems.map(item => (
                        <Link key={item._id} href={`/menu/${item._id}`} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md hover:border-primary/30 transition-all group">
                          <div className="w-full h-40 bg-primary/10 rounded-xl flex items-center justify-center text-4xl mb-3 group-hover:scale-105 transition-transform">
                          {item.image ? (
  <img 
    src={item.image.replace('/upload/', '/upload/w_400,f_auto,q_auto/')} 
    alt="" 
    className="w-full h-full object-cover rounded-xl" 
    loading="lazy"
  />
) : (
  <span>{item.category === 'Burgers' ? '🍔' : item.category === 'Pizzas' ? '🍕' : item.category === 'Fries & Sides' ? '🍟' : '🥤'}</span>
)}
                          </div>
                          <h3 className="font-bold text-sm">{item.name}</h3>
                          <p className="text-xs text-text-muted mt-1 line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-primary font-bold">Rs. {item.price}</span>
                            {!item.isAvailable && <span className="text-xs text-red-500 font-medium">Sold Out</span>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}