'use client'

import { useEffect, useRef, type RefObject } from 'react'

export function useScrollSync(
  sourceRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  enabled: boolean
) {
  const isSyncing = useRef(false)

  useEffect(() => {
    if (!enabled) return
    const source = sourceRef.current
    const target = targetRef.current
    if (!source || !target) return

    const handleScroll = () => {
      if (isSyncing.current) return
      isSyncing.current = true
      const ratio = source.scrollTop / (source.scrollHeight - source.clientHeight)
      if (isFinite(ratio)) {
        target.scrollTop = ratio * (target.scrollHeight - target.clientHeight)
      }
      requestAnimationFrame(() => {
        isSyncing.current = false
      })
    }

    source.addEventListener('scroll', handleScroll)
    return () => source.removeEventListener('scroll', handleScroll)
  }, [enabled, sourceRef, targetRef])
}
