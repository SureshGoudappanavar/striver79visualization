import { useEffect, useRef, useState, useCallback } from 'react'
import { VISUALIZERS } from './engine.js'

export default function ProblemModal({ problem, onClose }) {
  const viz = problem.viz ? VISUALIZERS[problem.viz] : null
  const overlayRef = useRef(null)

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Open animation on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      overlayRef.current?.classList.add('open')
    })
  }, [])

  const handleClose = () => {
    overlayRef.current?.classList.remove('open')
    setTimeout(onClose, 300)
  }

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">{problem.name}</div>
            <div className="modal-meta">
              <span className={`diff-badge diff-${problem.diff}`}>{problem.diff}</span>
              {problem.tags.map(t => <span key={t} className="tag">{t}</span>)}
              {viz && <span className="viz-badge">✦ Animated</span>}
            </div>
          </div>
          <button className="modal-close" onClick={handleClose}>✕</button>
        </div>
        <div className="modal-body">
          {viz
            ? <VizPanel viz={viz} />
            : <ComingSoon name={problem.name} />
          }
        </div>
      </div>
    </div>
  )
}

function ComingSoon({ name }) {
  return (
    <div className="coming-soon">
      <div className="cs-icon">🚧</div>
      <p>
        <strong>{name}</strong><br /><br />
        Visualizer coming soon! This problem is on the roadmap.<br /><br />
        The animated problems marked with <strong>▶ viz</strong> on the home screen are fully interactive.
      </p>
    </div>
  )
}

function VizPanel({ viz }) {
  const vizAreaRef = useRef(null)
  const timerRef = useRef(null)
  const stepsRef = useRef([])
  const stepIdxRef = useRef(0)
  const vizNumsRef = useRef(viz.init)

  const [isPlaying, setIsPlaying] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)
  const [speed, setSpeed] = useState(900)
  const [activePreset, setActivePreset] = useState(null)

  // Init visualizer on mount
  useEffect(() => {
    runViz(viz.init)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [viz])

  const runViz = useCallback((input) => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    setIsPlaying(false)

    const steps = viz.run(input)
    stepsRef.current = steps
    stepIdxRef.current = 0
    vizNumsRef.current = input
    setTotalSteps(steps.length)
    setStepIdx(0)

    if (vizAreaRef.current) {
      vizAreaRef.current.innerHTML = ''
      viz.render(vizAreaRef.current, steps[0], input)
      viz.update(steps[0], input)
      stepIdxRef.current = 1
      setStepIdx(1)
    }
  }, [viz])

  const doStep = useCallback(() => {
    if (stepIdxRef.current >= stepsRef.current.length) return false
    viz.update(stepsRef.current[stepIdxRef.current], vizNumsRef.current)
    stepIdxRef.current++
    setStepIdx(stepIdxRef.current)
    return true
  }, [viz])

  const handleStep = useCallback(() => {
    if (isPlaying) return
    doStep()
  }, [doStep, isPlaying])

  const handleReset = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    setIsPlaying(false)
    runViz(vizNumsRef.current)
  }, [runViz])

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      clearInterval(timerRef.current)
      timerRef.current = null
      setIsPlaying(false)
      return
    }
    // If at end, reset first
    if (stepIdxRef.current >= stepsRef.current.length) {
      runViz(vizNumsRef.current)
      // Small delay to let render settle before starting
      setTimeout(() => startAutoPlay(), 50)
      return
    }
    startAutoPlay()
  }, [isPlaying, doStep, speed])

  const startAutoPlay = () => {
    setIsPlaying(true)
    timerRef.current = setInterval(() => {
      const hasMore = doStep()
      if (!hasMore || stepIdxRef.current >= stepsRef.current.length) {
        clearInterval(timerRef.current)
        timerRef.current = null
        setIsPlaying(false)
      }
    }, speed)
  }

  // Speed change — restart timer if playing
  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed)
    if (isPlaying) {
      clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        const hasMore = doStep()
        if (!hasMore || stepIdxRef.current >= stepsRef.current.length) {
          clearInterval(timerRef.current)
          timerRef.current = null
          setIsPlaying(false)
        }
      }, newSpeed)
    }
  }

  const handlePreset = (presetVal, idx) => {
    setActivePreset(idx)
    runViz(presetVal)
  }

  const atEnd = stepIdx >= totalSteps
  const pct = totalSteps > 0 ? Math.round((stepIdx / totalSteps) * 100) : 0

  return (
    <>
      {/* Description */}
      <div
        className="desc-box"
        dangerouslySetInnerHTML={{ __html: viz.desc }}
      />

      {/* Presets */}
      {viz.presets && (
        <div className="preset-row">
          <span className="preset-label">PRESETS:</span>
          {viz.presets.map((p, i) => (
            <button
              key={i}
              className={`preset-btn${activePreset === i ? ' active' : ''}`}
              onClick={() => handlePreset(p, i)}
            >
              {Array.isArray(p)
                ? `[${p.slice(0,4).join(',')}${p.length > 4 ? '…' : ''}]`
                : typeof p === 'object' && p !== null
                  ? JSON.stringify(p).slice(0, 20) + (JSON.stringify(p).length > 20 ? '…' : '')
                  : String(p).slice(0, 16)
              }
            </button>
          ))}
        </div>
      )}

      {/* Viz container — visualizer engines write HTML directly into this div */}
      <div className="viz-area" ref={vizAreaRef} />

      {/* Controls */}
      <div className="viz-controls">
        <button className={`ctrl-btn primary`} onClick={handleTogglePlay}>
          {isPlaying ? '⏸ Pause' : atEnd ? '↺ Replay' : '▶ Auto'}
        </button>
        <button className="ctrl-btn" onClick={handleStep} disabled={isPlaying || atEnd}>
          → Step
        </button>
        <button className="ctrl-btn" onClick={handleReset}>
          ↺ Reset
        </button>
        <div className="speed-wrap">
          Speed:
          <input
            type="range"
            min="150"
            max="2000"
            step="50"
            value={speed}
            onChange={e => handleSpeedChange(Number(e.target.value))}
          />
          <span>{(speed / 1000).toFixed(2)}s</span>
        </div>
        <div className="step-counter">{stepIdx} / {totalSteps} ({pct}%)</div>
      </div>
    </>
  )
}
