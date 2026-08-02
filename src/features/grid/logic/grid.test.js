import { describe, it, expect } from 'vitest'
import {
  createGrid,
  toggleWall,
  setStart,
  setEnd,
  getNeighbors,
} from './grid'

describe('createGrid', () => {
  it('creates a grid with the correct dimensions', () => {
    const grid = createGrid(5, 8)
    expect(grid.length).toBe(5)
    expect(grid[0].length).toBe(8)
  })

  it('marks the start and end nodes', () => {
    const grid = createGrid(5, 8, { row: 0, col: 0 }, { row: 4, col: 7 })
    expect(grid[0][0].isStart).toBe(true)
    expect(grid[4][7].isEnd).toBe(true)
  })
})

describe('toggleWall', () => {
  it('toggles a wall on and off', () => {
    let grid = createGrid(5, 5)
    grid = toggleWall(grid, 2, 2)
    expect(grid[2][2].isWall).toBe(true)
    grid = toggleWall(grid, 2, 2)
    expect(grid[2][2].isWall).toBe(false)
  })

  it('does not wall the start node', () => {
    let grid = createGrid(5, 5, { row: 0, col: 0 })
    grid = toggleWall(grid, 0, 0)
    expect(grid[0][0].isWall).toBe(false)
  })

  it('does not mutate the original grid', () => {
    const grid = createGrid(5, 5)
    const newGrid = toggleWall(grid, 1, 1)
    expect(grid[1][1].isWall).toBe(false)
    expect(newGrid[1][1].isWall).toBe(true)
  })
})

describe('setStart / setEnd', () => {
  it('moves the start node and clears the old one', () => {
    let grid = createGrid(5, 5, { row: 0, col: 0 })
    grid = setStart(grid, 3, 3)
    expect(grid[0][0].isStart).toBe(false)
    expect(grid[3][3].isStart).toBe(true)
  })

  it('clears a wall when placing the end node on top of it', () => {
    let grid = createGrid(5, 5)
    grid = toggleWall(grid, 2, 2)
    grid = setEnd(grid, 2, 2)
    expect(grid[2][2].isWall).toBe(false)
    expect(grid[2][2].isEnd).toBe(true)
  })
})

describe('getNeighbors', () => {
  it('returns 4 orthogonal neighbors for a center node', () => {
    const grid = createGrid(5, 5)
    const neighbors = getNeighbors(grid, 2, 2)
    expect(neighbors.length).toBe(4)
  })

  it('excludes out-of-bounds neighbors for a corner node', () => {
    const grid = createGrid(5, 5)
    const neighbors = getNeighbors(grid, 0, 0)
    expect(neighbors.length).toBe(2)
  })

  it('excludes walls from neighbors', () => {
    let grid = createGrid(5, 5)
    grid = toggleWall(grid, 1, 2) // wall directly above (2,2)
    const neighbors = getNeighbors(grid, 2, 2)
    expect(neighbors.length).toBe(3)
  })

  it('includes 8 neighbors when diagonal is enabled', () => {
    const grid = createGrid(5, 5)
    const neighbors = getNeighbors(grid, 2, 2, { diagonal: true })
    expect(neighbors.length).toBe(8)
  })
})