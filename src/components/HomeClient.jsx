'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function HomeClient({ popularItems, categories, deals, stats }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-bg pt-24 sm:pt-28">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div animate={{ x: [0, 80, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 18, ease: 'linear' }} className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <motion.div animate={{ x: [0, -60, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 22, ease: 'linear' }} className="absolute -bottom-32 -left-20 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
        </div>

        <motion.div animate={{ y: [0, -25, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }} className="absolute top-24 right-[15%] text-5xl sm:text-7xl opacity-20 select-none hidden sm:block">🍕</motion.div>
        <motion.div animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }} className="absolute bottom-32 left-[10%] text-4xl sm:text-6xl opacity-20 select-none hidden sm:block">🍔</motion.div>
        <motion.div animate={{ y: [0, -15, 0], x: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }} className="absolute top-1/2 left-[5%] text-3xl sm:text-5xl opacity-10 select-none hidden sm:block">🍟</motion.div>
        <motion.div animate={{ y: [0, 25, 0], rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }} className="absolute top-1/3 right-[8%] text-4xl sm:text-6xl opacity-10 select-none hidden sm:block">🥤</motion.div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-5 py-2.5 rounded-full mb-10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            HOT & FRESH • DELIVERING NOW 🛵
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-7xl lg:text-8xl font-bold text-text leading-[0.95] tracking-tight">
            FOOD THAT{' '}
            <span className="relative inline-block">
              <motion.span animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ repeat: Infinity, duration: 3 }} className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] bg-clip-text text-transparent">SPEAKS</motion.span>
            </span>
            <br />FOR ITSELF
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="text-text-muted text-base sm:text-lg mt-8 max-w-xl mx-auto leading-relaxed">
            Fresh ingredients. Bold flavors. Delivered hot to your door in{' '}
            <span className="text-primary font-semibold">30 minutes or less</span>. That is the Oveniaa promise.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex gap-4 justify-center mt-10 flex-wrap">
            <div className="flex gap-3 flex-wrap">
              <Link href="/menu" className="bg-primary text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-primary-dark transition-all hover:scale-105 shadow-xl shadow-primary/30 inline-flex items-center gap-2">Order Online<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></Link>
              <a href="https://wa.me/923248034267?text=Hi%20Oveniaa!%20I%20want%20to%20place%20an%20order." target="_blank" rel="noopener noreferrer" aria-label="Order on WhatsApp" className="bg-emerald-500 text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-emerald-600 transition-all hover:scale-105 shadow-xl shadow-emerald-500/30 inline-flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>WhatsApp</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="flex justify-center gap-8 sm:gap-12 mt-14">
            <div className="text-center"><p className="text-3xl sm:text-4xl font-bold">{stats.menuCount}+</p><p className="text-xs sm:text-sm text-text-muted mt-1">Menu Items</p></div>
            <div className="text-center"><p className="text-3xl sm:text-4xl font-bold">{stats.avgRating} ⭐</p><p className="text-xs sm:text-sm text-text-muted mt-1">Rating</p></div>
            <div className="text-center"><p className="text-3xl sm:text-4xl font-bold">{stats.deliveryTime}</p><p className="text-xs sm:text-sm text-text-muted mt-1">Delivery</p></div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:block">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-5 h-8 rounded-full border-2 border-border flex items-start justify-center pt-1.5">
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1 h-2 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Daily Deals */}
      {deals && deals.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="inline-flex items-center gap-2 bg-secondary/20 text-secondary text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" /></span>
                LIMITED TIME OFFERS
              </motion.div>
              <h2 className="text-3xl sm:text-5xl font-bold">Today's <span className="text-primary relative">Hottest<svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg></span> Deals</h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal, i) => (
                <motion.div key={deal._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }}>
                  <Link href={`/deals/${deal._id}`} className={`block bg-gradient-to-br ${deal.backgroundColor || 'from-primary/20 to-secondary/10'} border border-border rounded-3xl p-6 hover:shadow-2xl transition-all group relative overflow-hidden h-full`}>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                    <div className="absolute top-5 right-5 z-10">
                      <div className="relative">
                        <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }} className="bg-primary text-white text-xs font-black px-4 py-2 rounded-full shadow-lg">{deal.discount || 'DEAL'}</motion.div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45" />
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl mb-4">⚡</div>
                    <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">{deal.title}</h3>
                    {deal.description && <p className="text-text-muted text-sm mb-4 line-clamp-2">{deal.description}</p>}
                    {deal.items?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {deal.items.slice(0, 3).map((item, j) => (
                          <span key={j} className="text-xs bg-white/20 backdrop-blur-sm text-text px-2 py-1 rounded-full font-medium">{item.name || 'Item'}</span>
                        ))}
                        {deal.items.length > 3 && <span className="text-xs bg-white/20 backdrop-blur-sm text-text px-2 py-1 rounded-full font-medium">+{deal.items.length - 3} more</span>}
                      </div>
                    )}
                    <div className="flex items-end justify-between mt-auto pt-4 border-t border-white/10">
                      <div>
                        {deal.price > 0 && <span className="text-2xl font-black text-primary">Rs. {deal.price}</span>}
                        {deal.originalPrice > 0 && <span className="text-sm text-text-muted line-through ml-2">Rs. {deal.originalPrice}</span>}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Row */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide sm:justify-center sm:gap-3">
            {categories.map(cat => (
              <Link key={cat._id} href={`/menu?category=${encodeURIComponent(cat.name)}`} className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-text-light hover:text-primary hover:border-primary whitespace-nowrap transition-all flex-shrink-0">
                <span className="text-sm sm:text-lg">{cat.name === 'Burgers' ? '🍔' : cat.name === 'Pizzas' ? '🍕' : cat.name === 'Fries & Sides' ? '🍟' : '🥤'}</span>{cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured + Popular Scroll */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {popularItems.length > 0 ? (
            <>
              <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-5xl sm:text-7xl font-bold mb-8">
                Popular{' '}
                <span className="text-primary relative">Picks<svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg></span>
              </motion.h2>
              {popularItems[0] && (
                <Link href={`/menu/${popularItems[0]._id}`} className="block bg-primary/10 rounded-3xl p-6 sm:p-8 mb-6 hover:bg-primary/20 transition-colors">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-card rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 relative overflow-hidden">
                      {popularItems[0].image ? <Image src={popularItems[0].image.replace('/upload/', '/upload/w_400,h_400,c_fill,g_auto,f_auto,q_auto/')} alt={popularItems[0].name} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" priority={true} /> : <span>🍔</span>}
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <span className="text-primary text-xs font-bold uppercase tracking-widest">Most Popular</span>
                      <h3 className="text-3xl sm:text-4xl font-bold mt-1">{popularItems[0].name}</h3>
                      <p className="text-text-muted text-sm mt-2">{popularItems[0].description}</p>
                      <p className="text-primary font-bold text-2xl mt-3">Rs. {popularItems[0].price}</p>
                    </div>
                  </div>
                </Link>
              )}
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:grid sm:grid-cols-4 sm:overflow-visible sm:snap-none sm:pb-0">
                {popularItems.slice(1).map(item => (
                  <Link key={item._id} href={`/menu/${item._id}`} className="min-w-[200px] sm:min-w-0 bg-card border border-border rounded-2xl p-3 sm:p-4 snap-start hover:shadow-md hover:border-primary/30 transition-all flex-shrink-0 flex flex-col h-full">
                    <div className="w-full aspect-square bg-primary/10 rounded-xl flex items-center justify-center text-4xl mb-3 overflow-hidden relative">
                      {item.image ? <Image src={item.image.replace('/upload/', '/upload/w_500,h_500,c_fill,g_auto,f_auto,q_auto/')} alt={item.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 25vw, 20vw" className="object-cover group-hover:scale-105 transition-transform duration-500" /> : <span>{item.category === 'Burgers' ? '🍔' : item.category === 'Pizzas' ? '🍕' : item.category === 'Fries & Sides' ? '🍟' : '🥤'}</span>}
                    </div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <div className="flex items-center gap-1 mt-1"><span className="text-yellow-500 text-xs">{'★'.repeat(item.avgRating || 0)}{'☆'.repeat(5 - (item.avgRating || 0))}</span></div>
                    <p className="text-primary font-bold mt-2 text-lg">Rs. {item.price}</p>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="h-8 bg-card rounded-full w-48 mb-8 animate-pulse" />
              <div className="h-40 bg-card rounded-3xl mb-6 animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (<div key={i} className="animate-pulse"><div className="h-32 bg-card rounded-xl mb-3" /><div className="h-4 bg-card rounded w-3/4 mb-2" /><div className="h-4 bg-card rounded w-1/2" /></div>))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Find Us */}
      <section className="py-16 bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:flex-1 text-center lg:text-left">
              <h2 className="text-5xl sm:text-6xl font-bold mb-6">📍 Find Us</h2>
              <div className="space-y-4 text-text-light max-w-md mx-auto lg:mx-0">
                <div className="flex items-center gap-3 justify-center lg:justify-start"><span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🏬</span><div className="text-left"><p className="font-semibold text-text">Oveniaa</p><p className="text-sm text-text-muted">⭐ 4.6 Rating on Google</p></div></div>
                <div className="flex items-center gap-3 justify-center lg:justify-start"><span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📍</span><div className="text-left"><p className="font-semibold text-text">Address</p><p className="text-sm text-text-muted">Chak No 267 R.B Jalandar, Faisalabad</p></div></div>
                <div className="flex items-center gap-3 justify-center lg:justify-start"><span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🕐</span><div className="text-left"><p className="font-semibold text-text">Hours</p><p className="text-sm text-text-muted">12:30 PM – 12:30 AM, Every Day</p></div></div>
              </div>
            </div>
            <div className="flex flex-col items-center lg:items-end gap-4 w-full lg:w-auto mt-4 lg:mt-0">
              <a href="https://maps.app.goo.gl/gAHcHW55CbKxACxM8" target="_blank" rel="noopener noreferrer" aria-label="Get Directions on Google Maps" className="bg-primary text-white px-8 py-4 rounded-full font-bold text-base hover:bg-primary-dark transition-all hover:scale-105 shadow-xl shadow-primary/30 inline-flex items-center gap-2">🗺️ Get Directions<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg></a>
              <a href="tel:+923248034267" className="text-text-muted hover:text-primary transition-colors text-sm font-medium">📞 +92 324 8034267</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}