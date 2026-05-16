'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function MenuClient({ items, categories, activeCategory, searchTerm: initialSearch }) {
  const [category, setCategory] = useState(activeCategory)
  const [search, setSearch] = useState(initialSearch)
  const [openCategories, setOpenCategories] = useState([])
  const router = useRouter()

  useEffect(() => {
    if (items && items.length > 0) {
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
  }

  const grouped = {}
  if (items && items.length > 0) {
    items.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = []
      grouped[item.category].push(item)
    })
  }

  return (
    <div className="pt-20 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-hidden">
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-7xl font-bold font-display">Our Menu</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sticky top-16 bg-bg py-3 z-30">
          <div className="flex gap-2 flex-wrap justify-center sm:justify-start w-full sm:w-auto max-w-full">
            <button onClick={() => handleCategoryChange('All')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${category === 'All' ? 'bg-primary text-white' : 'bg-card text-text-light hover:bg-border'}`}>All</button>
            {categories.map(cat => (
              <button key={cat._id} onClick={() => handleCategoryChange(cat.name)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${category === cat.name ? 'bg-primary text-white' : 'bg-card text-text-light hover:bg-border'}`}>{cat.name}</button>
            ))}
          </div>
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); router.push(`/menu?category=${category}&search=${e.target.value}`) }} placeholder="Search..." className="px-4 py-2 rounded-full border border-border bg-card text-text text-sm focus:outline-none focus:border-primary w-full sm:w-48" />
        </div>

        <p className="text-sm text-text-muted mb-6">{items.length} items found</p>

        <div className="space-y-6 w-full">
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat} className="w-full max-w-full">
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
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden w-full max-w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 w-full max-w-full">
                      {catItems.map((item, i) => (
                        <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(i * 0.02, 0.1) }} className="w-full max-w-full">
                          <Link href={`/menu/${item._id}`} className="bg-card border border-border rounded-2xl p-4 flex flex-col hover:shadow-md hover:border-primary/30 transition-all group h-full w-full max-w-full overflow-hidden">
                            <div className="w-full h-40 sm:h-48 bg-primary/10 rounded-xl flex items-center justify-center text-4xl sm:text-5xl mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                              {item.image ? (
                                <img src={item.image.replace('/upload/', '/upload/w_400,f_auto,q_auto/')} alt={item.name} className="w-full h-full object-cover rounded-xl" loading="lazy" />
                              ) : (
                                <span>{cat === 'Burgers' ? '🍔' : cat === 'Pizzas' ? '🍕' : cat === 'Fries & Sides' ? '🍟' : '🥤'}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-bold text-sm sm:text-base truncate">{item.name}</h3>
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
                              <span className="text-xs text-text-muted group-hover:text-primary transition-colors flex-shrink-0">View →</span>
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

        {(!items || items.length === 0) && (
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