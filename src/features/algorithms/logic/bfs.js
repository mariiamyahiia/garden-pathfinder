import { getNeighbors } from '../../grid/logic/grid'
import { nodeKey, findStart, findEnd, reconstructPath } from './graphUtils'

export function bfs(grid, options = {}) {
  const { diagonal = false } = options
  const start = findStart(grid)
  const end = findEnd(grid)
  if (!start || !end) return { visitedOrder: [], path: null }

  const visited = new Set([nodeKey(start)])
  const cameFrom = new Map()
  const queue = [start]
  const visitedOrder = []

  while (queue.length > 0) {
    const current = queue.shift()
    visitedOrder.push(current)

    if (current.row === end.row && current.col === end.col) {
      return { visitedOrder, path: reconstructPath(cameFrom, current) }
    }

    for (const neighbor of getNeighbors(grid, current.row, current.col, { diagonal })) {
      const k = nodeKey(neighbor)
      if (!visited.has(k)) {
        visited.add(k)
        cameFrom.set(k, current)
        queue.push(neighbor)
      }
    }
  }

  return { visitedOrder, path: null } // end unreachable
}