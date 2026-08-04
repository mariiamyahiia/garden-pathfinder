import { describe, it, expect } from 'vitest'
import { MinHeap } from './minHeap'

describe('MinHeap', () => {
  it('pops items in ascending priority order', () => {
    const heap = new MinHeap((a, b) => a.priority - b.priority)
    for (const v of [5, 1, 4, 2, 8, 0, 3]) heap.push({ priority: v })
    const popped = []
    while (heap.size > 0) popped.push(heap.pop().priority)
    expect(popped).toEqual([0, 1, 2, 3, 4, 5, 8])
  })

  it('reports size correctly', () => {
    const heap = new MinHeap((a, b) => a.priority - b.priority)
    expect(heap.size).toBe(0)
    heap.push({ priority: 1 })
    heap.push({ priority: 2 })
    expect(heap.size).toBe(2)
    heap.pop()
    expect(heap.size).toBe(1)
  })

  it('returns undefined when popping an empty heap', () => {
    const heap = new MinHeap((a, b) => a.priority - b.priority)
    expect(heap.pop()).toBeUndefined()
  })
})