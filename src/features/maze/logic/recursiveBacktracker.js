import {
  assertOddDimensions, roomNeighbors, midpoint, pickRandom, randomInt,
  cellKey, openStep,
} from './mazeUtils'

export function recursiveBacktracker(rows, cols, rng = Math.random) {
  assertOddDimensions(rows, cols)
  const steps = []
  const visited = new Set()

  const start = {
    row: 1 + 2 * randomInt(rng, 0, (rows - 3) / 2),
    col: 1 + 2 * randomInt(rng, 0, (cols - 3) / 2),
  }
  visited.add(cellKey(start))
  steps.push(openStep(start))
  const stack = [start]

  while (stack.length > 0) {
    const current = stack[stack.length - 1]
    const options = roomNeighbors(current, rows, cols).filter(
      (n) => !visited.has(cellKey(n))
    )

    if (options.length === 0) {
      stack.pop()
      continue
    }

    const next = pickRandom(options, rng)
    visited.add(cellKey(next))
    steps.push(openStep(midpoint(current, next)))
    steps.push(openStep(next))
    stack.push(next)
  }

  return { initial: 'walls', steps }
}