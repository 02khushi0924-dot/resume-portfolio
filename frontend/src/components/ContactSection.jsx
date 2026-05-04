export default function ContactSection({ data }) {
  const contacts = [
    data.email && { icon: '📧', label: 'Email', value: data.email, href: `mailto:${data.email}` },
    data.phone && { icon: '📱', label: 'Phone', value: data.phone, href: `tel:${data.phone}` },
    data.linkedin && { icon: '🔗', label: 'LinkedIn', value: 'linkedin.com/in/...', href: data.linkedin },
    data.github && { icon: '🐙', label: 'GitHub', value: 'github.com/...', href: data.github },
    data.location && { icon: '📍', label: 'Location', value: data.location, href: null },
  ].filter(Boolean)

  return (
    <section className="section">
      <div className="section-label">Get in Touch</div>
      <h2 className="section-title">Contact</h2>
      <div className="contact-grid">
        {contacts.map((c, i) => (
          c.href
            ? <a className="contact-card" href={c.href} key={i} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <span className="contact-icon">{c.icon}</span>
                <div className="contact-info">
                  <span className="contact-label">{c.label}</span>
                  <span className="contact-value">{c.value}</span>
                </div>
              </a>
            : <div className="contact-card" key={i}>
                <span className="contact-icon">{c.icon}</span>
                <div className="contact-info">
                  <span className="contact-label">{c.label}</span>
                  <span className="contact-value">{c.value}</span>
                </div>
              </div>
        ))}
      </div>
    </section>
  )
}
