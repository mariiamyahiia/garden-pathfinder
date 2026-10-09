import { cloneGrid } from '../../grid/logic/grid'

export function createRng(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function randomInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1))
}

export function pickRandom(array, rng) {
  return array[Math.floor(rng() * array.length)]
}

export function assertOddDimensions(rows, cols) {
  if (rows % 2 === 0 || cols % 2 === 0) {
    throw new Error(`Maze dimensions must be odd, got ${rows}x${cols}`)
  }
}

const DELTAS = [[-2, 0], [2, 0], [0, -2], [0, 2]]

export function roomNeighbors(cell, rows, cols) {
  const result = []
  for (const [dr, dc] of DELTAS) {
    const row = cell.row + dr
    const col = cell.col + dc
    if (row >= 1 && row <= rows - 2 && col >= 1 && col <= cols - 2) {
      result.push({ row, col })
    }
  }
  return result
}

export function midpoint(a, b) {
  return { row: (a.row + b.row) / 2, col: (a.col + b.col) / 2 }
}

export const cellKey = (cell) => `${cell.row},${cell.col}`
export const openStep = (cell) => ({ row: cell.row, col: cell.col, wall: false })
export const wallStep = (row, col) => ({ row, col, wall: true })

export function prepareGridForMaze(grid, initial) {
  return grid.map((row) =>
    row.map((node) => ({
      ...node,
      weight: 1,
      isWall: initial === 'walls' && !node.isStart && !node.isEnd,
    }))
  )
}

export function applyMazeSteps(grid, steps) {
  const newGrid = cloneGrid(grid)
  for (const { row, col, wall } of steps) {
    const node = newGrid[row][col]
    if (node.isStart || node.isEnd) continue
    node.isWall = wall
  }
  return newGrid
}