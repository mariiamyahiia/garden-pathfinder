# Garden Pathfinder

> Watch pathfinding algorithms find their way through a garden.

Garden Pathfinder is a pathfinding visualizer where the grid is a garden. A seed searches for a sunflower across soil, mud, water, and hedges. As an algorithm explores, the soil turns green; when it finds a route, a vine grows along it and blooms flowers as it goes. The headline number is the **total cost of the path**, counting up live as the vine grows.

## Features

- **Three algorithms**: BFS, Dijkstra, and A\* with a choice of Manhattan, Euclidean, or Chebyshev heuristics
- **Weighted terrain**: paint soil, mud, water, and hedges, and see Dijkstra and A\* detour around expensive ground while BFS walks straight through
- **Maze generation**: Randomized DFS, Prim's, and Recursive Division, animated as they carve, plus a **None** option that clears the board so you can build your own
- **Live cost card**: cost so far / final total as the vine grows, then path length, tiles explored, and time elapsed
- **Garden-themed rendering** on an HTML canvas: hedge blocks, wave-patterned water, dotted mud, and a continuous vine with blossoms
- **Tested logic**: all algorithm and maze logic is pure JavaScript with a Vitest suite

## How it looks

| Garden | Meaning |
|---|---|
| Seed | Start |
| Sunflower | Goal |
| Tan soil | Clear ground, **cost 1** |
| Plum with dots | Mud, **cost 5** |
| Indigo with a wave | Water, **cost 10** |
| Olive rounded block | Hedge, **blocked** |
| Green soil | Explored by the algorithm |
| Lime vine with plum blooms | The path |

### What does "cost" mean?

Every tile has a cost to cross. Stepping onto soil costs 1, mud costs 5, and water costs 10. A path's cost is the sum of the tiles it enters, and that total is the big number on the cost card. Dijkstra and A\* look for the **cheapest** route, so they go around mud and water whenever the detour costs less. BFS only counts tiles, so it takes the shortest route by tile count even if that route is expensive. Compare their totals on the same muddy map to see the difference.

## The algorithms

| Algorithm | Optimizes | Uses terrain cost | Notes |
|---|---|---|---|
| **BFS** | Fewest tiles | No | Explores in rings outward from the start |
| **Dijkstra** | Lowest total cost | Yes | Always expands the cheapest frontier tile next |
| **A\*** | Lowest total cost | Yes | Same result as Dijkstra, steered toward the goal by a heuristic, so it usually explores far fewer tiles |

**A\* heuristics.** Manhattan (`|dr| + |dc|`), Euclidean (straight-line distance), and Chebyshev (`max(|dr|, |dc|)`). On a 4-directional grid none of them overestimate the remaining cost, so A\* returns the same optimal cost as Dijkstra with any of them. Tighter estimates explore fewer tiles.

Dijkstra and A\* use a hand-written **binary min-heap** as their priority queue.

### Maze generators

| Generator | Character |
|---|---|
| **Randomized DFS** (recursive backtracker) | Long, winding corridors with few branches. Implemented iteratively with an explicit stack |
| **Prim's** | Short, bushy branches with many dead ends |
| **Recursive Division** | Starts open and adds walls; long straight walls, each with one gap |
| **None** | Clears all walls and terrain so you can paint your own |

The grid is **21 × 41**. Maze generators need odd dimensions so rooms sit on odd coordinates and walls on even ones. The generated mazes are "perfect" (exactly one route between any two points), so all three pathfinders find the same path through them, and the difference you'll see is in how many tiles each one explores.

## Getting started

**Prerequisites:** Node.js 20.19 or newer.

```bash
git clone https://github.com/<your-username>/garden-pathfinder.git
cd garden-pathfinder
npm install
npm run dev
```

Then open the local URL Vite prints.

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the Vitest suite in watch mode (use `npm test -- --run` for a single run) |

## How to use it

