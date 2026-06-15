import { motion } from 'motion/react'
import type { CollectedHero } from '../hooks/useAnimeGame'
import { HEROES } from '../data/characters'

interface CharacterCardProps {
  hero: CollectedHero
  index: number
}

export default function CharacterCard({ hero, index }: CharacterCardProps) {
  const characterData = HEROES.find(h => h.name === hero.name)
  const color = characterData?.color || '#7c3aed'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.05, y: -4 }}
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}08)`,
        border: `1px solid ${color}40`,
        borderRadius: 'var(--radius-lg)',
        padding: '0.5rem',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, ${color}, ${color}80)`,
      }} />

      {/* Content */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        {/* Emoji avatar */}
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: `${color}25`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          flexShrink: 0,
          boxShadow: `0 0 8px ${color}30`,
        }}>
          {hero.emoji}
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: color,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {hero.name}
          </div>
          {characterData && (
            <div style={{
              fontSize: '0.55rem',
              color: 'var(--color-text-muted)',
              fontStyle: 'italic',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {characterData.title}
            </div>
          )}
        </div>
      </div>

      {/* Acquired info */}
      <div style={{
        marginTop: '0.3rem',
        fontSize: '0.5rem',
        color: 'var(--color-text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>📍 Tile {hero.tile}</span>
        <span>Turn {hero.acquiredTurn}</span>
      </div>
    </motion.div>
  )
}

// ============================================
// COLLECTION PANEL (shows all heroes with slots)
// ============================================

interface CollectionPanelProps {
  collectedHeroes: CollectedHero[]
}

export function CollectionPanel({ collectedHeroes }: CollectionPanelProps) {
  return (
    <div className="glass-card" style={{ padding: '0.75rem' }}>
      <h4 style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        marginBottom: '0.5rem',
        color: 'var(--color-accent-gold)',
        fontFamily: 'var(--font-display)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>🎖 Hero Collection</span>
        <span style={{
          fontSize: '0.6rem',
          padding: '0.1rem 0.4rem',
          borderRadius: '9999px',
          background: collectedHeroes.length >= 2 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: collectedHeroes.length >= 2 ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
        }}>
          {collectedHeroes.length}/8
        </span>
      </h4>

      {collectedHeroes.length === 0 ? (
        <div style={{
          padding: '0.75rem',
          textAlign: 'center',
          fontSize: '0.7rem',
          color: 'var(--color-text-muted)',
          fontStyle: 'italic',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255,255,255,0.02)',
          border: '1px dashed rgba(255,255,255,0.08)',
        }}>
          No heroes recruited yet. Land on hero tiles to collect allies!
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.3rem' }}>
          {collectedHeroes.map((hero, i) => (
            <CharacterCard key={hero.name} hero={hero} index={i} />
          ))}
        </div>
      )}

      {/* Hero slots - empty placeholders for uncollected heroes */}
      {collectedHeroes.length > 0 && collectedHeroes.length < 8 && (
        <div style={{
          marginTop: '0.4rem',
          display: 'flex',
          gap: '0.2rem',
          flexWrap: 'wrap',
        }}>
          {HEROES.filter(h => !collectedHeroes.find(ch => ch.name === h.name)).map(hero => (
            <div
              key={hero.name}
              title={`${hero.name} — Tile ${hero.tile}`}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px dashed rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.55rem',
                opacity: 0.4,
              }}
            >
              {hero.emoji}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
