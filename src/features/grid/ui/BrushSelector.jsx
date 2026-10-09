import { useGridStore } from '../../../store/gridStore'

const BRUSHES = [
  { id: 'wall', label: 'Rock/Hedge' },
  { id: 'mud', label: 'Mud' },
  { id: 'water', label: 'Water' },
  { id: 'clear', label: 'Clear Soil' },
]

function BrushSelector() {
  const brush = useGridStore((state) => state.brush)
  const setBrush = useGridStore((state) => state.setBrush)

  return (
    <div style={{ marginBottom: '0.5rem' }}>
      {BRUSHES.map((b) => (
        <button
          key={b.id}
          onClick={() => setBrush(b.id)}
          style={{
            marginRight: '0.5rem',
            fontWeight: brush === b.id ? 'bold' : 'normal',
            border: brush === b.id ? '2px solid #333' : '1px solid #ccc',
          }}
        >
          {b.label}
        </button>
      ))}
    </div>
  )
}

export default BrushSelector