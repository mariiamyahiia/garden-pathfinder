import { describe, it, expect } from 'vitest'
import { runLength, timelineLength, getVisibleCounts, clampPosition } from './timeline'

const node = (row, col) => ({ row, col })
const run = (visited, path) => ({
  visitedOrder: Array.from({ length: visited }, (_, i) => node(0, i)),
  path: path === null ? null : Array.from({ length: path }, (_, i) => node(1, i)),
})

describe('timeline', () => {
  it('counts visited plus path steps, and only visited when unreachable', () => {
    expect(runLength(run(10, 4))).toBe(14)
    expect(runLength(run(10, null))).toBe(10)
  })

  it('uses the longest run as the shared timeline length', () => {
    expect(timelineLength([run(10, 4), run(30, 5)])).toBe(35)
    expect(timelineLength([])).toBe(0)
  })

  it('shows only visited nodes before the path phase begins', () => {
    expect(getVisibleCounts(run(10, 4), 6)).toEqual({ visibleVisited: 6, visiblePath: 0 })
  })

  it('starts the path exactly when visiting finishes', () => {
    expect(getVisibleCounts(run(10, 4), 10)).toEqual({ visibleVisited: 10, visiblePath: 0 })
    expect(getVisibleCounts(run(10, 4), 12)).toEqual({ visibleVisited: 10, visiblePath: 2 })
  })

  it('lets a shorter run sit finished while a longer one keeps going', () => {
    expect(getVisibleCounts(run(10, 4), 99)).toEqual({ visibleVisited: 10, visiblePath: 4 })
  })

  it('clamps positions into range', () => {
    expect(clampPosition(-3, 20)).toBe(0)
    expect(clampPosition(25, 20)).toBe(20)
    expect(clampPosition(7, 20)).toBe(7)
  })
})