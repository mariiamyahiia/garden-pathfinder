import './App.css'
import Panel from './shared/ui/Panel'
import { SproutIcon } from './shared/ui/Icons'
import MainGrid from './features/grid/ui/MainGrid'
import BrushSelector from './features/grid/ui/BrushSelector'
import MazeControls from './features/maze/ui/MazeControls'
import AlgorithmPicker from './features/algorithms/ui/AlgorithmPicker'
import StatsPanel from './features/stats/ui/StatsPanel'
import { useRunAnimation } from './features/algorithms/ui/useRunAnimation'

function App() {
  useRunAnimation()

  return (
    <div className="app">
      <header className="app__header">
        <SproutIcon size={44} className="app__logo" />
        <div>
          <h1 className="app__title">Garden Pathfinder</h1>
          <p className="app__tagline">Watch algorithms find their way through the garden.</p>
        </div>
      </header>

      <div className="controls">
        <Panel title="Terrain"><BrushSelector /></Panel>
        <Panel title="Maze"><MazeControls /></Panel>
        <Panel title="Pathfinding"><AlgorithmPicker /></Panel>
      </div>

      <main className="board">
        <StatsPanel />
        <div className="board__scroll">
          <MainGrid />
        </div>
      </main>
    </div>
  )
}

export default App