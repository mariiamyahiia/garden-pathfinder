import GridCanvas from './features/grid/ui/GridCanvas'
import AlgorithmRunner from './features/algorithms/ui/AlgorithmRunner'

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🌻 Garden Pathfinder 🌻</h1>
      <div style={{ marginBottom: '1rem' }}>
        <AlgorithmRunner />
      </div>
      <GridCanvas />
    </div>
  )
}

export default App