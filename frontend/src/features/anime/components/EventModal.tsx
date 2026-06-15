import { motion, AnimatePresence } from 'motion/react'
import type { Character } from '../data/characters'
import type { SpecialEvent } from '../data/events'

interface EventModalProps {
  encounter: Character | null
  event: SpecialEvent | null
  onResolve: () => void
  phase: string
}

export default function EventModal({ encounter, event, onResolve, phase }: EventModalProps) {
  // Boss phase is now handled by BossBattle component
  if (phase !== 'encounter' && phase !== 'event') return null

  const isBoss = phase === 'boss'
  const isEncounter = phase === 'encounter'
  const isEvent = phase === 'event'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          backdropFilter: 'blur(8px)',
        }}
        onClick={onResolve}
      >
        <motion.div
          initial={{ scale: 0.8, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-2xl)',
            padding: '2rem',
            maxWidth: '450px',
            width: '90%',
            border: '1px solid var(--color-border)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top glow accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: isBoss
              ? 'linear-gradient(90deg, #7c3aed, #ec4899)'
              : isEncounter && encounter
                ? encounter.type === 'hero'
                  ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                  : 'linear-gradient(90deg, #ef4444, #ec4899)'
                : 'linear-gradient(90deg, #f59e0b, #f97316)',
          }} />

          {/* Boss Battle */}
          {isBoss && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: '4rem', marginBottom: '0.5rem' }}
                >
                  🐉
                </motion.div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  VELDANAVA
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  The Creator Dragon — Final Boss
                </p>
              </div>
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}>
                You have entered the final boss zone! Click to challenge Veldanava.
                You need Rimuru + at least one of: Diablo, Guy Crimson, Veldora, or Milim Nava.
              </p>
            </>
          )}

          {/* Character Encounter */}
          {isEncounter && encounter && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}
                >
                  {encounter.emoji}
                </motion.div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: encounter.type === 'hero' ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
                }}>
                  {encounter.name}
                </h2>
                <p style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '0.8rem',
                  marginTop: '0.15rem',
                  fontStyle: 'italic',
                }}>
                  {encounter.title}
                </p>
              </div>
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}>
                {encounter.description}
              </p>
            </>
          )}

          {/* Special Event */}
          {isEvent && event && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}
                >
                  {event.emoji}
                </motion.div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: 'var(--color-accent-gold)',
                }}>
                  {event.name}
                </h2>
              </div>
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}>
                {event.description}
              </p>
            </>
          )}

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onResolve}
            className="btn-primary"
            style={{ width: '100%', fontSize: '1rem', padding: '0.8rem' }}
          >
            {isBoss ? '⚔ Challenge Veldanava!' : isEncounter ? (encounter?.type === 'hero' ? '✨ Accept!' : '💀 Endure!') : '🌟 Continue'}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
