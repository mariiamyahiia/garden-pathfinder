import { create } from 'zustand'
import { createGrid, toggleWall, setStart, setEnd, setTerrain, TERRAIN } from '../features/grid/logic/grid'

const ROWS = 20
const COLS = 40

export const useGridStore = create((set, get) => ({
  rows: ROWS,
  cols: COLS,
  grid: createGrid(ROWS, COLS, { row: 10, col: 5 }, { row: 10, col: 34 }),
  brush: 'wall', // 'wall' | 'mud' | 'water' | 'clear'

  setBrush: (brush) => set({ brush }),

  applyBrush: (row, col) => {
    const { brush, grid } = get()
    if (brush === 'wall') set({ grid: toggleWall(grid, row, col) })
    else set({ grid: setTerrain(grid, row, col, TERRAIN[brush.toUpperCase()].weight) })
  },

  setStart: (row, col) => set((state) => ({ grid: setStart(state.grid, row, col) })),
  setEnd: (row, col) => set((state) => ({ grid: setEnd(state.grid, row, col) })),
}))