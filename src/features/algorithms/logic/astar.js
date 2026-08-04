import { getNeighbors } from '../../grid/logic/grid'
import { MinHeap } from './minHeap'
import { nodeKey, findStart, findEnd, reconstructPath } from './graphUtils'
import { HEURISTICS } from './heuristics'

export function astar(grid, options = {}) {
  const { diagonal = false, heuristic = 'manhattan' } = options
  const h = HEURISTICS[heuristic]
  const start = findStart(grid)
  const end = findEnd(grid)
  if (!start || !end) return { visitedOrder: [], path: null, cost: null }

  const gScore = new Map([[nodeKey(start), 0]])
  const cameFrom = new Map()
  const visited = new Set()
  const visitedOrder = []

  const heap = new MinHeap((a, b) => a.priority - b.priority)
  heap.push({ node: start, priority: h(start, end) })

  while (heap.size > 0) {
    const { node: current } = heap.pop()
    const k = nodeKey(current)
    if (visited.has(k)) continue
    visited.add(k)
    visitedOrder.push(current)

    if (current.row === end.row && current.col === end.col) {
      return { visitedOrder, path: reconstructPath(cameFrom, current), cost: gScore.get(k) }
    }

    for (const neighbor of getNeighbors(grid, current.row, current.col, { diagonal })) {
      const nk = nodeKey(neighbor)
      if (visited.has(nk)) continue
      const tentativeG = gScore.get(k) + neighbor.weight
      if (tentativeG < (gScore.get(nk) ?? Infinity)) {
        gScore.set(nk, tentativeG)
        cameFrom.set(nk, current)
        heap.push({ node: neighbor, priority: tentativeG + h(neighbor, end) })
      }
    }
  }

  return { visitedOrder, path: null, cost: null }
}