export function nodeKey(node) {
  return `${node.row},${node.col}`
}

export function findStart(grid) {
  for (const row of grid) for (const node of row) if (node.isStart) return node
  return null
}

export function findEnd(grid) {
  for (const row of grid) for (const node of row) if (node.isEnd) return node
  return null
}

export function reconstructPath(cameFrom, endNode) {
  const path = [endNode]
  let k = nodeKey(endNode)
  while (cameFrom.has(k)) {
    const prev = cameFrom.get(k)
    path.unshift(prev)
    k = nodeKey(prev)
  }
  return path
}