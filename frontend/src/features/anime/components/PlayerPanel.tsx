import { motion } from 'motion/react'
import type { PlayerState, Buff } from '../hooks/useAnimeGame'

interface PlayerPanelProps {
  player: PlayerState
  isActive: boolean
}

export default function PlayerPanel({ player, isActive }: PlayerPanelProps) {
  const stats = [
    { key: 'health', label: 'HP', value: player.health, max: 200, color: 'health', icon: '❤' },
    { key: 'attack', label: 'ATK', value: player.attack, max: 100, color: 'attack', icon: '⚔' },
    { key: 'defense', label: 'DEF', value: player.defense, max: 100, color: 'defense', icon: '🛡' },
    { key: 'magic', label: 'MAG', value: player.magic, max: 100, color: 'magic', icon: '✨' },
    { key: 'speed', label: 'SPD', value: player.speed, max: 100, color: 'speed', icon: '💨' },
  ]

  // Boss readiness: Rimuru + one ally
  const hasRimuru = player.collectedHeroes.some(h => h.name === 'Rimuru Tempest')
  const hasAlly = ['Diablo', 'Guy Crimson', 'Veldora', 'Milim Nava'].some(
    a => player.collectedHeroes.some(h => h.name === a)
  )
  const canFightBoss = hasRimuru && hasAlly

  return (
    <motion.div
      className="glass-card"
      animate={{
        borderColor: isActive ? player.color : 'var(--color-border)',
        boxShadow: isActive ? `0 0 20px ${player.color}30` : 'none',
      }}
      style={{ padding: '1rem' }}
    >
      {/* Player header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: player.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          boxShadow: `0 0 10px ${player.color}50`,
        }}>
          {player.emoji}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-display)' }}>
            {player.name}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
            Tile {player.position} / 100
          </div>
        </div>
        {isActive && (
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              marginLeft: 'auto',
              fontSize: '0.65rem',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              background: `${player.color}20`,
              color: player.color,
              fontWeight: 700,
            }}
          >
            ACTIVE
          </motion.span>
        )}
      </div>

      {/* Position bar */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div className="stat-bar-container" style={{ height: '4px' }}>
          <motion.div
            animate={{ width: `${player.position}%` }}
            transition={{ duration: 0.5 }}
            style={{
              height: '100%',
              borderRadius: '2px',
              background: `linear-gradient(90deg, ${player.color}, ${player.color}80)`,
            }}
          />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gap: '0.35rem', marginBottom: '0.75rem' }}>
        {stats.map(stat => (
          <div key={stat.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
            <span style={{ width: '16px' }}>{stat.icon}</span>
            <span style={{ width: '30px', color: 'var(--color-text-muted)', fontWeight: 600 }}>{stat.label}</span>
            <div className="stat-bar-container" style={{ flex: 1 }}>
              <motion.div
                className={`stat-bar ${stat.color}`}
                animate={{ width: `${Math.min((stat.value / stat.max) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span style={{ width: '28px', textAlign: 'right', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.7rem' }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Collected Heroes — compact badges */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.3rem' }}>
          🎖 Allies ({player.collectedHeroes.length}/8)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
          {player.collectedHeroes.length === 0 ? (
            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>None yet</span>
          ) : (
            player.collectedHeroes.map(hero => (
              <span key={hero.name} style={{
                fontSize: '0.6rem',
                padding: '0.1rem 0.4rem',
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--color-accent-green)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.15rem',
              }}>
                {hero.emoji} {hero.name.split(' ')[0]}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Boss readiness */}
      <div style={{
        padding: '0.4rem',
        borderRadius: 'var(--radius-md)',
        background: canFightBoss ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        fontSize: '0.65rem',
        fontWeight: 600,
        textAlign: 'center',
        color: canFightBoss ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
      }}>
        {canFightBoss ? '✅ Boss Ready!' : '❌ Not ready for boss'}
      </div>

      {/* Active buffs — with duration tracking */}
      {player.activeBuffs.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.2rem' }}>
            ⚡ Active Buffs
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
            {player.activeBuffs.map(buff => (
              <BuffBadge key={buff.id} buff={buff} />
            ))}
          </div>
        </div>
      )}

      {/* Skip turn warning */}
      {player.skipTurn && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '0.5rem',
            padding: '0.3rem 0.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: '0.6rem',
            fontWeight: 600,
            color: 'var(--color-accent-red)',
            textAlign: 'center',
          }}
        >
          ❄ Frozen — Skipping next turn
        </motion.div>
      )}
    </motion.div>
  )
}

// ============================================
// BUFF BADGE — Shows individual buff with duration
// ============================================

const BUFF_COLORS: Record<string, { bg: string; text: string }> = {
  immunity: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24' },
  doubleMove: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' },
  doubleAttack: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' },
  lucky: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' },
  stat: { bg: 'rgba(124, 58, 237, 0.15)', text: '#a78bfa' },
  custom: { bg: 'rgba(6, 182, 212, 0.15)', text: '#67e8f9' },
}

function BuffBadge({ buff }: { buff: Buff }) {
  const colors = BUFF_COLORS[buff.type] || BUFF_COLORS.custom

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      title={`${buff.name} — ${buff.description}\nSource: ${buff.source}${buff.duration > 0 ? `\n${buff.duration} turns remaining` : buff.duration === -1 ? '\nPermanent' : ''}`}
      style={{
        fontSize: '0.55rem',
        padding: '0.1rem 0.35rem',
        borderRadius: '4px',
        background: colors.bg,
        color: colors.text,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '0.15rem',
        cursor: 'help',
        border: `1px solid ${colors.text}20`,
      }}
    >
      {buff.emoji} {buff.name.split(' ')[0]}
      {buff.duration > 0 && (
        <span style={{
          fontSize: '0.5rem',
          padding: '0 0.15rem',
          borderRadius: '2px',
          background: `${colors.text}15`,
          marginLeft: '0.1rem',
        }}>
          {buff.duration}
        </span>
      )}
      {buff.duration === -1 && (
        <span style={{ fontSize: '0.45rem', opacity: 0.7 }}>∞</span>
      )}
    </motion.span>
  )
}
