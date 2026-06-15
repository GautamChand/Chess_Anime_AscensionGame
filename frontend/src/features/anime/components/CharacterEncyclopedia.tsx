import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ALL_CHARACTERS, type Character } from '../data/characters'

interface CharacterEncyclopediaProps {
  visible: boolean
  onClose: () => void
}

export default function CharacterEncyclopedia({ visible, onClose }: CharacterEncyclopediaProps) {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null)

  if (!visible) return null

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
          zIndex: 250,
          backdropFilter: 'blur(12px)',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.85, y: 30 }}
          transition={{ type: 'spring', stiffness: 250, damping: 20 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-2xl)',
            padding: '1.5rem',
            maxWidth: '800px',
            width: '95%',
            maxHeight: '85vh',
            overflowY: 'auto',
            border: '1px solid var(--color-border)',
            position: 'relative',
          }}
        >
          {/* Top accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
            background: 'linear-gradient(90deg, #06b6d4, #7c3aed, #ec4899, #f59e0b)',
          }} />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.3rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              📖 Character Encyclopedia
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'var(--color-accent-red)',
                borderRadius: 'var(--radius-md)',
                padding: '0.3rem 0.7rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              ✕ Close
            </button>
          </div>

          {/* Two-column layout: character list + detail */}
          <div style={{ display: 'grid', gridTemplateColumns: selectedChar ? '200px 1fr' : '1fr', gap: '1rem' }}>
            {/* Character List */}
            <div>
              {/* Heroes */}
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-accent-green)', marginBottom: '0.4rem', fontFamily: 'var(--font-display)' }}>
                ✨ Heroes
              </div>
              <div style={{ display: 'grid', gap: '0.3rem', marginBottom: '0.8rem' }}>
                {ALL_CHARACTERS.filter(c => c.type === 'hero').map(char => (
                  <CharListItem
                    key={char.name}
                    character={char}
                    selected={selectedChar?.name === char.name}
                    onClick={() => setSelectedChar(selectedChar?.name === char.name ? null : char)}
                  />
                ))}
              </div>

              {/* Villains */}
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-accent-red)', marginBottom: '0.4rem', fontFamily: 'var(--font-display)' }}>
                💀 Villains
              </div>
              <div style={{ display: 'grid', gap: '0.3rem' }}>
                {ALL_CHARACTERS.filter(c => c.type === 'villain').map(char => (
                  <CharListItem
                    key={char.name}
                    character={char}
                    selected={selectedChar?.name === char.name}
                    onClick={() => setSelectedChar(selectedChar?.name === char.name ? null : char)}
                  />
                ))}
              </div>
            </div>

            {/* Character Detail */}
            <AnimatePresence mode="wait">
              {selectedChar && (
                <motion.div
                  key={selectedChar.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: `linear-gradient(135deg, ${selectedChar.color}08, ${selectedChar.color}03)`,
                    border: `1px solid ${selectedChar.color}30`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Top accent bar */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${selectedChar.color}, ${selectedChar.color}60)`,
                  }} />

                  {/* Emoji + Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: `${selectedChar.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      boxShadow: `0 0 20px ${selectedChar.color}30`,
                    }}>
                      {selectedChar.emoji}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: selectedChar.color }}>
                        {selectedChar.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        {selectedChar.lore.fullTitle}
                      </div>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div style={{
                    display: 'inline-block',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                    background: selectedChar.type === 'hero' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: selectedChar.type === 'hero' ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
                    border: `1px solid ${selectedChar.type === 'hero' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  }}>
                    {selectedChar.lore.role}
                  </div>

                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '0.3rem' }}>
                    📍 Tile {selectedChar.tile}
                  </div>

                  {/* Powers */}
                  <Section title="⚔ Powers & Abilities">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {selectedChar.lore.powers.map(power => (
                        <span key={power} style={{
                          fontSize: '0.65rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          background: `${selectedChar.color}12`,
                          color: selectedChar.color,
                          border: `1px solid ${selectedChar.color}25`,
                          fontWeight: 500,
                        }}>
                          {power}
                        </span>
                      ))}
                    </div>
                  </Section>

                  {/* Gameplay Effects */}
                  <Section title="🎮 Gameplay Effects">
                    <div style={{ display: 'grid', gap: '0.2rem' }}>
                      {selectedChar.lore.gameplayEffects.map(eff => (
                        <div key={eff} style={{
                          fontSize: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          color: 'var(--color-text-secondary)',
                        }}>
                          <span style={{ color: selectedChar.type === 'hero' ? 'var(--color-accent-green)' : 'var(--color-accent-red)' }}>
                            {selectedChar.type === 'hero' ? '▲' : '▼'}
                          </span>
                          {eff}
                        </div>
                      ))}
                    </div>
                  </Section>

                  {/* Backstory */}
                  <Section title="📜 Lore">
                    <p style={{
                      fontSize: '0.72rem',
                      lineHeight: 1.7,
                      color: 'var(--color-text-secondary)',
                    }}>
                      {selectedChar.lore.backstory}
                    </p>
                  </Section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================
// SUBCOMPONENTS
// ============================================

function CharListItem({ character, selected, onClick }: {
  character: Character
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.35rem 0.5rem',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${selected ? character.color + '50' : 'var(--color-border)'}`,
        background: selected ? `${character.color}15` : 'transparent',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transition: 'all 0.15s',
      }}
    >
      <span style={{ fontSize: '0.9rem' }}>{character.emoji}</span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          color: selected ? character.color : 'var(--color-text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {character.name}
        </div>
        <div style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)' }}>
          Tile {character.tile}
        </div>
      </div>
    </motion.button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        color: 'var(--color-text-muted)',
        marginBottom: '0.35rem',
        fontFamily: 'var(--font-display)',
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}
