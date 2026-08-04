import { useCallback } from 'react'
import { useAlgorithmStore } from '../../../store/algorithmStore'
import { useAnimationLoop } from './useAnimationLoop'

const VISITED_STEPS_PER_SECOND = 60
const PATH_STEPS_PER_SECOND = 20

function AlgorithmRunner() {
  const algorithm = useAlgorithmStore((state) => state.algorithm)
  const heuristic = useAlgorithmStore((state) => state.heuristic)
  const setAlgorithm = useAlgorithmStore((state) => state.setAlgorithm)
  const setHeuristic = useAlgorithmStore((state) => state.setHeuristic)
  const run = useAlgorithmStore((state) => state.run)
  const status = useAlgorithmStore((state) => state.status)
  const visitedOrder = useAlgorithmStore((state) => state.visitedOrder)
  const path = useAlgorithmStore((state) => state.path)
  const cost = useAlgorithmStore((state) => state.cost)
  const advanceVisited = useAlgorithmStore((state) => state.advanceVisited)
  const advancePath = useAlgorithmStore((state) => state.advancePath)

  useAnimationLoop({
    totalSteps: visitedOrder.length,
    stepsPerSecond: VISITED_STEPS_PER_SECOND,
    onStep: useCallback((c) => advanceVisited(c), [advanceVisited]),
    active: status === 'visiting',
  })

  useAnimationLoop({
    totalSteps: path ? path.length : 0,
    stepsPerSecond: PATH_STEPS_PER_SECOND,
    onStep: useCallback((c) => advancePath(c), [advancePath]),
    active: status === 'pathing',
  })

  const isRunning = status === 'visiting' || status === 'pathing'

  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} disabled={isRunning}>
        <option value="bfs">BFS</option>
        <option value="dijkstra">Dijkstra</option>
        <option value="astar">A*</option>
      </select>

      {algorithm === 'astar' && (
        <select value={heuristic} onChange={(e) => setHeuristic(e.target.value)} disabled={isRunning}>
          <option value="manhattan">Manhattan</option>
          <option value="euclidean">Euclidean</option>
          <option value="chebyshev">Chebyshev</option>
        </select>
      )}

      <button onClick={run} disabled={isRunning} style={{ marginLeft: '0.5rem' }}>
        Run
      </button>

      {path && status === 'done' && (
        <span style={{ marginLeft: '1rem' }}>
          Path length: {path.length}{cost !== null && ` · Cost: ${cost}`}
        </span>
      )}
    </div>
  )
}

export default AlgorithmRunner