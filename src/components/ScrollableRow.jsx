'use client'

import { useRef, useState, useEffect } from 'react'

export default function ScrollableRow({ children, className = '', innerClassName = 'flex gap-2 pb-2 pt-1 px-1' }) {
  const scrollRef = useRef(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeft(scrollLeft > 0)
      setShowRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    // Initial check and setup observer for content changes
    handleScroll()
    window.addEventListener('resize', handleScroll)
    
    const observer = new ResizeObserver(handleScroll)
    if (scrollRef.current) observer.observe(scrollRef.current)
      
    return () => {
      window.removeEventListener('resize', handleScroll)
      observer.disconnect()
    }
  }, [children])

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className={`relative flex items-center group w-full h-full ${className}`}>
      {showLeft && (
        <div className="absolute left-0 z-10 h-full w-12 bg-gradient-to-r from-bg to-transparent flex items-center justify-start -ml-2 pointer-events-none">
          <button 
            onClick={() => scroll('left')} 
            className="w-8 h-8 flex items-center justify-center bg-card border border-border shadow-md rounded-full text-text hover:text-primary transition-all pointer-events-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          </button>
        </div>
      )}
      
      <div 
        ref={scrollRef} 
        onScroll={handleScroll} 
        className={`${innerClassName} overflow-x-auto w-full hide-scrollbar`}
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {children}
      </div>

      {showRight && (
        <div className="absolute right-0 z-10 h-full w-12 bg-gradient-to-l from-bg to-transparent flex items-center justify-end -mr-2 pointer-events-none">
          <button 
            onClick={() => scroll('right')} 
            className="w-8 h-8 flex items-center justify-center bg-card border border-border shadow-md rounded-full text-text hover:text-primary transition-all pointer-events-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>
      )}
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
