'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface GallerySlideshowProps {
  title: string
  images: string[]
  year: string
  slug: string
}

const slideTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
}

const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

export default function GallerySlideshow({
  title,
  images,
  year,
  slug,
}: GallerySlideshowProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const totalImages = images.length

  const goToNext = useCallback(() => {
    if (currentIndex < totalImages - 1) {
      setDirection(1)
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, totalImages])

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex((prev) => prev - 1)
    }
  }, [currentIndex])

  const goToIndex = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1)
      setCurrentIndex(index)
    },
    [currentIndex]
  )

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/blog')
    }
  }, [router])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          goToNext()
          break
        case 'ArrowLeft':
          e.preventDefault()
          goToPrev()
          break
        case 'Escape':
          handleBack()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNext, goToPrev, handleBack])

  const handleDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x)

    if (swipe < -swipeConfidenceThreshold) {
      goToNext()
    } else if (swipe > swipeConfidenceThreshold) {
      goToPrev()
    }
  }

  // Resolve image path
  const resolveImagePath = (src: string) => {
    if (src.startsWith('./resources/')) {
      return `/blog/${year}/${slug}/${src.slice(2)}`
    }
    return src
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  }

  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col z-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 text-white/90">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Go back"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-medium truncate max-w-50 sm:max-w-none">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous image"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-sm font-mono tabular-nums min-w-15 text-center">
            {currentIndex + 1} / {totalImages}
          </span>

          <button
            onClick={goToNext}
            disabled={currentIndex === totalImages - 1}
            className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next image"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main image area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            <Image
              src={resolveImagePath(images[currentIndex])}
              alt={`Image ${currentIndex + 1} of ${totalImages}`}
              fill
              className="object-contain select-none"
              draggable={false}
              sizes="100vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Side tap zones for mobile */}
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="absolute left-0 top-0 bottom-0 w-1/4 z-10 opacity-0 cursor-pointer"
          aria-label="Previous image"
        />
        <button
          onClick={goToNext}
          disabled={currentIndex === totalImages - 1}
          className="absolute right-0 top-0 bottom-0 w-1/4 z-10 opacity-0 cursor-pointer"
          aria-label="Next image"
        />
      </main>

      {/* Progress bar */}
      <footer className="px-4 py-3">
        <div className="flex gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className="flex-1 h-1 rounded-full overflow-hidden transition-colors"
              style={{
                backgroundColor:
                  index <= currentIndex
                    ? 'rgba(255,255,255,0.9)'
                    : 'rgba(255,255,255,0.2)',
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </footer>
    </div>
  )
}
