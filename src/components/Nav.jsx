export default function Nav({ search, onSearch }) {
  return (
    <nav>
      <div className="logo">striver<span>/</span>79</div>
      <div className="nav-right">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input type="text" value={search} onChange={e => onSearch(e.target.value)} placeholder="Search problems..." />
        </div>
        <div className="progress-pill">79 / 79 animated</div>
      </div>
    </nav>
  )
}