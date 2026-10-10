import { recursiveBacktracker } from './recursiveBacktracker'
import { prims } from './prims'
import { recursiveDivision } from './recursiveDivision'

const none = () => ({ initial: 'open', steps: [] })

export const MAZE_GENERATORS = {
  none,
  dfs: recursiveBacktracker,
  prim: prims,
  division: recursiveDivision,
}