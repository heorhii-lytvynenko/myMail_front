import { useState, useEffect } from 'react'

export const useIsTouch = (): boolean => {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      const touchSupported =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        ((navigator as Navigator & { msMaxTouchPoints?: number }).msMaxTouchPoints ?? 0) > 0

      setIsTouch(touchSupported)
    }

    checkTouch()

    window.addEventListener('resize', checkTouch)

    return () => window.removeEventListener('resize', checkTouch)
  }, [])

  return isTouch
}
