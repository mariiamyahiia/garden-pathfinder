import { describe, it, expect } from 'vitest'
import { pathCost, costSoFar } from './graphUtils'

describe('pathCost', () => {
  it('sums the weights of every node entered, excluding the start', () => {
    const path = [{ weight: 1 }, { weight: 5 }, { weight: 10 }, { weight: 1 }]
    expect(pathCost(path)).toBe(16)
  })

  it('returns null when there is no path', () => {
    expect(pathCost(null)).toBeNull()
  })
})

describe('costSoFar', () => {
  const path = [{ weight: 1 }, { weight: 5 }, { weight: 10 }, { weight: 1 }]

  it('is zero before the vine has left the start tile', () => {
    expect(costSoFar(path, 0)).toBe(0)
    expect(costSoFar(path, 1)).toBe(0)
  })

  it('accumulates as the vine grows and matches the total at the end', () => {
    expect(costSoFar(path, 2)).toBe(5)
    expect(costSoFar(path, 3)).toBe(15)
    expect(costSoFar(path, path.length)).toBe(pathCost(path))
  })
})