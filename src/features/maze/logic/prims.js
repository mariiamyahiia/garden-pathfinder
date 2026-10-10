import {
  assertOddDimensions, roomNeighbors, midpoint, randomInt,
  cellKey, openStep,
} from './mazeUtils'

export function prims(rows, cols, rng = Math.random) {
  assertOddDimensions(rows, cols)
  const steps = []
  const inMaze = new Set()
  const candidates = [] // { from, to }

  function addRoom(cell) {
    inMaze.add(cellKey(cell))
    steps.push(openStep(cell))
    for (const n of roomNeighbors(cell, rows, cols)) {
      if (!inMaze.has(cellKey(n))) candidates.push({ from: cell, to: n })
    }
  }

  addRoom({
    row: 1 + 2 * randomInt(rng, 0, (rows - 3) / 2),
    col: 1 + 2 * randomInt(rng, 0, (cols - 3) / 2),
  })

  while (candidates.length > 0) {
    const i = randomInt(rng, 0, candidates.length - 1)
    const { from, to } = candidates[i]
    candidates[i] = candidates[candidates.length - 1]
    candidates.pop()

    if (inMaze.has(cellKey(to))) continue
    steps.push(openStep(midpoint(from, to)))
    addRoom(to)
  }

  return { initial: 'walls', steps }
}