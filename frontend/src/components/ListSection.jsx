export default function ListSection({ title, items, label, icon }) {
  if (!items || items.length === 0) return null

  return (
    <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="section-label">{label}</div>
      <h2 className="section-title">{icon} {title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {items.map((item, i) => (
          <div key={i} className="glass" style={{ padding: '20px', borderRadius: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            ✦ {item}
          </div>
        ))}
      </div>
    </section>
  )
}
