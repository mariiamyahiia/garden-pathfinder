import { create } from 'zustand'
import { bfs } from '../features/algorithms/logic/bfs'
import { dijkstra } from '../features/algorithms/logic/dijkstra'
import { astar } from '../features/algorithms/logic/astar'
import { useGridStore } from './gridStore'

const ALGORITHMS = { bfs, dijkstra, astar }

export const useAlgorithmStore = create((set, get) => ({
  algorithm: 'bfs',
  heuristic: 'manhattan',
  visitedOrder: [],
  path: null,
  cost: null,
  visibleVisitedCount: 0,
  visiblePathCount: 0,
  status: 'idle',

  setAlgorithm: (algorithm) => set({ algorithm }),
  setHeuristic: (heuristic) => set({ heuristic }),

  run: () => {
    const { algorithm, heuristic } = get()
    const grid = useGridStore.getState().grid
    const options = algorithm === 'astar' ? { heuristic } : {}
    const { visitedOrder, path, cost } = ALGORITHMS[algorithm](grid, options)
    set({ visitedOrder, path, cost: cost ?? null, visibleVisitedCount: 0, visiblePathCount: 0, status: 'visiting' })
  },

  advanceVisited: (count) => {
    const { visitedOrder, path } = get()
    const next = Math.min(count, visitedOrder.length)
    set({ visibleVisitedCount: next })
    if (next === visitedOrder.length) set({ status: path ? 'pathing' : 'done' })
  },

  advancePath: (count) => {
    const { path } = get()
    if (!path) return
    const next = Math.min(count, path.length)
    set({ visiblePathCount: next })
    if (next === path.length) set({ status: 'done' })
  },

  reset: () =>
    set({ visitedOrder: [], path: null, cost: null, visibleVisitedCount: 0, visiblePathCount: 0, status: 'idle' }),
}))