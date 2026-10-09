import { create } from 'zustand'
import {
  createGrid, toggleWall, setStart, setEnd, setTerrain, TERRAIN,
} from '../features/grid/logic/grid'
import { prepareGridForMaze, applyMazeSteps } from '../features/maze/logic/mazeUtils'

const ROWS = 21
const COLS = 41

export const useGridStore = create((set, get) => ({
  rows: ROWS,
  cols: COLS,
  grid: createGrid(ROWS, COLS, { row: 9, col: 5 }, { row: 9, col: 35 }),
  brush: 'wall', // 'wall' | 'mud' | 'water' | 'clear'

  setBrush: (brush) => set({ brush }),

  applyBrush: (row, col) => {
    const { brush, grid } = get()
    if (brush === 'wall') set({ grid: toggleWall(grid, row, col) })
    else set({ grid: setTerrain(grid, row, col, TERRAIN[brush.toUpperCase()].weight) })
  },

  setStart: (row, col) => set((state) => ({ grid: setStart(state.grid, row, col) })),
  setEnd: (row, col) => set((state) => ({ grid: setEnd(state.grid, row, col) })),

  prepareForMaze: (initial) =>
    set((state) => ({ grid: prepareGridForMaze(state.grid, initial) })),

  commitMazeSteps: (steps) =>
    set((state) => ({ grid: applyMazeSteps(state.grid, steps) })),
}))