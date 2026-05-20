'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'

const HomeLowerSections = dynamic(() => import('./HomeLowerSections'), { ssr: true })

export default function HomeClient({ popularItems, categories, deals, stats }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-bg pt-24 sm:pt-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-blob1 absolute -top-20 -right-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="animate-blob2 absolute -bottom-32 -left-20 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
        </div>

        <div className="animate-emoji1 absolute top-24 right-[15%] text-5xl sm:text-7xl opacity-20 select-none hidden sm:block">🍕</div>
        <div className="animate-emoji2 absolute bottom-32 left-[10%] text-4xl sm:text-6xl opacity-20 select-none hidden sm:block">🍔</div>
        <div className="animate-emoji3 absolute top-1/2 left-[5%] text-3xl sm:text-5xl opacity-10 select-none hidden sm:block">🍟</div>
        <div className="animate-emoji4 absolute top-1/3 right-[8%] text-4xl sm:text-6xl opacity-10 select-none hidden sm:block">🥤</div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full relative z-10 text-center">
          <div className="animate-fade-in-up delay-0 inline-flex items-center gap-3 bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-5 py-2.5 rounded-full mb-10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            HOT & FRESH • DELIVERING NOW 🛵
          </div>

          <h1 className="animate-fade-in-up delay-100 text-5xl sm:text-7xl lg:text-8xl font-bold text-text leading-[0.95] tracking-tight">
            FOOD THAT{' '}
            <span className="relative inline-block">
              <span className="animate-gradient-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] bg-clip-text text-transparent">SPEAKS</span>
            </span>
            <br />FOR ITSELF
          </h1>

          <p className="animate-fade-in-up delay-250 text-text-muted text-base sm:text-lg mt-8 max-w-xl mx-auto leading-relaxed">
            Fresh ingredients. Bold flavors. Delivered hot to your door in{' '}
            <span className="text-primary font-semibold">30 minutes or less</span>. That is the Oveniaa promise.
          </p>

          <div className="animate-fade-in-up delay-400 flex gap-4 justify-center mt-10 flex-wrap">
            <div className="flex gap-3 flex-wrap">
              <Link href="/menu" className="bg-primary text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-primary-dark transition-all hover:scale-105 shadow-xl shadow-primary/30 inline-flex items-center gap-2">Order Online<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></Link>
              <a href="https://wa.me/923248034267?text=Hi%20Oveniaa!%20I%20want%20to%20place%20an%20order." target="_blank" rel="noopener noreferrer" aria-label="Order on WhatsApp" className="bg-emerald-500 text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-emerald-600 transition-all hover:scale-105 shadow-xl shadow-emerald-500/30 inline-flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>WhatsApp</a>
            </div>
          </div>

          <div className="animate-fade-in-up delay-550 flex justify-center gap-8 sm:gap-12 mt-14">
            <div className="text-center"><p className="text-3xl sm:text-4xl font-bold">{stats.menuCount}+</p><p className="text-xs sm:text-sm text-text-muted mt-1">Menu Items</p></div>
            <div className="text-center"><p className="text-3xl sm:text-4xl font-bold">{stats.avgRating} ⭐</p><p className="text-xs sm:text-sm text-text-muted mt-1">Rating</p></div>
            <div className="text-center"><p className="text-3xl sm:text-4xl font-bold">{stats.deliveryTime}</p><p className="text-xs sm:text-sm text-text-muted mt-1">Delivery</p></div>
          </div>
        </div>

        <div className="animate-fade-in-up delay-550 absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:block">
          <div className="animate-scroll-bounce w-5 h-8 rounded-full border-2 border-border flex items-start justify-center pt-1.5">
            <div className="animate-pulse-opacity w-1 h-2 bg-primary rounded-full" />
          </div>
        </div>
      </section>

      {/* Lower Sections */}
      <HomeLowerSections popularItems={popularItems} categories={categories} deals={deals} />
    </div>
  )
}