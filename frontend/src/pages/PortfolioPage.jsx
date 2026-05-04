import { useLocation, useNavigate } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import SkillsSection from '../components/SkillsSection'
import ExperienceSection from '../components/ExperienceSection'
import EducationSection from '../components/EducationSection'
import ProjectsSection from '../components/ProjectsSection'
import ContactSection from '../components/ContactSection'
import ListSection from '../components/ListSection'

export default function PortfolioPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const portfolioRaw = state?.portfolio

  if (!portfolioRaw) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: '3rem' }}>🤔</div>
        <h2>No portfolio data found</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Please upload a resume first.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Go Back</button>
      </div>
    )
  }

  const design = portfolioRaw.design || {}
  const portfolioContent = portfolioRaw.content || portfolioRaw
  
  // Flatten the contact info and ensure compatibility with components
  const portfolio = {
    ...portfolioContent,
    ...portfolioContent.contact,
    experience: portfolioContent.experience?.map(exp => ({
      ...exp,
      description: exp.description || exp.responsibilities || ''
    }))
  }

  const handlePrint = () => window.print()

  // Dynamic styles from AI design tokens
  const dynamicStyles = {
    '--background-color': design.background || '#ffffff',
    '--text-primary': design.text_color || '#1a1a1a',
    '--accent-color': design.accent_color || '#2563eb',
    '--font-family': design.font_family || 'Inter, sans-serif',
    background: 'var(--background-color)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-family)',
    minHeight: '100vh'
  }

  return (
    <div className="portfolio-wrapper" style={dynamicStyles}>
      <div className="portfolio-topbar" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
        <div className="nav-logo">✦ ResumeAI</div>
        <div className="portfolio-topbar-actions">
          <button className="btn-secondary" onClick={() => navigate('/')}>← New Resume</button>
          <button className="btn-primary" onClick={handlePrint}>⬇ Download PDF</button>
        </div>
      </div>

      <HeroSection data={portfolio} />
      {portfolio.skills && Object.keys(portfolio.skills).length > 0 && <SkillsSection skills={portfolio.skills} />}
      {portfolio.experience?.length > 0 && <ExperienceSection experience={portfolio.experience} />}
      {portfolio.education?.length > 0 && <EducationSection education={portfolio.education} />}
      {portfolio.projects?.length > 0 && <ProjectsSection projects={portfolio.projects} />}
      
      {portfolio.certifications?.length > 0 && (
        <ListSection 
          title="Certifications" 
          items={portfolio.certifications} 
          label="Credentials" 
          icon="📜"
        />
      )}
      
      {portfolio.achievements?.length > 0 && (
        <ListSection 
          title="Achievements" 
          items={portfolio.achievements} 
          label="Milestones" 
          icon="🏆"
        />
      )}
      
      {portfolio.extra?.length > 0 && (
        <ListSection 
          title="Extra-curricular Activities" 
          items={portfolio.extra} 
          label="Beyond Work" 
          icon="🌟"
        />
      )}

      <ContactSection data={portfolio} />

      <footer className="portfolio-footer">
        Built with ✦ ResumeAI — NLP + Gemini AI powered portfolio generator
      </footer>
    </div>
  )
}
