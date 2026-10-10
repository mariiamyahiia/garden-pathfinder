import { useRef, useEffect, useCallback, useMemo } from 'react'
import { THEME } from '../../../theme/palette'

const CELL = 24
const EMOJI_FONT = `${Math.floor(CELL * 0.7)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`

function drawHedge(ctx, x, y) {
  ctx.beginPath()
  ctx.roundRect(x + 1, y + 1, CELL - 2, CELL - 2, 6)
  ctx.fillStyle = THEME.hedge
  ctx.fill()
  ctx.strokeStyle = THEME.hedgeEdge
  ctx.lineWidth = 1.5
  ctx.stroke()
}

function drawWave(ctx, x, y) {
  ctx.strokeStyle = THEME.wave
  ctx.lineWidth = 1.5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x + 5, y + 13)
  ctx.quadraticCurveTo(x + 8.5, y + 8, x + 12, y + 13)
  ctx.quadraticCurveTo(x + 15.5, y + 18, x + 19, y + 13)
  ctx.stroke()
}

function drawMudDots(ctx, x, y) {
  ctx.fillStyle = THEME.mudDot
  for (const [dx, dy, r] of [[8, 9, 2], [15, 14, 2.5], [9, 17, 1.5]]) {
    ctx.beginPath()
    ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawBloom(ctx, cx, cy, r) {
  ctx.fillStyle = THEME.bloomPetal
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
    ctx.beginPath()
    ctx.arc(cx + Math.cos(angle) * r * 0.65, cy + Math.sin(angle) * r * 0.65, r * 0.45, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = THEME.bloomCenter
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2)
  ctx.fill()
}

function drawVine(ctx, path, count) {
  if (!path || count < 1) return
  const center = (n) => [n.col * CELL + CELL / 2, n.row * CELL + CELL / 2]

  ctx.lineWidth = 7
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = THEME.vine
  ctx.beginPath()
  ctx.moveTo(...center(path[0]))
  for (let i = 1; i < count; i++) ctx.lineTo(...center(path[i]))
  ctx.stroke()

  for (let i = 1; i < count - 1; i++) {
    const [cx, cy] = center(path[i])
    if (i % 3 === 0) {
      drawBloom(ctx, cx, cy, 6)
    } else {
      ctx.fillStyle = THEME.bloomPetal
      ctx.beginPath()
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const tip = path[count - 1]
  if (count > 1 && !tip.isEnd) drawBloom(ctx, ...center(tip), 8)
}

function GridCanvas({
  grid,
  visitedOrder = [],
  visibleVisitedCount = 0,
  path = null,
  visiblePathCount = 0,
  onCellClick,
}) {
  const canvasRef = useRef(null)
  const rows = grid.length
  const cols = grid[0].length
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  const visitedSet = useMemo(() => {
    const set = new Set()
    for (let i = 0; i < visibleVisitedCount; i++) {
      set.add(`${visitedOrder[i].row},${visitedOrder[i].col}`)
    }
    return set
  }, [visitedOrder, visibleVisitedCount])

  const draw = useCallback(
    (ctx) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cols * CELL, rows * CELL)
      const markers = []

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const node = grid[row][col]
          const x = col * CELL
          const y = row * CELL
          const visited = visitedSet.has(`${row},${col}`)

          let fill = visited ? THEME.soilVisited : THEME.soil
          if (node.isWall) fill = THEME.soil
          else if (node.weight >= 10) fill = visited ? THEME.waterVisited : THEME.water
          else if (node.weight >= 5) fill = visited ? THEME.mudVisited : THEME.mud

          ctx.fillStyle = fill
          ctx.fillRect(x, y, CELL, CELL)
          ctx.strokeStyle = THEME.gridLine
          ctx.lineWidth = 1
          ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1)

          if (node.isWall) drawHedge(ctx, x, y)
          else if (node.weight >= 10) drawWave(ctx, x, y)
          else if (node.weight >= 5) drawMudDots(ctx, x, y)

          if (node.isStart) markers.push({ x, y, emoji: '🌱' })
          if (node.isEnd) markers.push({ x, y, emoji: '🌻' })
        }
      }

      drawVine(ctx, path, visiblePathCount)

      ctx.font = EMOJI_FONT
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const m of markers) ctx.fillText(m.emoji, m.x + CELL / 2, m.y + CELL / 2 + 1)
    },
    [grid, rows, cols, dpr, visitedSet, path, visiblePathCount]
  )

  useEffect(() => {
    draw(canvasRef.current.getContext('2d'))
  }, [draw])

  const handleClick = (e) => {
    if (!onCellClick) return
    const rect = canvasRef.current.getBoundingClientRect()
    const col = Math.floor((e.clientX - rect.left) / CELL)
    const row = Math.floor((e.clientY - rect.top) / CELL)
    if (row >= 0 && row < rows && col >= 0 && col < cols) onCellClick(row, col)
  }

  return (
    <canvas
      ref={canvasRef}
      width={cols * CELL * dpr}
      height={rows * CELL * dpr}
      onClick={handleClick}
      style={{
        display: 'block',
        width: cols * CELL,
        height: rows * CELL,
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 0 0 1px var(--border-strong)',
        cursor: onCellClick ? 'pointer' : 'default',
      }}
    />
  )
}

export default GridCanvas