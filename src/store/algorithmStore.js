import { create } from 'zustand'
import { bfs } from '../features/algorithms/logic/bfs'
import { useGridStore } from './gridStore'

export const useAlgorithmStore = create((set, get) => ({
  visitedOrder: [],
  path: null,
  visibleVisitedCount: 0,
  visiblePathCount: 0,
  status: 'idle', // idle | visiting | pathing | done

  runBFS: () => {
    const grid = useGridStore.getState().grid
    const { visitedOrder, path } = bfs(grid)
    set({ visitedOrder, path, visibleVisitedCount: 0, visiblePathCount: 0, status: 'visiting' })
  },

  advanceVisited: (count) => {
    const { visitedOrder, path } = get()
    const next = Math.min(count, visitedOrder.length)
    set({ visibleVisitedCount: next })
    if (next === visitedOrder.length) {
      set({ status: path ? 'pathing' : 'done' })
    }
  },

  advancePath: (count) => {
    const { path } = get()
    if (!path) return
    const next = Math.min(count, path.length)
    set({ visiblePathCount: next })
    if (next === path.length) set({ status: 'done' })
  },

  reset: () =>
    set({ visitedOrder: [], path: null, visibleVisitedCount: 0, visiblePathCount: 0, status: 'idle' }),
}))