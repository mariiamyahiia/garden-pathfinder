import GridCanvas from './GridCanvas'
import { useGridStore } from '../../../store/gridStore'
import { usePlaybackStore } from '../../../store/playbackStore'
import { getVisibleCounts } from '../../algorithms/logic/timeline'

function MainGrid() {
  const grid = useGridStore((state) => state.grid)
  const applyBrush = useGridStore((state) => state.applyBrush)
  const run = usePlaybackStore((state) => state.runs[0])
  const position = usePlaybackStore((state) => state.position)

  const counts = run ? getVisibleCounts(run, position) : { visibleVisited: 0, visiblePath: 0 }

  return (
    <GridCanvas
      grid={grid}
      visitedOrder={run?.visitedOrder}
      visibleVisitedCount={counts.visibleVisited}
      path={run?.path}
      visiblePathCount={counts.visiblePath}
      onCellClick={applyBrush}
    />
  )
}

export default MainGrid