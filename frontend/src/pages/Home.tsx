import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '3rem' }}
      >
        <motion.div
          style={{ fontSize: '4rem', marginBottom: '0.5rem' }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        >
          ⚔
        </motion.div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: '1rem',
        }}>
          <span className="gradient-text">Chess AI</span>
          <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.5em', fontWeight: 400, margin: '0.5rem 0' }}>&</span>
          <span className="gradient-text-gold">Anime Ascension</span>
        </h1>
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: '1.1rem',
          lineHeight: 1.6,
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          An AI-powered gaming platform featuring an intelligent chess engine with
          adversarial search algorithms and a Tensura-inspired anime strategy board game.
        </p>
      </motion.div>

      {/* Game Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2rem',
        width: '100%',
        maxWidth: '850px',
      }}>
        {/* Chess Card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="glass-card"
          onClick={() => navigate('/chess')}
          style={{ cursor: 'pointer', padding: '2rem', position: 'relative', overflow: 'hidden' }}
        >
          {/* Glow accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
          }} />
          
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>♟</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}>
            <span className="gradient-text">Chess AI</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Battle against an intelligent chess engine powered by Minimax with Alpha-Beta Pruning,
            Iterative Deepening, and advanced heuristic evaluation.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {['Minimax', 'Alpha-Beta', 'Transposition Tables', 'Quiescence Search'].map(tag => (
              <span key={tag} style={{
                fontSize: '0.7rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '9999px',
                background: 'rgba(124, 58, 237, 0.15)',
                color: 'var(--color-accent-purple-light)',
                border: '1px solid rgba(124, 58, 237, 0.25)',
                fontWeight: 500,
              }}>
                {tag}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            <span>👤 vs 🤖</span>
            <span>👤 vs 👤</span>
            <span>🤖 vs 🤖</span>
          </div>

          <motion.div
            style={{
              marginTop: '1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-accent-purple-light)',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
            whileHover={{ x: 5 }}
          >
            Play Now →
          </motion.div>
        </motion.div>

        {/* Anime Ascension Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="glass-card"
          onClick={() => navigate('/anime')}
          style={{ cursor: 'pointer', padding: '2rem', position: 'relative', overflow: 'hidden' }}
        >
          {/* Glow accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #f59e0b, #ec4899)',
          }} />
          
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✦</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}>
            <span className="gradient-text-gold">Anime Ascension</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Embark on an epic journey through a Tensura-inspired fantasy world.
            Collect powerful allies, defeat villains, and challenge the Creator Dragon.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {['Expectimax AI', 'RPG Mechanics', 'Boss Battles', 'Character Collection'].map(tag => (
              <span key={tag} style={{
                fontSize: '0.7rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '9999px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--color-accent-gold)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                fontWeight: 500,
              }}>
                {tag}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            <span>🐉 100 Tiles</span>
            <span>⚔ 8 Heroes</span>
            <span>👹 6 Villains</span>
          </div>

          <motion.div
            style={{
              marginTop: '1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-accent-gold)',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
            whileHover={{ x: 5 }}
          >
            Play Now →
          </motion.div>
        </motion.div>
      </div>

      {/* AI Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        style={{ marginTop: '4rem', textAlign: 'center', maxWidth: '700px' }}
      >
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          color: 'var(--color-text-secondary)',
        }}>
          AI Concepts Demonstrated
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          {[
            { icon: '🧠', label: 'Adversarial Search', desc: 'Minimax Algorithm' },
            { icon: '✂', label: 'Alpha-Beta Pruning', desc: 'O(b^(d/2)) optimization' },
            { icon: '🎲', label: 'Expectimax', desc: 'Probabilistic decisions' },
            { icon: '📊', label: 'Heuristic Evaluation', desc: 'Multi-factor scoring' },
            { icon: '🏰', label: 'Game Theory', desc: 'Strategic decision making' },
            { icon: '⚡', label: 'Search Optimization', desc: 'Transposition tables' },
          ].map(item => (
            <motion.div
              key={item.label}
              whileHover={{ y: -4 }}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>{item.label}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          marginTop: '4rem',
          paddingBottom: '2rem',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.8rem',
        }}
      >
        Built as a Final-Year AI Project • Demonstrating Adversarial Search & Game Theory
      </motion.footer>
    </div>
  )
}
