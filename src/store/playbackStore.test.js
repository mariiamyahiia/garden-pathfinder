import { describe, it, expect, beforeEach } from 'vitest'
import { usePlaybackStore } from './playbackStore'
import { useGridStore } from './gridStore'
import { timelineLength } from '../features/algorithms/logic/timeline'

const state = () => usePlaybackStore.getState()

beforeEach(() => state().clear())

describe('playbackStore', () => {
  it('starts a run at position 0 and playing', () => {
    state().run()
    expect(state().runs.length).toBe(1)
    expect(state().position).toBe(0)
    expect(state().isPlaying).toBe(true)
  })

  it('advances along the timeline while playing', () => {
    state().run()
    state().advance(5)
    expect(state().position).toBe(5)
    expect(state().isPlaying).toBe(true)
  })

  it('stops playing at the end of the timeline and never overshoots', () => {
    state().run()
    const length = timelineLength(state().runs)
    state().advance(length + 50)
    expect(state().position).toBe(length)
    expect(state().isPlaying).toBe(false)
  })

  it('computes a terrain cost for the path, even for BFS', () => {
    state().run()
    expect(state().runs[0].cost).toBeGreaterThan(0)
  })

  it('clears results when the grid changes', () => {
    state().run()
    useGridStore.getState().applyBrush(1, 1) 
    expect(state().runs.length).toBe(0)
    useGridStore.getState().applyBrush(1, 1)
  })
})