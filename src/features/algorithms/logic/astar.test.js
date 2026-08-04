import { describe, it, expect } from 'vitest'
import { createGrid, setTerrain, TERRAIN } from '../../grid/logic/grid'
import { astar } from './astar'
import { dijkstra } from './dijkstra'

describe('astar', () => {
  it('finds the same-cost path as dijkstra', () => {
    let grid = createGrid(6, 6, { row: 0, col: 0 }, { row: 5, col: 5 })
    grid = setTerrain(grid, 2, 2, TERRAIN.MUD.weight)
    grid = setTerrain(grid, 3, 3, TERRAIN.WATER.weight)
    expect(astar(grid, { heuristic: 'manhattan' }).cost).toBe(dijkstra(grid).cost)
  })

  it('visits no more nodes than dijkstra thanks to the heuristic', () => {
    const grid = createGrid(10, 10, { row: 0, col: 0 }, { row: 9, col: 9 })
    const d = dijkstra(grid)
    const a = astar(grid, { heuristic: 'manhattan' })
    expect(a.visitedOrder.length).toBeLessThanOrEqual(d.visitedOrder.length)
  })

  it('supports all three heuristics without error', () => {
    const grid = createGrid(5, 5, { row: 0, col: 0 }, { row: 4, col: 4 })
    expect(() => astar(grid, { heuristic: 'euclidean' })).not.toThrow()
    expect(() => astar(grid, { heuristic: 'chebyshev' })).not.toThrow()
  })
})