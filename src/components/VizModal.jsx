import { useEffect, useRef, useState, useCallback } from 'react'
import { VISUALIZERS } from '../data/visualizers'
import { addLogLine, renderTree, renderGraph } from '../data/helpers'

// Expose DOM helpers globally because visualizer code calls them by name
if (typeof window !== 'undefined') {
  window.addLogLine = addLogLine
  window.renderTree = renderTree
  window.renderGraph = renderGraph
}

export default function VizModal({ problem, onClose }) {
  const vizAreaRef = useRef(null)
  const stateRef = useRef({ steps: [], step: 0, timer: null, input: null })
  const [speed, setSpeed] = useState(800)
  const [playing, setPlaying] = useState(false)

  const viz = VISUALIZERS[problem.viz]

  // ── init ──────────────────────────────────────────────────────────────────
  const doInit = useCallback((inputOverride) => {
    if (!viz || !vizAreaRef.current) return
    const st = stateRef.current
    if (st.timer) { clearInterval(st.timer); st.timer = null }
    setPlaying(false)

    const inp = inputOverride !== undefined ? inputOverride : viz.init
    st.input = inp
    st.steps = viz.run(inp)
    st.step = 0

    vizAreaRef.current.innerHTML = ''
    viz.render(vizAreaRef.current)
    if (st.steps[0]) viz.update(st.steps[0])
    st.step = 1
  }, [viz])

  useEffect(() => {
    const t = setTimeout(() => doInit(), 60)
    return () => {
      clearTimeout(t)
      const st = stateRef.current
      if (st.timer) clearInterval(st.timer)
    }
  }, [doInit])

  // ── controls ──────────────────────────────────────────────────────────────
  const loadPreset = (idx) => {
    if (!viz?.presets) return
    doInit(viz.presets[idx])
  }

  const stepOnce = () => {
    const st = stateRef.current
    if (st.step >= st.steps.length) return
    viz.update(st.steps[st.step])
    st.step++
  }

  const startAuto = useCallback((spd) => {
    const st = stateRef.current
    setPlaying(true)
    st.timer = setInterval(() => {
      const s = stateRef.current
      if (s.step >= s.steps.length) {
        clearInterval(s.timer); s.timer = null
        setPlaying(false)
        return
      }
      viz.update(s.steps[s.step])
      s.step++
    }, spd)
  }, [viz])

  const toggleAuto = useCallback(() => {
    const st = stateRef.current
    if (st.timer) {
      clearInterval(st.timer); st.timer = null
      setPlaying(false)
      return
    }
    // if finished, restart from beginning
    if (st.step >= st.steps.length) {
      doInit(st.input)
      setTimeout(() => startAuto(speed), 80)
    } else {
      startAuto(speed)
    }
  }, [speed, startAuto, doInit])

  const reset = () => doInit(stateRef.current.input)

  const handleSpeed = (e) => {
    const v = parseInt(e.target.value)
    setSpeed(v)
    if (stateRef.current.timer) {
      clearInterval(stateRef.current.timer)
      stateRef.current.timer = null
      setPlaying(false)
      setTimeout(() => startAuto(v), 0)
    }
  }

  const handleOverlay = (e) => { if (e.target === e.currentTarget) onClose() }

  // ── keyboard close ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!viz) return (
    <div className="modal-overlay open" onClick={handleOverlay}>
      <div className="modal">
        <div className="modal-header">
          <div><div className="modal-title">{problem.name}</div></div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{textAlign:'center',padding:'40px',color:'var(--text3)'}}>
            <div style={{fontSize:'2rem',marginBottom:'12px'}}>🚧</div>
            <p>Visualizer coming soon for this problem.</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="modal-overlay open" onClick={handleOverlay}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="modal-header">
          <div>
            <div className="modal-title">{viz.title}</div>
            <div className="modal-meta">
              <span className={`diff-badge diff-${problem.diff}`}>{problem.diff}</span>
              {problem.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="modal-body">
          {/* description */}
          <div className="instr" dangerouslySetInnerHTML={{ __html: viz.desc }} />

          {/* presets */}
          {viz.presets && viz.presets.length > 0 && (
            <div className="presets-row">
              <span className="presets-label">PRESETS:</span>
              {viz.presets.map((_, i) => (
                <button key={i} className="btn btn-ghost" style={{padding:'4px 10px',fontSize:'0.7rem'}} onClick={() => loadPreset(i)}>
                  Ex {i + 1}
                </button>
              ))}
            </div>
          )}

          {/* controls */}
          <div className="viz-controls">
            <button className="btn btn-primary" onClick={toggleAuto}>
              {playing ? '⏸ Pause' : '▶ Auto'}
            </button>
            <button className="btn btn-secondary" onClick={stepOnce}>→ Step</button>
            <button className="btn btn-ghost" onClick={reset}>↺ Reset</button>
            <div className="speed-wrap">
              Speed:
              <input type="range" min={150} max={2000} step={50} value={speed} onChange={handleSpeed} />
              <span>{(speed / 1000).toFixed(2)}s</span>
            </div>
          </div>

          {/* visualizer canvas — visualizer writes raw HTML into this div */}
          <div className="viz-area" ref={vizAreaRef} />
        </div>
      </div>
    </div>
  )
}
