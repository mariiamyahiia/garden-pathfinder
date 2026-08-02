import { useRef, useEffect, useCallback } from 'react'
import { useGridStore } from '../../../store/gridStore'

const CELL_SIZE = 24

function getNodeColor(node) {
  if (node.isStart) return '#f4d03f' // gardener/seed
  if (node.isEnd) return '#e74c3c' // sunflower
  if (node.isWall) return '#4a5d3a' // hedge
  return '#e8dcc4' // soil
}

function GridCanvas() {
  const canvasRef = useRef(null)
  const grid = useGridStore((state) => state.grid)
  const rows = useGridStore((state) => state.rows)
  const cols = useGridStore((state) => state.cols)
  const toggleWall = useGridStore((state) => state.toggleWall)

  const draw = useCallback(
    (ctx) => {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const node = grid[row][col]
          ctx.fillStyle = getNodeColor(node)
          ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
          ctx.strokeStyle = '#c9b896'
          ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        }
      }
    },
    [grid, rows, cols]
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