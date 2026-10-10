import { useMazeStore } from '../../../store/mazeStore'
import { useAnimationLoop } from '../../algorithms/ui/useAnimationLoop'

const STEPS_PER_SECOND = 250

function MazeControls() {
  const generator = useMazeStore((state) => state.generator)
  const setGenerator = useMazeStore((state) => state.setGenerator)
  const generate = useMazeStore((state) => state.generate)
  const advance = useMazeStore((state) => state.advance)
  const status = useMazeStore((state) => state.status)

  useAnimationLoop({
    active: status === 'generating',
    stepsPerSecond: STEPS_PER_SECOND,
    onAdvance: advance,
  })

  const isGenerating = status === 'generating'

  return (
    <>
      <select
        className="field"
        aria-label="Maze type"
        value={generator}
        onChange={(e) => setGenerator(e.target.value)}
        disabled={isGenerating}
      >
        <option value="none">None (empty garden)</option>
        <option value="dfs">Randomized DFS</option>
        <option value="prim">Prim's</option>
        <option value="division">Recursive Division</option>
      </select>
      <button className="btn" onClick={generate} disabled={isGenerating}>
        {generator === 'none' ? 'Clear board' : 'Generate'}
      </button>
    </>
  )
}

export default MazeControls