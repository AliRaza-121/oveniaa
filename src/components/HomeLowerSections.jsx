'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCategoryEmoji } from '@/lib/utils'
import ScrollableRow from '@/components/ScrollableRow'

/* Lightweight Intersection Observer hook to replace framer-motion whileInView */
function useReveal(ref) {
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); observer.unobserve(el) } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
}

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  useReveal(ref)
  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${className}`}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  )
}

export default function HomeLowerSections({ popularItems, categories, deals }) {
  return (
    <>
      {/* Daily Deals */}
      {deals && deals.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal className="text-center mb-12">
              <div className="animate-pulse-scale inline-flex items-center gap-2 bg-secondary/20 text-secondary text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" /></span>
                LIMITED TIME OFFERS
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold">Today's <span className="text-primary relative">Hottest<svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg></span> Deals</h2>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal, i) => (
                <Reveal key={deal._id} delay={i * 0.1}>
                  <Link href={`/deals/${deal._id}`} className={`block bg-gradient-to-br ${deal.backgroundColor || 'from-primary/20 to-secondary/10'} border border-border rounded-3xl p-6 hover:shadow-2xl hover:-translate-y-1.5 transition-all group relative overflow-hidden h-full`}>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                    <div className="absolute top-5 right-5 z-10">
                      <div className="relative">
                        <div className="animate-wiggle bg-primary text-white text-xs font-black px-4 py-2 rounded-full shadow-lg">{deal.discount || 'DEAL'}</div>
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
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Row */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollableRow className="sm:justify-center">
            {categories.map(cat => (
              <Link key={cat._id} href={`/menu?category=${encodeURIComponent(cat.name)}`} className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3.5 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-text-light hover:text-primary hover:border-primary whitespace-nowrap transition-all flex-shrink-0">
                <span className="text-sm sm:text-lg">{getCategoryEmoji(cat.name)}</span>{cat.name}
              </Link>
            ))}
          </ScrollableRow>
        </div>
      </section>

      {/* Featured + Popular Scroll */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {popularItems.length > 0 ? (
            <>
              <Reveal>
                <h2 className="text-5xl sm:text-7xl font-bold mb-8">
                  Popular{' '}
                  <span className="text-primary relative">Picks<svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg></span>
                </h2>
              </Reveal>
              {popularItems[0] && (
                <Link href={`/menu/${popularItems[0]._id}`} className="block bg-primary/10 rounded-3xl p-6 sm:p-8 mb-6 hover:bg-primary/20 transition-colors">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-card rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 relative overflow-hidden">
                      {popularItems[0].image ? <Image src={popularItems[0].image.replace('/upload/', '/upload/w_400,h_400,c_fill,g_auto,f_auto,q_auto/')} alt={popularItems[0].name} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" priority={false} loading="lazy" /> : <span>{getCategoryEmoji(popularItems[0].category)}</span>}
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
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar sm:grid sm:grid-cols-4 sm:overflow-visible sm:snap-none sm:pb-0">
                {popularItems.slice(1).map(item => (
                  <Link key={item._id} href={`/menu/${item._id}`} className="min-w-[200px] sm:min-w-0 bg-card border border-border rounded-2xl p-3 sm:p-4 snap-start hover:shadow-md hover:border-primary/30 transition-all flex-shrink-0 flex flex-col h-full">
                    <div className="w-full aspect-square bg-primary/10 rounded-xl flex items-center justify-center text-4xl mb-3 overflow-hidden relative">
                      {item.image ? <Image src={item.image.replace('/upload/', '/upload/w_500,h_500,c_fill,g_auto,f_auto,q_auto/')} alt={item.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 25vw, 20vw" className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /> : <span>{getCategoryEmoji(item.category)}</span>}
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
    </>
  )
}
