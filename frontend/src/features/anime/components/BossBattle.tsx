import { motion, AnimatePresence } from 'motion/react'
import type { PlayerState } from '../hooks/useAnimeGame'

interface BossBattleProps {
  player: PlayerState
  onChallenge: () => void
  visible: boolean
}

const REQUIRED_HEROES = [
  { name: 'Rimuru Tempest', emoji: '🔵', required: true, label: 'Rimuru (Required)' },
  { name: 'Diablo', emoji: '😈', required: false, label: 'Diablo' },
  { name: 'Guy Crimson', emoji: '👹', required: false, label: 'Guy Crimson' },
  { name: 'Veldora', emoji: '🐉', required: false, label: 'Veldora' },
  { name: 'Milim Nava', emoji: '💫', required: false, label: 'Milim Nava' },
]

export default function BossBattle({ player, onChallenge, visible }: BossBattleProps) {
  if (!visible) return null

  const hasRimuru = player.collectedHeroes.some(h => h.name === 'Rimuru Tempest')
  const hasAlly = ['Diablo', 'Guy Crimson', 'Veldora', 'Milim Nava'].some(
    a => player.collectedHeroes.some(h => h.name === a)
  )
  const canWin = hasRimuru && hasAlly

  // Calculate total power
  const totalPower = player.attack + player.defense + player.magic + player.speed
  const alliesCount = player.collectedHeroes.length

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          backdropFilter: 'blur(12px)',
        }}
      >
        <motion.div
          initial={{ scale: 0.7, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.7, y: 40 }}
          transition={{ type: 'spring', stiffness: 250, damping: 20 }}
          style={{
            background: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-2xl)',
            padding: '2rem',
            maxWidth: '520px',
            width: '92%',
            border: '2px solid rgba(124, 58, 237, 0.5)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #7c3aed, #ec4899, #f59e0b)',
          }} />

          {/* Background glow */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15), transparent)',
            pointerEvents: 'none',
          }} />

          {/* Boss emoji with animation */}
          <div style={{ textAlign: 'center', marginBottom: '1rem', position: 'relative' }}>
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                filter: ['drop-shadow(0 0 20px rgba(124,58,237,0.3))', 'drop-shadow(0 0 40px rgba(124,58,237,0.6))', 'drop-shadow(0 0 20px rgba(124,58,237,0.3))'],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: '4.5rem', marginBottom: '0.25rem' }}
            >
              🐉
            </motion.div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '2px',
            }}>
              VELDANAVA
            </h2>
            <p style={{
              color: 'var(--color-text-muted)',
              fontSize: '0.8rem',
              marginTop: '0.15rem',
              fontStyle: 'italic',
            }}>
              The Creator Dragon — Final Boss
            </p>
          </div>

          {/* Player power summary */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            marginBottom: '1.25rem',
            fontSize: '0.75rem',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.6rem', fontWeight: 600 }}>POWER</div>
              <div style={{ fontWeight: 700, color: 'var(--color-accent-gold)', fontFamily: 'monospace' }}>{totalPower}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.6rem', fontWeight: 600 }}>ALLIES</div>
              <div style={{ fontWeight: 700, color: 'var(--color-accent-cyan)', fontFamily: 'monospace' }}>{alliesCount}/8</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.6rem', fontWeight: 600 }}>BUFFS</div>
              <div style={{ fontWeight: 700, color: 'var(--color-accent-purple-light)', fontFamily: 'monospace' }}>{player.activeBuffs.length}</div>
            </div>
          </div>

          {/* Requirements checklist */}
          <div style={{
            marginBottom: '1.5rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(124, 58, 237, 0.05)',
            border: '1px solid rgba(124, 58, 237, 0.15)',
          }}>
            <div style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--color-accent-purple-light)',
              marginBottom: '0.5rem',
              fontFamily: 'var(--font-display)',
            }}>
              📋 Battle Requirements
            </div>

            {/* Rimuru — always required */}
            <RequirementRow
              emoji="🔵"
              label="Rimuru Tempest"
              sublabel="(Required)"
              met={hasRimuru}
            />

            {/* Separator */}
            <div style={{
              margin: '0.4rem 0',
              fontSize: '0.6rem',
              color: 'var(--color-text-muted)',
              textAlign: 'center',
              fontWeight: 600,
            }}>
              + at least ONE of:
            </div>

            {/* Allies — need at least one */}
            {REQUIRED_HEROES.filter(h => !h.required).map(hero => (
              <RequirementRow
                key={hero.name}
                emoji={hero.emoji}
                label={hero.name}
                met={player.collectedHeroes.some(h => h.name === hero.name)}
              />
            ))}
          </div>

          {/* Outcome prediction */}
          <div style={{
            textAlign: 'center',
            marginBottom: '1rem',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            background: canWin ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${canWin ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            fontSize: '0.75rem',
            fontWeight: 600,
            color: canWin ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
          }}>
            {canWin
              ? '✨ You have the power to defeat Veldanava!'
              : '⚠ You lack the required allies. You WILL be defeated.'}
          </div>

          {/* Challenge button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onChallenge}
            className={canWin ? 'btn-primary' : 'btn-secondary'}
            style={{
              width: '100%',
              fontSize: '1rem',
              padding: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.5px',
            }}
          >
            {canWin ? '⚔ Challenge Veldanava!' : '💀 Challenge Anyway (Defeat)'}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================
// REQUIREMENT ROW
// ============================================

function RequirementRow({ emoji, label, sublabel, met }: {
  emoji: string
  label: string
  sublabel?: string
  met: boolean
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.3rem 0.4rem',
      borderRadius: 'var(--radius-sm)',
      background: met ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.04)',
      marginBottom: '0.2rem',
    }}>
      <span style={{ fontSize: '0.85rem' }}>{emoji}</span>
      <span style={{
        flex: 1,
        fontSize: '0.7rem',
        fontWeight: 600,
        color: met ? 'var(--color-accent-green)' : 'var(--color-text-muted)',
      }}>
        {label}
        {sublabel && (
          <span style={{ fontSize: '0.6rem', fontWeight: 400, marginLeft: '0.3rem', opacity: 0.7 }}>
            {sublabel}
          </span>
        )}
      </span>
      <span style={{ fontSize: '0.85rem' }}>
        {met ? '✅' : '❌'}
      </span>
    </div>
  )
}
