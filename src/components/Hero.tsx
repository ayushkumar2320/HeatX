import { motion } from 'framer-motion'
import EarthGlobe from './EarthGlobe'

const sidebarItems = [
  {
    label: 'Map View', active: true, badge: undefined as number | undefined,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 3 20 10 16 17 20 21 17 21 3 17 7 10 3 3 6"/>
        <line x1="10" y1="3" x2="10" y2="16"/><line x1="17" y1="7" x2="17" y2="20"/>
      </svg>
    ),
  },
  {
    label: 'Locations', active: false, badge: undefined as number | undefined,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    label: 'Layers', active: false, badge: undefined as number | undefined,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
  },
  {
    label: 'Analytics', active: false, badge: undefined as number | undefined,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    label: 'Heat Alerts', active: false, badge: 6 as number | undefined,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    label: 'Power Grid', active: false, badge: undefined as number | undefined,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    label: 'Water Bodies', active: false, badge: undefined as number | undefined,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.5 11 4 15.5 4 18a8 8 0 0 0 16 0c0-2.5-2.5-7-8-16z"/>
      </svg>
    ),
  },
]

export default function Hero() {
  return (
    <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>

      {/* Background video */}
      <video
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        src="/hero.mp4" autoPlay muted loop playsInline
      />

      {/* Dark atmospheric overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,6,16,0.36)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,5,15,0.06) 24%, rgba(0,5,15,0.18) 58%, rgba(0,7,20,0.78) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.22) 0%, transparent 12%, transparent 88%, rgba(0,0,0,0.16) 100%)' }} />

      {/* HEATSYNC ghost watermark */}
      <div style={{
        position: 'absolute', top: '42%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(52px, 13vw, 140px)',
        fontWeight: 900, color: 'transparent',
        WebkitTextStroke: '1.5px rgba(255,255,255,0.055)',
        letterSpacing: '0.05em', whiteSpace: 'nowrap',
        pointerEvents: 'none', zIndex: 2, userSelect: 'none',
        fontFamily: "'Inter', sans-serif",
      }}>
        HEATSYNC
      </div>

      {/* 3D Realistic Three.js Earth Globe Horizon */}
      <EarthGlobe />

      {/* Left sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        style={{
          position: 'fixed', left: '14px', top: '50%',
          transform: 'translateY(-50%)', zIndex: 40,
          display: 'flex', flexDirection: 'column', gap: '6px',
          padding: '10px 7px', borderRadius: '16px',
          background: 'rgba(0,0,0,0.52)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {sidebarItems.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.45 + i * 0.06 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.93 }}
            title={item.label}
            style={{
              position: 'relative', width: 36, height: 36, borderRadius: '10px',
              background: item.active ? 'rgba(34,197,94,0.18)' : 'transparent',
              border: item.active ? '1px solid rgba(34,197,94,0.38)' : '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: item.active ? '#86efac' : 'rgba(255,255,255,0.5)',
            }}
          >
            {item.icon}
            {item.badge !== undefined && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                width: 16, height: 16, borderRadius: '50%',
                background: '#ef4444', fontSize: '8px', fontWeight: 700,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.badge}
              </span>
            )}
          </motion.button>
        ))}
      </motion.aside>

      

      {/* Main hero content */}
      <div style={{
        position: 'relative', zIndex: 10, height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '60px 24px 170px',
      }}>
        

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.22, ease: 'easeOut' }}
          style={{
            margin: 0, fontFamily: "'Inter', sans-serif", fontWeight: 700,
            fontSize: 'clamp(1.9rem, 4.2vw, 3rem)', lineHeight: 1.12,
            letterSpacing: '-0.025em', color: '#fff', maxWidth: '700px',
            textShadow: '0 2px 40px rgba(0,0,0,0.6)',
          }}
        >
          Building cooler, smarter and<br />
          <span style={{ color: '#86efac' }}>sustainable cities</span> for tomorrow.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.38, ease: 'easeOut' }}
          style={{
            margin: '18px 0 0', fontSize: '14px', lineHeight: 1.65,
            color: 'rgba(255,255,255,0.6)', fontWeight: 400, letterSpacing: '0.01em',
          }}
        >
          Predict the Heat. Understand the Stress. Protect the People.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.52, ease: 'easeOut' }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '30px' }}
        >
          <motion.a
            href="#map"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '11px 26px', borderRadius: '999px',
              fontSize: '14px', fontWeight: 600,
              color: '#fff', textDecoration: 'none',
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              boxShadow: '0 0 28px rgba(34,197,94,0.4), 0 4px 16px rgba(0,0,0,0.25)',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            Explore Odisha Map &#8594;
          </motion.a>
          
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        style={{
          position: 'absolute', bottom: '24px', left: '50%',
          transform: 'translateX(-50%)', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px',
        }}
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 22, height: 34, borderRadius: '11px',
            border: '1.5px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '5px 0',
          }}
        >
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 3, height: 7, borderRadius: '2px', background: 'rgba(255,255,255,0.6)' }}
          />
        </motion.div>
        <span style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Scroll to Explore
        </span>
      </motion.div>

    </section>
  )
}
