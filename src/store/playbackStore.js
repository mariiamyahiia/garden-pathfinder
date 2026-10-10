import { create } from 'zustand'
import { bfs } from '../features/algorithms/logic/bfs'
import { dijkstra } from '../features/algorithms/logic/dijkstra'
import { astar } from '../features/algorithms/logic/astar'
import { pathCost } from '../features/algorithms/logic/graphUtils'
import { timelineLength, clampPosition } from '../features/algorithms/logic/timeline'
import { useGridStore } from './gridStore'

const ALGORITHMS = { bfs, dijkstra, astar }

export const usePlaybackStore = create((set, get) => ({
  algorithm: 'bfs',
  heuristic: 'manhattan',

  runs: [],
  position: 0,
  isPlaying: false,

  setAlgorithm: (algorithm) => set({ algorithm }),
  setHeuristic: (heuristic) => set({ heuristic }),

  run: () => {
    const { algorithm, heuristic } = get()
    const grid = useGridStore.getState().grid
    const options = algorithm === 'astar' ? { heuristic } : {}

    const t0 = performance.now()
    const { visitedOrder, path } = ALGORITHMS[algorithm](grid, options)
    const computeMs = performance.now() - t0

    set({
      runs: [
        {
          algorithm,
          heuristic: algorithm === 'astar' ? heuristic : null,
          visitedOrder,
          path,
          cost: pathCost(path),
          computeMs,
        },
      ],
      position: 0,
      isPlaying: true,
    })
  },

  advance: (steps) => {
    const { runs, position } = get()
    const length = timelineLength(runs)
    const next = clampPosition(position + steps, length)
    set({ position: next, isPlaying: next < length })
  },

  clear: () => set({ runs: [], position: 0, isPlaying: false }),
}))

useGridStore.subscribe((state, prevState) => {
  if (state.grid !== prevState.grid && usePlaybackStore.getState().runs.length > 0) {
    usePlaybackStore.getState().clear()
  }
})