import { useRef, useEffect } from 'react'

const MAX_FRAME_MS = 100

export function useAnimationLoop({ active, stepsPerSecond, onAdvance }) {
  const speedRef = useRef(stepsPerSecond)
  const advanceRef = useRef(onAdvance)

  useEffect(() => {
    speedRef.current = stepsPerSecond
    advanceRef.current = onAdvance
  })
  useEffect(() => {
    if (!active) return

    let rafId
    let cancelled = false
    let last = null
    let carry = 0 

    function tick(timestamp) {
      if (cancelled) return
      if (last !== null) {
        const dt = Math.min(timestamp - last, MAX_FRAME_MS)
        carry += (dt / 1000) * speedRef.current
        const whole = Math.floor(carry)
        if (whole > 0) {
          carry -= whole
          advanceRef.current(whole)
        }
      }
      last = timestamp
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
    }
  }, [active])
}