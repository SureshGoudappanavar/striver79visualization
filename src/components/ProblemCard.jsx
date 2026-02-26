export default function ProblemCard({ problem, onOpen }) {
  return (
    <div className={`card${problem.viz?' has-viz':''}`} onClick={() => onOpen(problem)} style={{cursor:'pointer'}}>
      <div className="card-top">
        <div className="card-num">#{problem.id}</div>
        <div className="card-badges">
          <span className={`badge diff-${problem.diff}`}>{problem.diff}</span>
          {problem.viz && <span className="viz-badge">✦ Animated</span>}
        </div>
      </div>
      <div className="card-name">{problem.name}</div>
      <div className="card-tags">
        {problem.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
      </div>
      {problem.viz && <div className="card-cta"><span>▶ Watch Animation</span></div>}
    </div>
  )
}