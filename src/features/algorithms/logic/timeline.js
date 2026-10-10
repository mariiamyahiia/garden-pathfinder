export function runLength(run) {
  return run.visitedOrder.length + (run.path ? run.path.length : 0)
}

export function timelineLength(runs) {
  return runs.reduce((max, run) => Math.max(max, runLength(run)), 0)
}

export function getVisibleCounts(run, position) {
  const visitedLen = run.visitedOrder.length
  const pathLen = run.path ? run.path.length : 0
  return {
    visibleVisited: Math.min(position, visitedLen),
    visiblePath: Math.min(Math.max(position - visitedLen, 0), pathLen),
  }
}

export function clampPosition(position, length) {
  return Math.min(Math.max(position, 0), length)
}