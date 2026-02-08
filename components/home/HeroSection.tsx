'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

export function AnimatedSection({
  children,
  className,
  viewport = false,
}: {
  children: ReactNode
  className?: string
  viewport?: boolean
}) {
  return (
    <motion.section
      className={className}
      initial="hidden"
      {...(viewport
        ? { whileInView: 'visible', viewport: { once: true, amount: 0.15 } }
        : { animate: 'visible' })}
      variants={stagger}
    >
      {children}
    </motion.section>
  )
}

export function AnimatedItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  )
}

export function ScaleIn({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, scale: 0.7 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
