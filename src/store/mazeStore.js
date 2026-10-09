import { create } from 'zustand'
import { MAZE_GENERATORS } from '../features/maze/logic/generators'
import { useGridStore } from './gridStore'
import { useAlgorithmStore } from './algorithmStore'

export const useMazeStore = create((set, get) => ({
  generator: 'dfs',
  steps: [],
  visibleCount: 0,
  status: 'idle', // idle | generating

  setGenerator: (generator) => set({ generator }),

  generate: () => {
    const { rows, cols, prepareForMaze } = useGridStore.getState()
    const { initial, steps } = MAZE_GENERATORS[get().generator](rows, cols)
    useAlgorithmStore.getState().reset() // clear old visited/path overlay
    prepareForMaze(initial)
    set({ steps, visibleCount: 0, status: 'generating' })
  },

  advance: (count) => {
    const { steps, visibleCount } = get()
    const next = Math.min(count, steps.length)
    if (next > visibleCount) {
      useGridStore.getState().commitMazeSteps(steps.slice(visibleCount, next))
    }
    set({
      visibleCount: next,
      status: next === steps.length ? 'idle' : 'generating',
    })
  },
}))