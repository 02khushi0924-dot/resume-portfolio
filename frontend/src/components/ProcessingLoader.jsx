import { useEffect, useState } from 'react'

const STEPS = [
  { icon: '📄', label: 'Extracting text from resume', key: 'extract' },
  { icon: '🧠', label: 'Running NLP analysis', key: 'nlp' },
  { icon: '✨', label: 'AI generating your portfolio', key: 'ai' },
]

export default function ProcessingLoader() {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setActiveIdx(1), 1800)
    const t2 = setTimeout(() => setActiveIdx(2), 4000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="loader-overlay">
      <div className="loader-spinner" />
      <div className="loader-title">Building Your Portfolio</div>
      <div className="loader-sub">This takes just a few seconds…</div>
      <div className="loader-steps">
        {STEPS.map((s, i) => {
          const state = i < activeIdx ? 'done' : i === activeIdx ? 'active' : ''
          return (
            <div className={`loader-step ${state}`} key={s.key}>
              <span className="loader-step-icon">{s.icon}</span>
              <span className="loader-step-label">{s.label}</span>
              <span className="loader-step-status">
                {state === 'done' ? '✓ Done' : state === 'active' ? 'Processing…' : 'Waiting'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
