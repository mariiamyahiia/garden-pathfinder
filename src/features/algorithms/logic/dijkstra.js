import { getNeighbors } from '../../grid/logic/grid'
import { MinHeap } from './minHeap'
import { nodeKey, findStart, findEnd, reconstructPath } from './graphUtils'

export function dijkstra(grid, options = {}) {
  const { diagonal = false } = options
  const start = findStart(grid)
  const end = findEnd(grid)
  if (!start || !end) return { visitedOrder: [], path: null, cost: null }

  const dist = new Map([[nodeKey(start), 0]])
  const cameFrom = new Map()
  const visited = new Set()
  const visitedOrder = []

  const heap = new MinHeap((a, b) => a.priority - b.priority)
  heap.push({ node: start, priority: 0 })

  while (heap.size > 0) {
    const { node: current } = heap.pop()
    const k = nodeKey(current)
    if (visited.has(k)) continue
    visited.add(k)
    visitedOrder.push(current)

    if (current.row === end.row && current.col === end.col) {
      return { visitedOrder, path: reconstructPath(cameFrom, current), cost: dist.get(k) }
    }

    for (const neighbor of getNeighbors(grid, current.row, current.col, { diagonal })) {
      const nk = nodeKey(neighbor)
      if (visited.has(nk)) continue
      const newDist = dist.get(k) + neighbor.weight
      if (newDist < (dist.get(nk) ?? Infinity)) {
        dist.set(nk, newDist)
        cameFrom.set(nk, current)
        heap.push({ node: neighbor, priority: newDist })
      }
    }
  }

  return { visitedOrder, path: null, cost: null }
}