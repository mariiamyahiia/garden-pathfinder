import './StatsPanel.css'
import { usePlaybackStore } from '../../../store/playbackStore'
import { getVisibleCounts, runLength } from '../../algorithms/logic/timeline'
import { costSoFar } from '../../algorithms/logic/graphUtils'
import { ANIMATION_STEPS_PER_SECOND } from '../../algorithms/config'

const ALGORITHM_LABELS = { bfs: 'BFS', dijkstra: 'Dijkstra', astar: 'A*' }
const HEURISTIC_LABELS = { manhattan: 'Manhattan', euclidean: 'Euclidean', chebyshev: 'Chebyshev' }

const STATUS_TEXT = {
  exploring: 'Exploring the garden…',
  growing: 'Growing the vine…',
  done: 'Final path cost',
  none: 'The goal is walled off',
}

function StatsPanel() {
  const run = usePlaybackStore((state) => state.runs[0])
  const position = usePlaybackStore((state) => state.position)

  if (!run) {
    return (
      <div className="stats stats--empty">
        <p className="stats__status">
          Paint some terrain, pick an algorithm, and press Run to see what the path costs.
        </p>
      </div>
    )
  }

  const { visibleVisited, visiblePath } = getVisibleCounts(run, position)
  const hasPath = run.path !== null

  let phase
  if (visibleVisited < run.visitedOrder.length) phase = 'exploring'
  else if (!hasPath) phase = 'none'
  else if (visiblePath < run.path.length) phase = 'growing'
  else phase = 'done'

  const elapsed = Math.min(position, runLength(run)) / ANIMATION_STEPS_PER_SECOND

  const label = ALGORITHM_LABELS[run.algorithm] + (run.heuristic ? ` · ${HEURISTIC_LABELS[run.heuristic]}` : '')

  return (
    <div className={`stats stats--${phase}`}>
      <div>
        <p className="stats__eyebrow">{label}</p>

        {phase === 'none' ? (
          <p className="stats__cost">
            <span className="stats__cost-now">No path</span>
          </p>
        ) : (
          <p className="stats__cost" aria-hidden="true">
            <span className="stats__cost-now">{hasPath ? costSoFar(run.path, visiblePath) : 0}</span>
            <span className="stats__cost-total">/ {run.cost}</span>
          </p>
        )}

        <p className="stats__status">{STATUS_TEXT[phase]}</p>
        {/* announced once, when the run finishes, instead of on every frame */}
        <p className="sr-only" aria-live="polite">
          {phase === 'done' ? `Path found with total cost ${run.cost}` : ''}
          {phase === 'none' ? 'No path found' : ''}
        </p>
      </div>

      <dl className="stats__details">
        <div className="stats__detail">
          <dt>Path length</dt>
          <dd>{hasPath ? run.path.length : '—'}</dd>
        </div>
        <div className="stats__detail">
          <dt>Explored</dt>
          <dd>{visibleVisited}</dd>
        </div>
        <div className="stats__detail">
          <dt>Time elapsed</dt>
          <dd>{elapsed.toFixed(1)} s</dd>
        </div>
      </dl>
    </div>
  )
}

export default StatsPanel