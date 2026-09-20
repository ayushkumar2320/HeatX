import { motion } from 'framer-motion'

export default function Navbar() {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 20px',
      background: 'rgba(0,0,0,0.36)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      {/* Left: Brand */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(34,197,94,0.15)',
          border: '1.5px solid rgba(34,197,94,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="#22c55e">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20c9 0 16-8 16-20C16 0 8.5 2.5 8.5 2.5S18 5 17 8z"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', letterSpacing: '0.08em', lineHeight: 1.2 }}>
            HEATSYNC
          </div>
          <div style={{ fontSize: '8.5px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Urban Intelligence Twin
          </div>
        </div>
      </motion.div>

      {/* Center: Synoptic Overview pill */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease: 'easeOut' }}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '7px 18px', borderRadius: '999px',
          background: 'rgba(0,0,0,0.48)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <span style={{
          width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
          display: 'inline-block', boxShadow: '0 0 8px rgba(34,197,94,0.85)',
        }} />
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Synoptic Overview
        </span>
        <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '15px', lineHeight: 1 }}>&#183;</span>
        <span style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>
          Statewide Risk Matrix
        </span>
      </motion.div>

      {/* Right: Controls */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <button style={{
          padding: '6px 14px', borderRadius: '999px',
          background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)',
          fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
        }}>Layman</button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '6px 12px', borderRadius: '999px',
          background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)',
        }}>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}
          />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#22c55e', letterSpacing: '0.04em' }}>LIVE</span>
        </div>

        <button style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '6px 14px', borderRadius: '999px',
          background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.4)',
          fontSize: '12px', fontWeight: 600, color: '#fca5a5', cursor: 'pointer',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
          Alerts (12)
        </button>
      </motion.div>
    </header>
  )
}
