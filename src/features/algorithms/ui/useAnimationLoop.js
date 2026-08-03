import { useRef, useEffect } from 'react'

// Generic requestAnimationFrame-driven stepper. Advances `stepsPerSecond`
// steps per second via onStep(count), until totalSteps is reached.
// Reused later for Dijkstra/A* visited animation, path animation, and
// eventually the Play/Pause/Step controls in Phase 7.
export function useAnimationLoop({ totalSteps, stepsPerSecond, onStep, active }) {
  const rafRef = useRef(null)
  const lastTimeRef = useRef(null)
  const countRef = useRef(0)

  useEffect(() => {
    countRef.current = 0
    lastTimeRef.current = null
  }, [totalSteps])

  useEffect(() => {
    if (!active || totalSteps === 0) return

    function tick(timestamp) {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp
      const elapsed = timestamp - lastTimeRef.current
      const stepsToAdvance = Math.floor((elapsed / 1000) * stepsPerSecond)

      if (stepsToAdvance > 0) {
        countRef.current = Math.min(countRef.current + stepsToAdvance, totalSteps)
        lastTimeRef.current = timestamp
        onStep(countRef.current)
      }

      if (countRef.current < totalSteps) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, totalSteps, stepsPerSecond, onStep])
}