export default function EducationSection({ education }) {
  return (
    <section className="section">
      <div className="section-label">Academic Background</div>
      <h2 className="section-title">Education</h2>
      <div className="edu-grid">
        {education.map((edu, i) => (
          <div className="edu-card" key={i}>
            <div className="edu-school" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-color)' }}>{edu.institution || edu.school || ''}</div>
            <div className="edu-degree">{edu.degree || edu.qualification || 'Degree'}</div>
            <div className="edu-year">{edu.year || edu.dates || edu.period || ''}</div>
            {(edu.gpa || edu.cgpa) && (
              <div style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                GPA/CGPA: {edu.gpa || edu.cgpa}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
