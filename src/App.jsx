import GridCanvas from './features/grid/ui/GridCanvas'
import AlgorithmRunner from './features/algorithms/ui/AlgorithmRunner'
import BrushSelector from './features/grid/ui/BrushSelector'
import MazeControls from './features/maze/ui/MazeControls'

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Garden Pathfinder</h1>
      <BrushSelector />
      <MazeControls />
      <AlgorithmRunner />
      <GridCanvas />
    </div>
  )
}

export default App