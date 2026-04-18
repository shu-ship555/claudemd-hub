'use client'

import { useRef } from 'react'

export function useScrollSync<A extends HTMLElement, B extends HTMLElement>() {
  const refA = useRef<A>(null)
  const refB = useRef<B>(null)
  const isSyncingRef = useRef(false)

  const syncScroll = (source: HTMLElement, target: HTMLElement) => {
    if (isSyncingRef.current) return
    const percent = source.scrollTop / (source.scrollHeight - source.clientHeight)
    isSyncingRef.current = true
    target.scrollTop = percent * (target.scrollHeight - target.clientHeight)
    isSyncingRef.current = false
  }

  const handleAScroll = (e: React.UIEvent<A>) => {
    if (refB.current) syncScroll(e.currentTarget, refB.current)
  }

  const handleBScroll = (e: React.UIEvent<B>) => {
    if (refA.current) syncScroll(e.currentTarget, refA.current)
  }

  return { refA, refB, handleAScroll, handleBScroll }
}
