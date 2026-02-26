import { useState, useMemo } from 'react'
import { CATEGORIES } from './data/categories'
import Nav from './components/Nav'
import Hero from './components/Hero'
import FilterBar from './components/FilterBar'
import ProblemGrid from './components/ProblemGrid'
import VizModal from './components/VizModal'

export default function App() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeDiff, setActiveDiff] = useState('all')
  const [modalProblem, setModalProblem] = useState(null)

  const allProblems = useMemo(() =>
    CATEGORIES.flatMap(cat =>
      cat.problems.map(p => ({ ...p, category: cat.id, categoryName: cat.name, categoryColor: cat.color, categoryIcon: cat.icon }))
    ), [])

  const filtered = useMemo(() => {
    let list = allProblems
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory)
    if (activeDiff !== 'all') list = list.filter(p => p.diff === activeDiff)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)))
    }
    return list
  }, [allProblems, activeCategory, activeDiff, search])

  return (
    <>
      <Nav search={search} onSearch={setSearch} />
      <Hero />
      <FilterBar categories={CATEGORIES} activeCategory={activeCategory} activeDiff={activeDiff} onCategory={setActiveCategory} onDiff={setActiveDiff} />
      <ProblemGrid problems={filtered} categories={CATEGORIES} activeCategory={activeCategory} onOpenProblem={setModalProblem} />
      {modalProblem && <VizModal problem={modalProblem} onClose={() => setModalProblem(null)} />}
    </>
  )
}