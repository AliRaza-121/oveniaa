'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function MenuClient({ items, categories, activeCategory, searchTerm: initialSearch }) {
  const [category, setCategory] = useState(activeCategory)
  const [search, setSearch] = useState(initialSearch)
  const [openCategories, setOpenCategories] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (items.length > 0) {
      const cats = [...new Set(items.map(i => i.category))]
      setOpenCategories(cats)
    }
  }, [items])

  const toggleCategory = (cat) => {
    setOpenCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    const params = new URLSearchParams()
    if (cat !== 'All') params.set('category', cat)
    if (search) params.set('search', search)
    router.push(`/menu?${params.toString()}`)
    
    setTimeout(() => {
      const el = document.getElementById(`cat-${cat}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
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
          <h1 className="text-5xl sm:text-7xl font-bold font-display">Our Menu</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sticky top-16 bg-bg py-3 z-30">
          <div className="flex gap-2 flex-wrap justify-center sm:justify-start w-full sm:w-auto">
            <button onClick={() => handleCategoryChange('All')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${category === 'All' ? 'bg-primary text-white' : 'bg-card text-text-light hover:bg-border'}`}>All</button>
            {categories.map(cat => (
              <button key={cat._id} onClick={() => handleCategoryChange(cat.name)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${category === cat.name ? 'bg-primary text-white' : 'bg-card text-text-light hover:bg-border'}`}>{cat.name}</button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-56">
            <input
              type="text" value={search}
              onChange={(e) => { setSearch(e.target.value); setShowSuggestions(e.target.value.length > 0); router.push(`/menu?category=${category}&search=${e.target.value}`) }}
              onFocus={() => setShowSuggestions(search.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search..."
              className="px-4 py-2 rounded-full border border-border bg-card text-text text-sm focus:outline-none focus:border-primary w-full"
            />
            {showSuggestions && search && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                {items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5).map(i => (
                  <Link key={i._id} href={`/menu/${i._id}`} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-bg transition-colors">
                    <span>{i.category === 'Burgers' ? '🍔' : i.category === 'Pizzas' ? '🍕' : i.category === 'Fries & Sides' ? '🍟' : '🥤'}</span>
                    {i.name}
                    <span className="ml-auto text-xs text-text-muted">Rs. {i.price}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-text-muted mb-6">{items.length} items found</p>

        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat} id={`cat-${cat}`}>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                      {catItems.map((item, i) => (
                        <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(i * 0.02, 0.1) }}>
                          <Link href={`/menu/${item._id}`} className="bg-card border border-border rounded-2xl p-4 flex flex-col hover:shadow-md hover:border-primary/30 transition-all group h-full">
                            <div className="w-full h-40 sm:h-48 bg-primary/10 rounded-xl flex items-center justify-center text-4xl sm:text-5xl mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                              {item.image ? (
                                <img src={item.image.replace('/upload/', '/upload/w_400,f_auto,q_auto/')} alt={item.name} className="w-full h-full object-cover rounded-xl" loading="lazy" />
                              ) : (
                                <span>{cat === 'Burgers' ? '🍔' : cat === 'Pizzas' ? '🍕' : cat === 'Fries & Sides' ? '🍟' : '🥤'}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-bold text-sm sm:text-base">{item.name}</h3>
                                {!item.isAvailable && <span className="text-[10px] text-red-500 font-medium bg-red-500/10 px-1.5 py-0.5 rounded-full flex-shrink-0">Sold Out</span>}
                              </div>
                              <p className="text-xs text-text-muted mt-1.5 line-clamp-2">{item.description}</p>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                              <span className="text-primary font-bold sm:text-lg">
                                {item.sizes?.length > 0 && item.sizePrices && Object.keys(item.sizePrices).length > 0
                                  ? `Rs. ${Math.min(...Object.values(item.sizePrices))} - Rs. ${Math.max(...Object.values(item.sizePrices))}`
                                  : `Rs. ${item.price}`}
                              </span>
                              <span className="text-xs text-text-muted group-hover:text-primary transition-colors">View →</span>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl">🍽️</span>
            <p className="text-text-muted mt-4">No items found</p>
            <button onClick={() => { setCategory('All'); setSearch(''); router.push('/menu') }} className="text-primary font-medium mt-2 hover:underline">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  )
}