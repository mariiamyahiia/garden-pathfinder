import { getNeighbors } from '../../grid/logic/grid'

export function bfs(grid, options = {}) {
  const { diagonal = false } = options
  const start = findStart(grid)
  const end = findEnd(grid)
  if (!start || !end) return { visitedOrder: [], path: null }

  const visited = new Set([key(start)])
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
      const k = key(neighbor)
      if (!visited.has(k)) {
        visited.add(k)
        cameFrom.set(k, current)
        queue.push(neighbor)
      }
    }
  }

  return { visitedOrder, path: null } // end unreachable
}

function key(node) {
  return `${node.row},${node.col}`
}

function findStart(grid) {
  for (const row of grid) for (const node of row) if (node.isStart) return node
  return null
}

function findEnd(grid) {
  for (const row of grid) for (const node of row) if (node.isEnd) return node
  return null
}

function reconstructPath(cameFrom, endNode) {
  const path = [endNode]
  let currentKey = key(endNode)
  while (cameFrom.has(currentKey)) {
    const prev = cameFrom.get(currentKey)
    path.unshift(prev)
    currentKey = key(prev)
  }
  return path
}