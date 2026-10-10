import { describe, it, expect } from 'vitest'
import { createGrid } from '../../grid/logic/grid'
import { MAZE_GENERATORS } from './generators'
import { prepareGridForMaze, applyMazeSteps } from './mazeUtils'

describe('none generator', () => {
  it('produces an open layout with no steps', () => {
    expect(MAZE_GENERATORS.none(21, 41)).toEqual({ initial: 'open', steps: [] })
  })

  it('clears walls and terrain but keeps the start and end tiles', () => {
    const grid = createGrid(5, 5, { row: 1, col: 1 }, { row: 3, col: 3 })
    grid[2][2].isWall = true
    grid[0][4].weight = 10

    const { initial, steps } = MAZE_GENERATORS.none(5, 5)
    const result = applyMazeSteps(prepareGridForMaze(grid, initial), steps)

    expect(result.flat().some((n) => n.isWall)).toBe(false)
    expect(result.flat().every((n) => n.weight === 1)).toBe(true)
    expect(result[1][1].isStart).toBe(true)
    expect(result[3][3].isEnd).toBe(true)
  })
})