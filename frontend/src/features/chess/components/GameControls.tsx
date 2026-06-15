import { motion } from 'motion/react'
import type { GameMode } from '../hooks/useChessGame'

interface GameControlsProps {
  gameMode: GameMode
  aiDepth: number
  gameStatus: string
  statusMessage: string
  isAiThinking: boolean
  onSetGameMode: (mode: GameMode) => void
  onSetAiDepth: (depth: number) => void
  onUndo: () => void
  onNewGame: () => void
}

export default function GameControls({
  gameMode, aiDepth, statusMessage, isAiThinking,
  onSetGameMode, onSetAiDepth, onUndo, onNewGame,
}: GameControlsProps) {
  const modes: { key: GameMode; label: string; icon: string }[] = [
    { key: 'hvh', label: 'Human vs Human', icon: '👤vs👤' },
    { key: 'hvai', label: 'Human vs AI', icon: '👤vs🤖' },
    { key: 'aivai', label: 'AI vs AI', icon: '🤖vs🤖' },
  ]

  const difficulties = [
    { depth: 2, label: 'Easy', color: 'var(--color-accent-green)' },
    { depth: 4, label: 'Medium', color: 'var(--color-accent-gold)' },
    { depth: 6, label: 'Hard', color: 'var(--color-accent-red)' },
  ]

  return (
    <div className="glass-card" style={{ padding: '1rem' }}>
      {/* Status Message */}
      <motion.div
        key={statusMessage}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          padding: '0.6rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(124, 58, 237, 0.1)',
          fontWeight: 600,
          fontSize: '0.9rem',
          marginBottom: '1rem',
          fontFamily: 'var(--font-display)',
        }}
      >
        {statusMessage}
      </motion.div>

      {/* Game Mode */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
          GAME MODE
        </label>
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          {modes.map(m => (
            <button
              key={m.key}
              onClick={() => onSetGameMode(m.key)}
              style={{
                flex: 1,
                padding: '0.5rem 0.4rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${gameMode === m.key ? 'var(--color-accent-purple)' : 'var(--color-border)'}`,
                background: gameMode === m.key ? 'rgba(124, 58, 237, 0.2)' : 'var(--color-bg-secondary)',
                color: gameMode === m.key ? 'var(--color-accent-purple-light)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div>{m.icon}</div>
              <div style={{ marginTop: '0.15rem', fontSize: '0.6rem' }}>{m.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      {gameMode !== 'hvh' && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
            AI DIFFICULTY (Depth: {aiDepth})
          </label>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {difficulties.map(d => (
              <button
                key={d.depth}
                onClick={() => onSetAiDepth(d.depth)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${aiDepth === d.depth ? d.color : 'var(--color-border)'}`,
                  background: aiDepth === d.depth ? `${d.color}20` : 'var(--color-bg-secondary)',
                  color: aiDepth === d.depth ? d.color : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          className="btn-secondary"
          onClick={onUndo}
          disabled={isAiThinking}
          style={{
            flex: 1,
            opacity: isAiThinking ? 0.5 : 1,
            cursor: isAiThinking ? 'not-allowed' : 'pointer',
            fontSize: '0.85rem',
          }}
        >
          ↩ Undo
        </button>
        <button
          className="btn-primary"
          onClick={onNewGame}
          style={{ flex: 1, fontSize: '0.85rem' }}
        >
          🔄 New Game
        </button>
      </div>
    </div>
  )
}
