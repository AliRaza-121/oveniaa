'use client'

import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { storeConfig } from '@/lib/config'

const HomeLowerSections = dynamic(() => import('./HomeLowerSections'), { ssr: true })

export default function HomeClient({ popularItems, categories, deals, stats }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-bg">
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-noise pointer-events-none z-0" />


        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10 flex flex-col lg:flex-row items-center pt-16 pb-12 lg:pt-20 lg:pb-20">
          
          {/* Left Content */}
          <div className="w-full lg:flex-1 text-center lg:text-left pt-10 lg:pt-0 relative z-20 min-w-0">
            <div className="animate-fade-in-up delay-0 inline-flex items-center gap-3 bg-card border border-border text-text text-xs font-bold px-5 py-2.5 rounded-full mb-8 shadow-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              HOT & FRESH • DELIVERING NOW 🛵
            </div>

            <h1 className="animate-fade-in-up delay-100 text-5xl sm:text-6xl lg:text-[5.5rem] xl:text-7xl font-black font-display text-text leading-[0.95] tracking-tight uppercase flex flex-col items-center lg:items-start whitespace-nowrap">
              <span className="block mb-2">Food That</span>
              <span className="block text-stroke-primary drop-shadow-[0_0_15px_rgba(255,107,53,0.4)] mb-2">Speaks</span>
              <span className="block text-primary">For Itself</span>
            </h1>

            <p className="animate-fade-in-up delay-250 text-text-muted text-lg mt-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Fresh ingredients. Bold flavors. Delivered hot to your door in{' '}
              <span className="text-text font-bold border-b-2 border-primary pb-0.5">30 minutes or less</span>. That is the Oveniaa promise.
            </p>

            <div className="animate-fade-in-up delay-400 flex gap-4 justify-center lg:justify-start mt-10 flex-wrap">
              <Link href="/menu" className="bg-primary text-white px-8 py-4 rounded-full font-black text-sm hover:bg-primary-dark transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,107,53,0.3)] inline-flex items-center gap-2 uppercase tracking-wide">
                Order Online
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="animate-fade-in-up delay-550 flex justify-center lg:justify-start gap-10 mt-16 pb-8 lg:pb-0">
              <div><p className="text-3xl font-black font-display">{stats.menuCount}+</p><p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1.5">Menu Items</p></div>
              <div><p className="text-3xl font-black font-display">{stats.avgRating} ⭐</p><p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1.5">Rating</p></div>
              <div><p className="text-3xl font-black font-display">{stats.deliveryTime}</p><p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1.5">Delivery</p></div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="w-full lg:w-[45%] relative h-[350px] sm:h-[450px] lg:h-[650px] flex items-center justify-center lg:justify-end mt-10 lg:mt-0 z-10 pointer-events-none flex-shrink-0">
            {/* Floating Ingredients */}
            <div className="absolute top-[10%] left-[5%] text-4xl animate-emoji1 opacity-70 rotate-12 blur-[1px]">🍅</div>
            <div className="absolute bottom-[20%] right-[5%] text-5xl animate-emoji2 opacity-90 -rotate-12">🧀</div>
            <div className="absolute top-[20%] right-[15%] text-3xl animate-emoji3 opacity-60 rotate-45 blur-[2px]">🌿</div>
            <div className="absolute bottom-[10%] left-[20%] text-4xl animate-emoji4 opacity-80 -rotate-45">🥓</div>
            
            {/* Main Image */}
            <div className="relative w-[110%] h-[110%] sm:w-full sm:h-full flex items-center justify-center animate-hero-zoom drop-shadow-[0_30px_30px_rgba(0,0,0,0.6)]">
              <Image src="/hero_pizza.png" alt="Oveniaa Fresh Food" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain" priority />
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up delay-550 absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:block z-20">
          <div className="animate-scroll-bounce w-5 h-8 rounded-full border-2 border-border flex items-start justify-center pt-1.5 backdrop-blur-sm bg-bg/50">
            <div className="animate-pulse-opacity w-1 h-2 bg-primary rounded-full" />
          </div>
        </div>
      </section>

      {/* Lower Sections */}
      <HomeLowerSections popularItems={popularItems} categories={categories} deals={deals} />
    </div>
  )
}