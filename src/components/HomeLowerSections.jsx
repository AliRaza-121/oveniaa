'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCategoryEmoji } from '@/lib/utils'
import ScrollableRow from '@/components/ScrollableRow'
import { storeConfig } from '@/lib/config'

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
      {/* Daily Deals - Clean Premium Layout */}
      {deals && deals.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold px-4 py-1.5 rounded-full mb-4 text-xs tracking-widest uppercase">
                Limited Time Offers
              </div>
              <h2 className="text-4xl sm:text-5xl font-black font-display tracking-tight">Today's <span className="text-primary">Deals</span></h2>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal, i) => (
                <Reveal key={deal._id} delay={i * 0.1}>
                  <Link href={`/deals/${deal._id}`} className="block relative h-full bg-card rounded-[2rem] border border-border/50 p-[2px] group transition-all duration-500 ease-in-out hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    
                    {/* Animated Sweeping Shine */}
                    <div className="absolute inset-0 rounded-[2rem] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0">
                      <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] group-hover:animate-sweep" />
                    </div>

                    <div className="relative h-full bg-card rounded-[1.9rem] p-6 lg:p-8 flex flex-col z-10 overflow-hidden">
                      
                      {/* Header / Discount Badge */}
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest shadow-lg shadow-primary/30 uppercase transform group-hover:scale-105 transition-transform duration-500 origin-left border border-white/10">
                          <span className="animate-pulse">🔥</span> {deal.discount || 'Limited Time'}
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500 ease-in-out group-hover:translate-x-1 shadow-xl">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                        </div>
                      </div>
                      
                      <div className="relative z-10 mb-6">
                        <h3 className="text-3xl font-black font-display text-text mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all duration-500">{deal.title}</h3>
                        {deal.description && <p className="text-text-muted text-sm leading-relaxed line-clamp-2">{deal.description}</p>}
                      </div>
                      
                      <div className="mt-auto relative z-10">
                        {deal.items?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {deal.items.slice(0, 3).map((item, j) => (
                              <span key={j} className="text-[11px] bg-white/5 border border-white/10 text-text-light px-3 py-1.5 rounded-lg font-semibold">{item.name || 'Item'}</span>
                            ))}
                            {deal.items.length > 3 && <span className="text-[11px] bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold shadow-inner">+{deal.items.length - 3}</span>}
                          </div>
                        )}
                        
                        <div className="flex items-end justify-between pt-5 border-t border-white/5 group-hover:border-primary/20 transition-colors duration-500">
                          <div>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1">Total Price</p>
                            <div className="flex items-baseline gap-3">
                              {deal.price > 0 && <span className="text-4xl font-black text-white drop-shadow-md group-hover:text-primary transition-colors duration-500">Rs. {deal.price}</span>}
                              {deal.originalPrice > 0 && <span className="text-sm text-text-muted line-through font-semibold">Rs. {deal.originalPrice}</span>}
                            </div>
                          </div>
                        </div>
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
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollableRow className="sm:justify-center">
            {categories.map(cat => (
              <Link key={cat._id} href={`/menu?category=${encodeURIComponent(cat.name)}`} className="flex items-center gap-2 bg-card border border-border shadow-sm rounded-full px-4 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-text hover:text-primary hover:border-primary hover:shadow-md whitespace-nowrap transition-all duration-300 flex-shrink-0 group">
                <span className="text-base sm:text-xl transition-transform duration-300">{getCategoryEmoji(cat.name)}</span>{cat.name}
              </Link>
            ))}
          </ScrollableRow>
        </div>
      </section>

      {/* Featured + Popular Scroll - Premium Layout */}
      <section className="py-20 relative">
        <div className="absolute top-1/2 left-0 w-full h-1/2 bg-gradient-to-t from-bg-dark to-transparent pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {popularItems.length > 0 ? (
            <>
              <Reveal className="mb-12">
                <h2 className="text-5xl sm:text-7xl font-black font-display tracking-tight text-center sm:text-left">
                  Popular{' '}
                  <span className="text-primary relative inline-block">Picks<svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg></span>
                </h2>
              </Reveal>
              
              {/* Massive Hero Item */}
              {popularItems[0] && (
                <Link href={`/menu/${popularItems[0]._id}`} className="block relative bg-card border border-primary/20 rounded-[2.5rem] p-8 sm:p-12 mb-12 hover:shadow-2xl hover:border-primary/50 transition-all duration-500 ease-in-out overflow-hidden group">
                  
                  <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 relative flex-shrink-0 group-hover:scale-[1.02] transition-transform duration-500 ease-in-out">
                      {popularItems[0].image ? (
                        <Image src={popularItems[0].image.replace('/upload/', '/upload/w_600,h_600,c_fill,g_auto,f_auto,q_auto/')} alt={popularItems[0].name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover rounded-full shadow-2xl border-4 border-white/10" priority={false} loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-card rounded-full flex items-center justify-center text-7xl shadow-2xl border-4 border-white/10">{getCategoryEmoji(popularItems[0].category)}</div>
                      )}
                      
                      <div className="absolute -top-4 -right-4 bg-yellow-500 text-white font-black text-sm uppercase tracking-widest px-4 py-2 rounded-full shadow-xl shadow-yellow-500/40 rotate-12 animate-pulse-scale">
                        #1 Best Seller
                      </div>
                    </div>
                    
                    <div className="text-center md:text-left flex-1">
                      <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-4">Chef's Special</span>
                      <h3 className="text-4xl sm:text-6xl font-black font-display mb-4 leading-tight group-hover:text-primary transition-colors">{popularItems[0].name}</h3>
                      <p className="text-text-muted text-base sm:text-lg mb-8 max-w-xl leading-relaxed mx-auto md:mx-0">{popularItems[0].description}</p>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
                        <p className="text-primary font-black text-4xl group-hover:scale-110 transition-transform duration-500 origin-left">Rs. {popularItems[0].price}</p>
                        <div className="w-full sm:w-auto bg-text text-bg px-8 py-4 rounded-full font-bold text-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg group-hover:shadow-primary/30 flex items-center justify-center gap-2 group/btn">
                          Order Now <span className="group-hover/btn:translate-x-1 transition-transform duration-300">➔</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
              
              {/* Secondary Popular Items (Floating Aesthetics) */}
              <div className="flex gap-6 overflow-x-auto pb-8 pt-4 px-2 snap-x snap-mandatory hide-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:snap-none sm:pb-0">
                {popularItems.slice(1).map((item, index) => (
                  <Link key={item._id} href={`/menu/${item._id}`} className="min-w-[240px] sm:min-w-0 bg-card border border-border rounded-3xl p-6 snap-start hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 ease-in-out flex-shrink-0 flex flex-col h-full group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <div className="w-32 h-32 sm:w-36 sm:h-36 mx-auto relative transition-transform duration-500 ease-in-out shadow-xl rounded-full z-10 mb-6 group-hover:scale-[1.02]">
                      {item.image ? (
                        <Image src={item.image.replace('/upload/', '/upload/w_400,h_400,c_fill,g_auto,f_auto,q_auto/')} alt={item.name} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover rounded-full border-4 border-bg" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-bg rounded-full flex items-center justify-center text-5xl border-4 border-bg shadow-inner">{getCategoryEmoji(item.category)}</div>
                      )}
                      
                      <div className="absolute top-0 right-0 bg-secondary text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300 border border-white/20">
                        #{index + 2}
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col text-center relative z-10">
                      <h3 className="font-bold text-lg sm:text-xl mb-1 group-hover:text-primary transition-colors duration-300">{item.name}</h3>
                      <div className="flex items-center justify-center gap-1 mb-4">
                        <span className="text-yellow-500 text-sm drop-shadow-sm">{'★'.repeat(item.avgRating || 0)}{'☆'.repeat(5 - (item.avgRating || 0))}</span>
                      </div>
                      <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center group-hover:border-primary/30 transition-colors duration-500">
                        <p className="text-primary font-bold text-xl sm:text-2xl group-hover:scale-105 transition-transform duration-500 ease-in-out origin-left">Rs. {item.price}</p>
                        <div className="w-10 h-10 rounded-full bg-bg border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-transparent transition-all duration-500 ease-in-out text-xl shadow-sm group-hover:shadow-md">+</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="h-12 bg-card rounded-full w-64 mb-12 animate-pulse" />
              <div className="h-80 bg-card rounded-3xl mb-12 animate-pulse" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                {[1,2,3,4].map(i => (<div key={i} className="animate-pulse"><div className="h-40 bg-card rounded-3xl mb-4" /><div className="h-6 bg-card rounded w-3/4 mx-auto mb-2" /><div className="h-6 bg-card rounded w-1/2 mx-auto" /></div>))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Find Us - Modern Contact Card Layout */}
      <section className="py-24 relative overflow-hidden">
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 sm:p-12 lg:p-16 shadow-2xl flex flex-col lg:flex-row gap-12 items-center">
            
            <div className="w-full lg:flex-1 text-center lg:text-left">
              <span className="inline-block bg-primary/10 text-primary font-black px-4 py-1.5 rounded-full text-xs tracking-widest uppercase mb-4">Visit Us</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display mb-8">We're Ready For You.</h2>
              
              <div className="space-y-6 text-left max-w-md mx-auto lg:mx-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-bg border border-border rounded-2xl flex items-center justify-center text-xl shadow-sm shrink-0">📍</div>
                  <div>
                    <p className="font-black text-text text-lg mb-1">Location</p>
                    <p className="text-text-muted">{storeConfig.contact.address.line1}<br/>{storeConfig.contact.address.line2}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-bg border border-border rounded-2xl flex items-center justify-center text-xl shadow-sm shrink-0">🕐</div>
                  <div>
                    <p className="font-black text-text text-lg mb-1">Hours</p>
                    <p className="text-text-muted">{storeConfig.hours.days}<br/>{storeConfig.hours.time}</p>
                    <p className="text-xs text-primary font-bold mt-1">{storeConfig.hours.note}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-bg border border-border rounded-2xl flex items-center justify-center text-xl shadow-sm shrink-0">📞</div>
                  <div>
                    <p className="font-black text-text text-lg mb-1">Contact</p>
                    <a href={`tel:${storeConfig.contact.phone.replace(/\s+/g, '')}`} className="block text-text-muted hover:text-primary transition-colors">{storeConfig.contact.phone}</a>
                    <a href={`mailto:${storeConfig.contact.email}`} className="block text-text-muted hover:text-primary transition-colors">{storeConfig.contact.email}</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 w-full lg:w-72 shrink-0">
              <div className="bg-bg border border-border rounded-3xl p-6 text-center shadow-sm">
                <div className="text-4xl mb-3">⭐</div>
                <p className="font-black text-xl">4.8 / 5.0</p>
                <p className="text-xs text-text-muted mt-1">Based on Customer Reviews</p>
              </div>
              
              <a href="https://maps.app.goo.gl/gAHcHW55CbKxACxM8" target="_blank" rel="noopener noreferrer" className="bg-primary text-white w-full py-4 rounded-2xl font-black text-center hover:bg-primary-dark transition-all hover:-translate-y-1 shadow-lg shadow-primary/30 flex justify-center items-center gap-2 group">
                🗺️ Get Directions 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </a>
              
              <a href={storeConfig.socials.whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white w-full py-4 rounded-2xl font-black text-center hover:bg-[#1ebd5a] transition-all hover:-translate-y-1 shadow-lg shadow-[#25D366]/30 flex justify-center items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                WhatsApp Us
              </a>
            </div>
            
          </div>
        </div>
      </section>
    </>
  )
}
