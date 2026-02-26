import { CATEGORIES } from '../data/categories'
import ProblemCard from './ProblemCard'

export default function ProblemGrid({ problems, activeCategory, onOpenProblem }) {
  if (activeCategory !== 'all') {
    const cat = CATEGORIES.find(c => c.id === activeCategory)
    return (
      <div className="main">
        {cat && (
          <div className="section">
            <div className="section-header">
              <span className="section-icon" style={{color:cat.color}}>{cat.icon}</span>
              <span className="section-name">{cat.name}</span>
              <span className="section-count">{problems.length} problems</span>
            </div>
            <div className="cards-grid">
              {problems.map(p => <ProblemCard key={p.id} problem={p} onOpen={onOpenProblem} />)}
            </div>
          </div>
        )}
        {problems.length === 0 && <div className="empty-state">No problems match your search.</div>}
      </div>
    )
  }

  const grouped = CATEGORIES.map(cat => ({
    ...cat, items: problems.filter(p => p.category === cat.id)
  })).filter(cat => cat.items.length > 0)

  return (
    <div className="main">
      {grouped.map(cat => (
        <div key={cat.id} className="section">
          <div className="section-header">
            <span className="section-icon" style={{color:cat.color}}>{cat.icon}</span>
            <span className="section-name">{cat.name}</span>
            <span className="section-count">{cat.items.length} problems</span>
          </div>
          <div className="cards-grid">
            {cat.items.map(p => <ProblemCard key={p.id} problem={p} onOpen={onOpenProblem} />)}
          </div>
        </div>
      ))}
      {grouped.length === 0 && <div className="empty-state">No problems match your search.</div>}
    </div>
  )
}