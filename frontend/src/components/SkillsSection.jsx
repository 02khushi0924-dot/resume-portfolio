export default function SkillsSection({ skills }) {
  return (
    <section className="section">
      <div className="section-label">Expertise</div>
      <h2 className="section-title">Skills & Technologies</h2>
      <div className="skills-categories">
        {Object.entries(skills).map(([category, items]) =>
          items.length > 0 && (
            <div className="skill-category" key={category}>
              <h4>{category}</h4>
              <div className="skill-pills">
                {items.map(skill => (
                  <span className="skill-pill highlight" key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  )
}
