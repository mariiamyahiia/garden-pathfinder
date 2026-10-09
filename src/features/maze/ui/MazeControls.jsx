import { useCallback } from 'react'
import { useMazeStore } from '../../../store/mazeStore'
import { useAnimationLoop } from '../../algorithms/ui/useAnimationLoop'

const STEPS_PER_SECOND = 250

function MazeControls() {
  const generator = useMazeStore((state) => state.generator)
  const setGenerator = useMazeStore((state) => state.setGenerator)
  const generate = useMazeStore((state) => state.generate)
  const advance = useMazeStore((state) => state.advance)
  const steps = useMazeStore((state) => state.steps)
  const status = useMazeStore((state) => state.status)

  useAnimationLoop({
    totalSteps: steps.length,
    stepsPerSecond: STEPS_PER_SECOND,
    onStep: useCallback((count) => advance(count), [advance]),
    active: status === 'generating',
  })

  const isGenerating = status === 'generating'

  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <select
        value={generator}
        onChange={(e) => setGenerator(e.target.value)}
        disabled={isGenerating}
      >
        <option value="dfs">Randomized DFS</option>
        <option value="prim">Prim's</option>
        <option value="division">Recursive Division</option>
      </select>
      <button onClick={generate} disabled={isGenerating} style={{ marginLeft: '0.5rem' }}>
        Generate Maze
      </button>
    </div>
  )
}

export default MazeControls