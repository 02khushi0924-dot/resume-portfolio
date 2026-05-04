export default function ExperienceSection({ experience }) {
  return (
    <section className="section" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', maxWidth: '100%', padding: '100px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div className="section-label">Career</div>
        <h2 className="section-title">Work Experience</h2>
        <div className="timeline">
          {experience.map((exp, i) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-dot" />
              <div className="timeline-period">{exp.period || exp.dates || ''}</div>
              <div className="timeline-role">{exp.role || exp.title || 'Role'}</div>
              <div className="timeline-company">{exp.company || exp.organization || ''}{exp.location ? ` · ${exp.location}` : ''}</div>
              {exp.description && <div className="timeline-desc">{exp.description}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
