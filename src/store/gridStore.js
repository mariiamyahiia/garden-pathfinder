import { create } from 'zustand'
import { createGrid, toggleWall, setStart, setEnd } from '../features/grid/logic/grid'

const ROWS = 20
const COLS = 40

export const useGridStore = create((set) => ({
  rows: ROWS,
  cols: COLS,
  grid: createGrid(ROWS, COLS, { row: 10, col: 5 }, { row: 10, col: 34 }),

  toggleWall: (row, col) =>
    set((state) => ({ grid: toggleWall(state.grid, row, col) })),

  setStart: (row, col) =>
    set((state) => ({ grid: setStart(state.grid, row, col) })),

  setEnd: (row, col) =>
    set((state) => ({ grid: setEnd(state.grid, row, col) })),
}))