import { useGridStore } from '../../../store/gridStore'

const BRUSHES = [
  { id: 'wall', label: 'Hedge', hint: 'blocked', swatch: 'var(--hedge)', title: 'Hedges block the way completely' },
  { id: 'clear', label: 'Soil', hint: 'cost 1', swatch: 'var(--soil)', title: 'Normal ground: costs 1 to cross' },
  { id: 'mud', label: 'Mud', hint: 'cost 5', swatch: 'var(--mud)', title: 'Mud: costs 5 to cross, five times as much as soil' },
  { id: 'water', label: 'Water', hint: 'cost 10', swatch: 'var(--water)', title: 'Water: costs 10 to cross, ten times as much as soil' },
]

function BrushSelector() {
  const brush = useGridStore((state) => state.brush)
  const setBrush = useGridStore((state) => state.setBrush)

  return (
    <>
      <div className="chips" role="radiogroup" aria-label="Terrain brush">
        {BRUSHES.map((b) => (
          <button
            key={b.id}
            role="radio"
            aria-checked={brush === b.id}
            title={b.title}
            className={`chip ${brush === b.id ? 'chip--active' : ''}`}
            onClick={() => setBrush(b.id)}
          >
            <span className="chip__swatch" style={{ background: b.swatch }} />
            {b.label}
            <span className="chip__hint">{b.hint}</span>
          </button>
        ))}
      </div>
      <p className="panel__note">
        Every tile has a cost to cross. The big number above the board is the total cost of the
        path. Dijkstra and A* find the cheapest route, going around mud and water when that costs
        less, while BFS only counts tiles and walks straight through.
      </p>
    </>
  )
}

export default BrushSelector