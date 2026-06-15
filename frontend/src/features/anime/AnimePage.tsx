import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAnimeGame } from './hooks/useAnimeGame'
import GameBoard from './components/GameBoard'
import PlayerPanel from './components/PlayerPanel'
import EventModal from './components/EventModal'
import GameLogPanel from './components/GameLog'
import BossBattle from './components/BossBattle'
import { CollectionPanel } from './components/CharacterCard'
import CharacterEncyclopedia from './components/CharacterEncyclopedia'

export default function AnimePage() {
  const [showEncyclopedia, setShowEncyclopedia] = useState(false)
  const {
    players, currentPlayer, turn, phase, diceValue, isRolling,
    logs, currentEncounter, currentEvent, winner, mode,
    rollDice, resolveEncounter, resolveEvent, resolveBoss, newGame, setMode,
  } = useAnimeGame()

  const handleResolve = () => {
    if (phase === 'encounter') resolveEncounter()
    else if (phase === 'event') resolveEvent()
  }

  // Determine if AI is thinking (PvAI mode, Player 2's turn)
  const isAITurn = mode === 'pvai' && currentPlayer === 1 && phase !== 'gameover'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}
    >
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '1.5rem' }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 800,
        }}>
          <span className="gradient-text-gold">✦ Anime Ascension</span>
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Tensura-Inspired Strategy Board Game • Collect Heroes • Defeat the Creator Dragon
        </p>
        <button
          onClick={() => setShowEncyclopedia(true)}
          style={{
            marginTop: '0.5rem',
            padding: '0.35rem 1rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            background: 'rgba(245, 158, 11, 0.1)',
            color: 'var(--color-accent-gold)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          📖 Character Encyclopedia
        </button>
      </motion.div>

      {/* Main Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr 280px',
        gap: '1.5rem',
        alignItems: 'start',
      }}>
        {/* Left Panel - Player 1 + Collection */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <PlayerPanel player={players[0]} isActive={currentPlayer === 0} />

          {/* Hero Collection for Player 1 */}
          <CollectionPanel collectedHeroes={players[0].collectedHeroes} />

          {/* Board Legend */}
          <div className="glass-card" style={{ padding: '0.75rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
              LEGEND
            </h4>
            <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.65rem' }}>
              {[
                { color: 'rgba(16, 185, 129, 0.3)', label: '✨ Hero Ally' },
                { color: 'rgba(239, 68, 68, 0.3)', label: '💀 Villain' },
                { color: 'rgba(245, 158, 11, 0.3)', label: '🌟 Event' },
                { color: 'rgba(124, 58, 237, 0.5)', label: '🐉 Boss Zone' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: item.color }} />
                  <span style={{ color: 'var(--color-text-secondary)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Center - Board + Dice + Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Turn info + Mode toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Turn {turn} • </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: players[currentPlayer].color }}>
                {players[currentPlayer].name}'s Turn
              </span>
              {isAITurn && (
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    marginLeft: '0.5rem',
                    fontSize: '0.65rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '9999px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: 'var(--color-accent-gold)',
                    fontWeight: 600,
                  }}
                >
                  🤖 AI
                </motion.span>
              )}
            </div>

            {/* PvP / PvAI toggle */}
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {([
                { key: 'pvp' as const, label: '👤v👤', title: 'Player vs Player' },
                { key: 'pvai' as const, label: '👤v🤖', title: 'Player vs AI' },
              ]).map(m => (
                <button
                  key={m.key}
                  title={m.title}
                  onClick={() => { setMode(m.key); newGame() }}
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${mode === m.key ? 'var(--color-accent-purple)' : 'var(--color-border)'}`,
                    background: mode === m.key ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
                    color: mode === m.key ? 'var(--color-accent-purple-light)' : 'var(--color-text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <GameBoard players={players} />

          {/* Dice Area */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            marginTop: '1.5rem',
          }}>
            <motion.div
              className={`dice ${isRolling ? 'rolling' : ''}`}
              whileHover={phase === 'waiting' && !isRolling && !isAITurn ? { scale: 1.1 } : {}}
              whileTap={phase === 'waiting' && !isRolling && !isAITurn ? { scale: 0.95 } : {}}
              onClick={() => phase === 'waiting' && !isAITurn && rollDice()}
              style={{
                opacity: phase !== 'waiting' || isRolling || isAITurn ? 0.5 : 1,
                cursor: phase === 'waiting' && !isRolling && !isAITurn ? 'pointer' : 'not-allowed',
              }}
            >
              {diceValue || '?'}
            </motion.div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {isAITurn
                  ? '🤖 AI is thinking...'
                  : phase === 'waiting' ? 'Roll the dice!'
                  : phase === 'rolling' ? 'Rolling...'
                  : phase === 'gameover' ? '🎉 Game Over!'
                  : 'Resolving...'}
              </div>
              {diceValue && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Last roll: {diceValue}
                </div>
              )}
            </div>

            <button className="btn-secondary" onClick={newGame} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              🔄 New Game
            </button>
          </div>
        </motion.div>

        {/* Right Panel - Player 2 + Collection + Log */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <PlayerPanel player={players[1]} isActive={currentPlayer === 1} />

          {/* Hero Collection for Player 2 */}
          <CollectionPanel collectedHeroes={players[1].collectedHeroes} />

          <GameLogPanel logs={logs} />
        </motion.div>
      </div>

      {/* Event/Encounter Modal (heroes, villains, events — NOT boss) */}
      <EventModal
        encounter={currentEncounter}
        event={currentEvent}
        onResolve={handleResolve}
        phase={phase}
      />

      {/* Boss Battle — dedicated full-screen component */}
      <BossBattle
        player={players[currentPlayer]}
        onChallenge={resolveBoss}
        visible={phase === 'boss'}
      />

      {/* Winner Overlay */}
      <AnimatePresence>
        {winner !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 300,
              backdropFilter: 'blur(10px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              style={{
                textAlign: 'center',
                padding: '3rem',
                borderRadius: 'var(--radius-2xl)',
                background: 'var(--color-bg-card)',
                border: '2px solid var(--color-accent-gold)',
                boxShadow: '0 0 60px rgba(245, 158, 11, 0.3)',
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: '5rem', marginBottom: '1rem' }}
              >
                👑
              </motion.div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 900,
                marginBottom: '0.5rem',
              }}>
                <span className="gradient-text-gold">VICTORY!</span>
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', marginBottom: '1rem' }}>
                {players[winner].name} has defeated Veldanava and ascended to godhood!
              </p>

              {/* Show collected heroes for winner */}
              <div style={{
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '0.3rem',
                flexWrap: 'wrap',
              }}>
                {players[winner].collectedHeroes.map(hero => (
                  <span key={hero.name} style={{
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--color-accent-green)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}>
                    {hero.emoji} {hero.name}
                  </span>
                ))}
              </div>

              <button className="btn-primary" onClick={newGame} style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
                🔄 Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Encyclopedia Modal */}
      <CharacterEncyclopedia
        visible={showEncyclopedia}
        onClose={() => setShowEncyclopedia(false)}
      />

      {/* Responsive */}
      <style>{`
        @media (max-width: 1100px) {
          div[style*="grid-template-columns: 260px 1fr 280px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.div>
  )
}
