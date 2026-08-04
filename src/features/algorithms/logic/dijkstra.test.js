import { describe, it, expect } from 'vitest'
import { createGrid, setTerrain, toggleWall, TERRAIN } from '../../grid/logic/grid'
import { dijkstra } from './dijkstra'

describe('dijkstra', () => {
  it('finds the shortest path and correct cost in an open grid', () => {
    const grid = createGrid(5, 5, { row: 0, col: 0 }, { row: 0, col: 4 })
    const { path, cost } = dijkstra(grid)
    expect(path).not.toBeNull()
    expect(cost).toBe(4)
  })

  it('routes around expensive water even when it is the direct path', () => {
    let grid = createGrid(3, 3, { row: 1, col: 0 }, { row: 1, col: 2 })
    grid = setTerrain(grid, 1, 1, TERRAIN.WATER.weight)
    const { path } = dijkstra(grid)
    expect(path.some((n) => n.row === 1 && n.col === 1)).toBe(false)
  })

  it('returns a null path when unreachable', () => {
    let grid = createGrid(3, 3, { row: 0, col: 0 }, { row: 2, col: 2 })
    grid = toggleWall(grid, 1, 2)
    grid = toggleWall(grid, 2, 1)
    expect(dijkstra(grid).path).toBeNull()
  })
})