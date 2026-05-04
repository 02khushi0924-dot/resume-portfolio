export default function ProjectsSection({ projects }) {
  return (
    <section className="section" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', maxWidth: '100%', padding: '100px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div className="section-label">Portfolio</div>
        <h2 className="section-title">Projects</h2>
        <div className="projects-grid">
          {projects.map((proj, i) => (
            <div className="project-card" key={i}>
              <div className="project-title">{proj.title || proj.name || 'Project'}</div>
              <div className="project-desc">{proj.description || ''}</div>
              {proj.impact && <div className="project-desc" style={{ fontStyle: 'italic', marginTop: 8 }}>Impact: {proj.impact}</div>}
              {proj.outcomes && <div className="project-desc" style={{ fontStyle: 'italic', marginTop: 8 }}>Outcomes: {proj.outcomes}</div>}
              {proj.technologies?.length > 0 && (
                <div className="project-tags">
                  {proj.technologies.map(t => (
                    <span className="project-tag" key={t}>{t}</span>
                  ))}
                </div>
              )}
              {proj.link && (
                <a href={proj.link} target="_blank" rel="noreferrer"
                  style={{ marginTop: 14, fontSize: '0.85rem', color: 'var(--accent-2)', textDecoration: 'none' }}>
                  🔗 View Project
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
