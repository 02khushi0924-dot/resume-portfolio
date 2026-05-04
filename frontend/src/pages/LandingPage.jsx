import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseResume } from '../api/resumeApi'
import ProcessingLoader from '../components/ProcessingLoader'

export default function LandingPage() {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState('Modern UI')
  const inputRef = useRef()
  const navigate = useNavigate()

  const themes = [
    { id: 'Minimalist', label: 'Minimalist', desc: 'Clean, short, simple, less text', icon: '◻️' },
    { id: 'Artistic', label: 'Artistic', desc: 'Creative wording, expressive descriptions', icon: '🎨' },
    { id: 'Modern UI', label: 'Modern UI', desc: 'Professional, bold, tech-oriented', icon: '⚡' }
  ]

  const accept = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

  const handleFile = (f) => {
    setError('')
    if (!f) return
    if (!accept.includes(f.type)) { setError('Only PDF or DOCX files are supported.'); return }
    if (f.size > 5 * 1024 * 1024) { setError('File must be under 5 MB.'); return }
    setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleGenerate = async () => {
    if (!file) return
    setLoading(true); setError('')
    try {
      const data = await parseResume(file, theme)
      navigate('/portfolio', { state: { portfolio: data, theme } })
    } catch (err) {
      setError(err.message || 'Something went wrong. Make sure the backend is running.')
      setLoading(false)
    }
  }

  const fmt = (n) => n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`

  return (
    <>
      {loading && <ProcessingLoader />}
      <div className="landing">

        <section className="hero">
          <div className="hero-tag">✨ Upload once, impress forever</div>
          <h1 style={{ lineHeight: '1.2' }}>
            <span style={{ fontSize: 'min(3.5rem, 5vw)', display: 'block' }}>Turn Your Resume Into A</span>
            <span className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>Stunning Portfolio</span>
          </h1>

          <div
            className={`upload-zone ${dragging ? 'drag-over' : ''}`}
            onClick={() => inputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input ref={inputRef} type="file" accept=".pdf,.docx" onChange={e => handleFile(e.target.files[0])} />
            <div className="upload-icon">{file ? '📄' : '☁️'}</div>
            <h3>{file ? 'File ready!' : 'Drag & drop your resume'}</h3>
            <p>{file ? file.name : 'or click to browse — PDF or DOCX, max 5 MB'}</p>
          </div>

          {file && (
            <>
              <div className="file-selected">
                <span className="file-icon">📋</span>
                <span className="file-name">{file.name}</span>
                <span className="file-size">{fmt(file.size)}</span>
                <button onClick={(e) => { e.stopPropagation(); setFile(null) }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
              </div>

              <div className="theme-selection">
                <h3 className="theme-title">Select Your Design Style</h3>
                <div className="theme-grid">
                  {themes.map(t => (
                    <div
                      key={t.id}
                      className={`theme-card ${theme === t.id ? 'active' : ''}`}
                      onClick={() => setTheme(t.id)}
                    >
                      <div className="theme-icon">{t.icon}</div>
                      <div className="theme-info">
                        <h4>{t.label}</h4>
                        <p>{t.desc}</p>
                      </div>
                      <div className="theme-check">{theme === t.id ? '✓' : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {error && <div className="error-msg">⚠️ {error}</div>}

          <div className="upload-actions">
            <button className="btn-primary" onClick={handleGenerate} disabled={!file}>
              ✦ Generate My Portfolio
            </button>
            {file && <button className="btn-secondary" onClick={() => setFile(null)}>Clear</button>}
          </div>
        </section>
      </div>
    </>
  )
}
