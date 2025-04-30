'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      {/* Video o imagen de fondo */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      <video 
        autoPlay 
        loop 
        muted 
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Contenido */}
      <div className="container relative z-20 h-full flex flex-col justify-center items-center text-center text-white">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Colegio Don Bosco
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl max-w-2xl mb-8"
        >
          Formando líderes con valores cristianos y excelencia académica
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4"
        >
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Admisiones
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
            Conócenos
          </Button>
        </motion.div>
      </div>
    </section>
  )
}