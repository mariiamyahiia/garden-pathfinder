import { recursiveBacktracker } from './recursiveBacktracker'
import { prims } from './prims'
import { recursiveDivision } from './recursiveDivision'

export const MAZE_GENERATORS = {
  dfs: recursiveBacktracker,
  prim: prims,
  division: recursiveDivision,
}