import { useRef, useEffect, useCallback, useMemo } from 'react'
import { useGridStore } from '../../../store/gridStore'
import { useAlgorithmStore } from '../../../store/algorithmStore'

const CELL_SIZE = 24

function getNodeColor(node, isVisited, isPath) {
  if (node.isStart) return '#f4d03f'
  if (node.isEnd) return '#e74c3c'
  if (node.isWall) return '#4a5d3a'
  if (isPath) return '#ff69b4' // blooming vine trail
  if (isVisited) return '#a3c99b' // watered/sprouted soil
  return '#e8dcc4'
}

function GridCanvas() {
  const canvasRef = useRef(null)
  const grid = useGridStore((state) => state.grid)
  const rows = useGridStore((state) => state.rows)
  const cols = useGridStore((state) => state.cols)
  const toggleWall = useGridStore((state) => state.toggleWall)

  const visitedOrder = useAlgorithmStore((state) => state.visitedOrder)
  const visibleVisitedCount = useAlgorithmStore((state) => state.visibleVisitedCount)
  const path = useAlgorithmStore((state) => state.path)
  const visiblePathCount = useAlgorithmStore((state) => state.visiblePathCount)

  const visitedSet = useMemo(() => {
    const set = new Set()
    for (let i = 0; i < visibleVisitedCount; i++) {
      set.add(`${visitedOrder[i].row},${visitedOrder[i].col}`)
    }
    return set
  }, [visitedOrder, visibleVisitedCount])

  const pathSet = useMemo(() => {
    const set = new Set()
    if (path) {
      for (let i = 0; i < visiblePathCount; i++) {
        set.add(`${path[i].row},${path[i].col}`)
      }
    }
    return set
  }, [path, visiblePathCount])

  const draw = useCallback(
    (ctx) => {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const node = grid[row][col]
          const k = `${row},${col}`
          ctx.fillStyle = getNodeColor(node, visitedSet.has(k), pathSet.has(k))
          ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
          ctx.strokeStyle = '#c9b896'
          ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        }
      }
    },
    [grid, rows, cols, visitedSet, pathSet]
  )

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    draw(ctx)
  }, [draw])

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const col = Math.floor((e.clientX - rect.left) / CELL_SIZE)
    const row = Math.floor((e.clientY - rect.top) / CELL_SIZE)
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      toggleWall(row, col)
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={cols * CELL_SIZE}
      height={rows * CELL_SIZE}
      onClick={handleClick}
      style={{ border: '2px solid #4a5d3a', cursor: 'pointer' }}
    />
  )
}

export default GridCanvas