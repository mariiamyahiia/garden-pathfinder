import { describe, it, expect } from 'vitest'
import { createGrid, getNeighbors } from '../../grid/logic/grid'
import { MAZE_GENERATORS } from './generators'
import { createRng, prepareGridForMaze, applyMazeSteps } from './mazeUtils'

const ROWS = 11
const COLS = 15
const ROOMS = ((ROWS - 1) / 2) * ((COLS - 1) / 2)

function buildMaze(name, seed = 42) {
  const { initial, steps } = MAZE_GENERATORS[name](ROWS, COLS, createRng(seed))
  let grid = createGrid(ROWS, COLS)
  grid = prepareGridForMaze(grid, initial)
  grid = applyMazeSteps(grid, steps)
  return { grid, steps }
}

function openTiles(grid) {
  return grid.flat().filter((n) => !n.isWall)
}

function isFullyConnected(grid) {
  const open = openTiles(grid)
  const seen = new Set([`${open[0].row},${open[0].col}`])
  const queue = [open[0]]
  while (queue.length) {
    const cur = queue.pop()
    for (const n of getNeighbors(grid, cur.row, cur.col)) {
      const k = `${n.row},${n.col}`
      if (!seen.has(k)) {
        seen.add(k)
        queue.push(n)
      }
    }
  }
  return seen.size === open.length
}

describe.each(['dfs', 'prim', 'division'])('%s maze generator', (name) => {
  it('throws on even dimensions', () => {
    expect(() => MAZE_GENERATORS[name](10, 15)).toThrow()
  })

  it('is deterministic for the same seed', () => {
    expect(buildMaze(name, 7).steps).toEqual(buildMaze(name, 7).steps)
  })

  it('keeps the outer border walled and every room open', () => {
    const { grid } = buildMaze(name)
    for (let c = 0; c < COLS; c++) {
      expect(grid[0][c].isWall).toBe(true)
      expect(grid[ROWS - 1][c].isWall).toBe(true)
    }
    for (let r = 0; r < ROWS; r++) {
      expect(grid[r][0].isWall).toBe(true)
      expect(grid[r][COLS - 1].isWall).toBe(true)
    }
    for (let r = 1; r < ROWS; r += 2) {
      for (let c = 1; c < COLS; c += 2) {
        expect(grid[r][c].isWall).toBe(false)
      }
    }
  })

  it('leaves every open tile reachable from every other', () => {
    expect(isFullyConnected(buildMaze(name).grid)).toBe(true)
  })
})

describe.each(['dfs', 'prim'])('%s is a perfect maze', (name) => {
  it('has exactly rooms + (rooms - 1) open tiles, so no loops', () => {
    const { grid } = buildMaze(name)
    expect(openTiles(grid).length).toBe(2 * ROOMS - 1)
  })
})

describe('applyMazeSteps', () => {
  it('never walls the start or end tile', () => {
    let grid = createGrid(5, 5, { row: 1, col: 1 }, { row: 3, col: 3 })
    grid = applyMazeSteps(grid, [
      { row: 1, col: 1, wall: true },
      { row: 3, col: 3, wall: true },
    ])
    expect(grid[1][1].isWall).toBe(false)
    expect(grid[3][3].isWall).toBe(false)
  })
})