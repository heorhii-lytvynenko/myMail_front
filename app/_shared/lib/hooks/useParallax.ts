import { useRef, useCallback, useEffect } from 'react'

interface ParallaxLayer {
  ref: React.RefObject<HTMLElement | null>
  depth: number
}

interface UseParallaxConfig {
  layers: ParallaxLayer[]
  strength?: number
  ease?: number
  invert?: boolean
  threshold?: number
}

export const useParallax = ({
  layers,
  strength = 16,
  ease = 0.1,
  invert = false,
  threshold = 0.001
}: UseParallaxConfig) => {
  const rafRef = useRef<number | null>(null)
  const current = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  const animate = useCallback(function animateFrame() {
    rafRef.current = null

    current.current.x += (target.current.x - current.current.x) * ease
    current.current.y += (target.current.y - current.current.y) * ease

    const dir = invert ? 1 : -1

    for (const { ref, depth } of layers) {
      if (!ref.current) continue
      const bx = current.current.x * strength * depth * dir
      const by = current.current.y * strength * depth * dir

      ref.current.style.transform = `translate(${bx}px, ${by}px)`
    }

    const dx = Math.abs(current.current.x - target.current.x)
    const dy = Math.abs(current.current.y - target.current.y)

    if (dx > threshold || dy > threshold) {
      rafRef.current = requestAnimationFrame(animateFrame)
    }
  }, [layers, strength, ease, invert, threshold])

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()

      target.current.x = (e.clientX - rect.left) / rect.width - 0.5
      target.current.y = (e.clientY - rect.top) / rect.height - 0.5
      if (!rafRef.current) rafRef.current = requestAnimationFrame(animate)
    },
    [animate]
  )

  const onMouseLeave = useCallback(() => {
    target.current = { x: 0, y: 0 }
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animate)
  }, [animate])

  useEffect(() => () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current) }, [])

  return { onMouseMove, onMouseLeave }
}
