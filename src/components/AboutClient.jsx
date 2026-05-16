'use client'

import { motion } from 'framer-motion'

export default function AboutClient() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl sm:text-7xl font-bold font-display">About <span className="text-primary">Oveniaa</span></h1>
          <p className="text-text-muted mt-4 max-w-2xl mx-auto leading-relaxed">Born from a love for great food and fast service. We serve fresh, hot, and flavorful meals that bring people together.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {[
            { icon: '🎯', title: 'Our Mission', desc: 'To deliver hot, fresh, and flavorful fast food that brings people together — every single order, every single time.' },
            { icon: '💛', title: 'Our Values', desc: 'Quality ingredients, speedy service, and a passion for making every bite memorable. We treat every customer like family.' },
          ].map(item => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card border border-border rounded-2xl p-6 text-center">
              <span className="text-4xl">{item.icon}</span>
              <h3 className="text-lg font-bold mt-3">{item.title}</h3>
              <p className="text-text-muted text-sm mt-2 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-primary/10 rounded-3xl p-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Meet the Founder</h2>
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">AR</div>
          <p className="text-xl font-bold">Ali Raza</p>
          <p className="text-text-muted text-sm">Founder & Full Stack Developer</p>
          <p className="text-text-muted text-sm mt-2 max-w-md mx-auto">MERN Stack developer passionate about building fast, beautiful, and functional web applications.</p>
        </div>
      </div>
    </div>
  )
}