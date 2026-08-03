import { useCallback } from 'react'
import { useAlgorithmStore } from '../../../store/algorithmStore'
import { useAnimationLoop } from './useAnimationLoop'

const VISITED_STEPS_PER_SECOND = 60
const PATH_STEPS_PER_SECOND = 20

function AlgorithmRunner() {
  const runBFS = useAlgorithmStore((state) => state.runBFS)
  const status = useAlgorithmStore((state) => state.status)
  const visitedOrder = useAlgorithmStore((state) => state.visitedOrder)
  const path = useAlgorithmStore((state) => state.path)
  const advanceVisited = useAlgorithmStore((state) => state.advanceVisited)
  const advancePath = useAlgorithmStore((state) => state.advancePath)

  const handleVisitedStep = useCallback((count) => advanceVisited(count), [advanceVisited])
  const handlePathStep = useCallback((count) => advancePath(count), [advancePath])

  useAnimationLoop({
    totalSteps: visitedOrder.length,
    stepsPerSecond: VISITED_STEPS_PER_SECOND,
    onStep: handleVisitedStep,
    active: status === 'visiting',
  })

  useAnimationLoop({
    totalSteps: path ? path.length : 0,
    stepsPerSecond: PATH_STEPS_PER_SECOND,
    onStep: handlePathStep,
    active: status === 'pathing',
  })

  return (
    <button onClick={runBFS} disabled={status === 'visiting' || status === 'pathing'}>
      Run BFS
    </button>
  )
}

export default AlgorithmRunner