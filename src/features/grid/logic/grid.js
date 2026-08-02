export function createNode(row, col) {
  return {
    row,
    col,
    isWall: false,
    isStart: false,
    isEnd: false,
    weight: 1, // terrain cost — used starting in Phase 4 (Dijkstra/A*)
  }
}

export function createGrid(rows, cols, startPos, endPos) {
  const grid = []
  for (let row = 0; row < rows; row++) {
    const currentRow = []
    for (let col = 0; col < cols; col++) {
      currentRow.push(createNode(row, col))
    }
    grid.push(currentRow)
  }
  if (startPos) grid[startPos.row][startPos.col].isStart = true
  if (endPos) grid[endPos.row][endPos.col].isEnd = true
  return grid
}

export function isInBounds(grid, row, col) {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length
}

export function cloneGrid(grid) {
  return grid.map((row) => row.map((node) => ({ ...node })))
}

export function toggleWall(grid, row, col) {
  const node = grid[row][col]
  if (node.isStart || node.isEnd) return grid // never wall off start/end
  const newGrid = cloneGrid(grid)
  newGrid[row][col].isWall = !newGrid[row][col].isWall
  return newGrid
}

export function setStart(grid, row, col) {
  const newGrid = cloneGrid(grid)
  for (const r of newGrid) for (const node of r) node.isStart = false
  newGrid[row][col].isStart = true
  newGrid[row][col].isWall = false
  return newGrid
}

export function setEnd(grid, row, col) {
  const newGrid = cloneGrid(grid)
  for (const r of newGrid) for (const node of r) node.isEnd = false
  newGrid[row][col].isEnd = true
  newGrid[row][col].isWall = false
  return newGrid
}

export function getNeighbors(grid, row, col, { diagonal = false } = {}) {
  const deltas = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]
  if (diagonal) {
    deltas.push([-1, -1], [-1, 1], [1, -1], [1, 1])
  }

  const neighbors = []
  for (const [dr, dc] of deltas) {
    const r = row + dr
    const c = col + dc
    if (isInBounds(grid, r, c) && !grid[r][c].isWall) {
      neighbors.push(grid[r][c])
    }
  }
  return neighbors
}