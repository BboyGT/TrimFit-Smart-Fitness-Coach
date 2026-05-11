import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minimize2, Maximize2, GripHorizontal, Play } from 'lucide-react'

/**
 * PiPPlayer — A floating, draggable YouTube mini-player.
 *
 * Props:
 *  youtubeId   — YouTube video ID
 *  title       — exercise name (for aria label)
 *  isOpen      — controlled visibility
 *  onClose     — () => void  (minimise / close PiP)
 *  size        — 'sm' | 'md' | 'lg'  (default 'md')
 *  autoPlay    — bool (default true)
 */
const sizeMap = {
  sm: { w: 180, h: 101 },
  md: { w: 280, h: 158 },
  lg: { w: 400, h: 225 },
}

const PiPPlayer = ({ youtubeId, title = '', isOpen, onClose, size = 'md', autoPlay = true }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [pos, setPos] = useState({ x: 16, y: 80 })
  const [currentSize, setCurrentSize] = useState(size)
  const [isMinimized, setIsMinimized] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const containerRef = useRef(null)

  const dimensions = sizeMap[currentSize]

  // Reset position on open
  useEffect(() => {
    if (isOpen) {
      setPos({ x: 16, y: 80 })
      setIsMinimized(false)
      setCurrentSize(size)
    }
  }, [isOpen, size])

  // Keyboard shortcut — press 'p' to toggle PiP
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (e.key === 'p' || e.key === 'P') {
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return
        setIsMinimized(prev => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen])

  const handlePointerDown = useCallback((e) => {
    if (isMinimized) return
    e.preventDefault()
    setIsDragging(true)
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }, [isMinimized])

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return
    const maxX = window.innerWidth - dimensions.w
    const maxY = window.innerHeight - (isMinimized ? 48 : dimensions.h) - 8
    setPos({
      x: Math.max(0, Math.min(e.clientX - dragOffset.current.x, maxX)),
      y: Math.max(0, Math.min(e.clientY - dragOffset.current.y, maxY)),
    })
  }, [isDragging, dimensions, isMinimized])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
      return () => {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerup', handlePointerUp)
      }
    }
  }, [isDragging, handlePointerMove, handlePointerUp])

  const cycleSize = () => {
    const sizes = ['sm', 'md', 'lg']
    const idx = sizes.indexOf(currentSize)
    setCurrentSize(sizes[(idx + 1) % sizes.length])
  }

  const handleClose = () => {
    setIsMinimized(false)
    onClose?.()
  }

  if (!youtubeId || !isOpen) return null

  const params = [
    autoPlay ? 'autoplay=1' : 'autoplay=0',
    'mute=1',
    'loop=1',
    `playlist=${youtubeId}`,
    'rel=0',
    'modestbranding=1',
    'playsinline=1',
    'controls=1',
    'enablejsapi=1',
  ].join('&')

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed z-[200] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10"
        style={{
          left: pos.x,
          top: pos.y,
          width: isMinimized ? 180 : dimensions.w,
          height: isMinimized ? 48 : dimensions.h,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: isDragging ? 'none' : 'auto',
        }}
        onPointerDown={handlePointerDown}
      >
        {/* Drag Handle Bar + Controls */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-2 py-1 bg-gradient-to-b from-black/60 to-transparent"
          style={{ height: 28 }}
        >
          <div className="flex items-center gap-1">
            <GripHorizontal size={12} className="text-white/50" />
            <span className="text-[10px] text-white/70 font-medium truncate max-w-[100px]">{title || 'Follow Along'}</span>
          </div>
          <div className="flex items-center gap-0.5">
            {!isMinimized && (
              <button
                onClick={(e) => { e.stopPropagation(); cycleSize() }}
                className="p-1 rounded-md hover:bg-white/10 transition-colors"
                title="Resize"
              >
                {currentSize === 'lg' ? <Minimize2 size={12} className="text-white/70" /> : <Maximize2 size={12} className="text-white/70" />}
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setIsMinimized(prev => !prev) }}
              className="p-1 rounded-md hover:bg-white/10 transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? <Play size={12} className="text-white/70" /> : <Minimize2 size={12} className="text-white/70" />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleClose() }}
              className="p-1 rounded-md hover:bg-red-500/30 transition-colors"
              title="Close"
            >
              <X size={12} className="text-white/70" />
            </button>
          </div>
        </div>

        {/* Video */}
        <AnimatePresence mode="wait">
          {!isMinimized ? (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full bg-black"
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?${params}`}
                title={title || 'Exercise Video'}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                frameBorder="0"
              />
            </motion.div>
          ) : (
            <motion.div
              key="mini"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center"
              onClick={() => setIsMinimized(false)}
            >
              <Play size={18} className="text-white ml-1" />
              <span className="text-xs text-white font-medium ml-2 truncate">{title || 'Follow Along'}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PiP Badge */}
        {!isMinimized && (
          <div className="absolute bottom-1.5 left-1.5 z-10">
            <span className="text-[8px] bg-black/60 text-white/80 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              PiP
            </span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default PiPPlayer
