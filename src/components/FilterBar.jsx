const DIFFS = ['all','easy','medium','hard']

export default function FilterBar({ categories, activeCategory, activeDiff, onCategory, onDiff }) {
  return (
    <div className="filter-bar">
      <button className={`filter-btn${activeCategory==='all'?' active':''}`} onClick={() => onCategory('all')}>All</button>
      {categories.map(cat => (
        <button key={cat.id}
          className={`filter-btn${activeCategory===cat.id?' active':''}`}
          style={activeCategory===cat.id ? {borderColor:cat.color,color:cat.color,background:`${cat.color}18`} : {}}
          onClick={() => onCategory(cat.id)}>
          <span>{cat.icon}</span> {cat.name}
        </button>
      ))}
      <div className="filter-sep" />
      {DIFFS.map(d => (
        <button key={d}
          className={`filter-btn diff-btn${activeDiff===d?' active':''} ${d!=='all'?d:''}`}
          onClick={() => onDiff(d)}>
          {d.charAt(0).toUpperCase()+d.slice(1)}
        </button>
      ))}
    </div>
  )
}