1. **Paint terrain.** Choose a brush (Hedge, Soil, Mud, Water) and click tiles on the grid. Clicking a hedge again removes it.
2. **Or generate a maze.** Pick a generator and press **Generate**. Pick **None** and press **Clear board** to start over without refreshing.
3. **Pick an algorithm** (and a heuristic for A\*) and press **Run**.
4. **Watch the cost card.** Editing the grid clears the previous run, since its results no longer match the garden.

## Architecture

The central rule: **algorithm logic never touches React or the DOM.** That keeps it easy to test and means rendering can change without touching it.

```
src/
  features/
    algorithms/
      logic/      bfs, dijkstra, astar, heuristics, minHeap, graphUtils, timeline  (pure JS, tested)
      ui/         AlgorithmPicker, animation hooks
      config.js   animation speed
    grid/
      logic/      grid data structure and immutable operations  (pure JS, tested)
      ui/         GridCanvas, MainGrid, BrushSelector
    maze/
      logic/      generators and step utilities  (pure JS, tested)
      ui/         MazeControls
    stats/ui/     StatsPanel (the cost card)
  shared/ui/      Panel, Icons
  store/          Zustand stores: grid, maze, playback
  styles/         global.css, ui.css
  theme/          palette.js, applyTheme.js
```

### Data flow

```
 grid (gridStore) ──► algorithm runs once ──► run = { visitedOrder, path, cost }
                                                          │
                       playbackStore: runs[], position t, isPlaying
                                                          │
            visible visited = min(t, V)     visible path = clamp(t - V, 0, P)
                                                          │
                                       GridCanvas draws exactly that
```

### Design decisions

- **Algorithms return data, they don't animate.** A run is `{ visitedOrder, path, cost }`. The UI replays it by advancing a single timeline position `t`, from which everything on screen (explored tiles, vine length, cost so far, elapsed time) is derived. This is what lets multiple runs share one clock for Race Mode.
- **Mazes work the same way.** Every generator returns `{ initial, steps }`: the starting layout plus an ordered list of "this tile becomes a wall/passage" changes, replayed by the same animation loop.
- **Immutable grid updates.** Every grid operation returns a new grid, so Zustand and React re-render correctly and each step can be treated as a snapshot.
- **Zustand for shared state.** The canvas, controls, and stats panel each subscribe only to the slices they need, with no prop drilling.
- **Presentational canvas.** `GridCanvas` takes a grid and an overlay as props and knows nothing about the stores; `MainGrid` is the thin connector. A second canvas for Race Mode is just another instance.
- **One source of truth for color.** `theme/palette.js` defines every color once. At startup it is written to CSS variables, and the canvas reads the same constants.
- **Results are cleared when the grid changes**, via a store subscription, so the overlay can never describe a garden that no longer exists.
- **Seedable randomness.** Maze generators accept an optional random function, so tests can produce deterministic mazes.

### Customizing

- **Animation speed:** change `ANIMATION_STEPS_PER_SECOND` in `src/features/algorithms/config.js`.
- **Colors:** edit `src/theme/palette.js`. Nothing else needs to change.
- **Costs:** the terrain weights are defined by `TERRAIN` in `src/features/grid/logic/grid.js`.

## Testing

```bash
npm test -- --run
```

The suite covers the grid operations, BFS, Dijkstra, A\* (including that it matches Dijkstra's cost), the binary heap, the timeline math, the playback store, and the theme palette. The maze tests check *properties* instead of fixed layouts: every open tile is reachable from every other, DFS and Prim's mazes contain no loops, borders stay intact, and a given seed always produces the same maze.

## Tech stack

- [React](https://react.dev) and [Vite](https://vite.dev)
- Canvas API for grid rendering
- [Zustand](https://zustand.docs.pmnd.rs) for state
- [Vitest](https://vitest.dev) for unit tests
- Plain CSS with variables; Quicksand and Nunito via [Fontsource](https://fontsource.org)

