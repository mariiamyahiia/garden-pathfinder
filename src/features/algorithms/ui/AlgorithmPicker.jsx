import { usePlaybackStore } from '../../../store/playbackStore'

function AlgorithmPicker() {
  const algorithm = usePlaybackStore((state) => state.algorithm)
  const heuristic = usePlaybackStore((state) => state.heuristic)
  const setAlgorithm = usePlaybackStore((state) => state.setAlgorithm)
  const setHeuristic = usePlaybackStore((state) => state.setHeuristic)
  const run = usePlaybackStore((state) => state.run)

  return (
    <>
      <select
        className="field"
        aria-label="Algorithm"
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
      >
        <option value="bfs">BFS</option>
        <option value="dijkstra">Dijkstra</option>
        <option value="astar">A*</option>
      </select>

      {algorithm === 'astar' && (
        <select
          className="field"
          aria-label="Heuristic"
          value={heuristic}
          onChange={(e) => setHeuristic(e.target.value)}
        >
          <option value="manhattan">Manhattan</option>
          <option value="euclidean">Euclidean</option>
          <option value="chebyshev">Chebyshev</option>
        </select>
      )}

      <button className="btn btn--primary" onClick={run}>
        Run
      </button>
    </>
  )
}

export default AlgorithmPicker