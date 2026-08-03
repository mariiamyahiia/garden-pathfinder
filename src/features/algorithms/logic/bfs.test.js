import { describe, it, expect } from 'vitest'
import { createGrid, toggleWall } from '../../grid/logic/grid'
import { bfs } from './bfs'

describe('bfs', () => {
  it('finds the shortest path in an open grid', () => {
    const grid = createGrid(5, 5, { row: 0, col: 0 }, { row: 0, col: 4 })
    const { path } = bfs(grid)
    expect(path).not.toBeNull()
    expect(path.length).toBe(5) // straight line, 5 nodes inclusive
    expect(path[0]).toMatchObject({ row: 0, col: 0 })
    expect(path[path.length - 1]).toMatchObject({ row: 0, col: 4 })
  })

  it('routes around a wall', () => {
    let grid = createGrid(3, 3, { row: 0, col: 0 }, { row: 0, col: 2 })
    grid = toggleWall(grid, 0, 1) // block the direct path
    const { path } = bfs(grid)
    expect(path).not.toBeNull()
    expect(path.some((n) => n.row === 1 && n.col === 1)).toBe(true)
  })

  it('returns a null path when the end is unreachable', () => {
    let grid = createGrid(3, 3, { row: 0, col: 0 }, { row: 2, col: 2 })
    grid = toggleWall(grid, 1, 2)
    grid = toggleWall(grid, 2, 1)
    const { path, visitedOrder } = bfs(grid)
    expect(path).toBeNull()
    expect(visitedOrder.length).toBeGreaterThan(0) // still explored what it could
  })

  it('visits nodes in breadth-first order (start first)', () => {
    const grid = createGrid(4, 4, { row: 0, col: 0 }, { row: 3, col: 3 })
    const { visitedOrder } = bfs(grid)
    expect(visitedOrder[0]).toMatchObject({ row: 0, col: 0 })
  })
})