import { assertOddDimensions, randomInt, wallStep } from './mazeUtils'

export function recursiveDivision(rows, cols, rng = Math.random) {
  assertOddDimensions(rows, cols)
  const steps = []

  for (let c = 0; c < cols; c++) {
    steps.push(wallStep(0, c), wallStep(rows - 1, c))
  }
  for (let r = 1; r < rows - 1; r++) {
    steps.push(wallStep(r, 0), wallStep(r, cols - 1))
  }

  function divide(r1, r2, c1, c2) {
    const height = r2 - r1 + 1
    const width = c2 - c1 + 1
    if (height < 3 || width < 3) return // already a corridor

    let horizontal
    if (width > height) horizontal = false
    else if (height > width) horizontal = true
    else horizontal = rng() < 0.5

    if (horizontal) {
      const wallRow = r1 + 1 + 2 * randomInt(rng, 0, (height - 3) / 2)
      const gapCol = c1 + 2 * randomInt(rng, 0, (width - 1) / 2)
      for (let c = c1; c <= c2; c++) {
        if (c !== gapCol) steps.push(wallStep(wallRow, c))
      }
      divide(r1, wallRow - 1, c1, c2)
      divide(wallRow + 1, r2, c1, c2)
    } else {
      const wallCol = c1 + 1 + 2 * randomInt(rng, 0, (width - 3) / 2)
      const gapRow = r1 + 2 * randomInt(rng, 0, (height - 1) / 2)
      for (let r = r1; r <= r2; r++) {
        if (r !== gapRow) steps.push(wallStep(r, wallCol))
      }
      divide(r1, r2, c1, wallCol - 1)
      divide(r1, r2, wallCol + 1, c2)
    }
  }

  divide(1, rows - 2, 1, cols - 2)
  return { initial: 'open', steps }
}