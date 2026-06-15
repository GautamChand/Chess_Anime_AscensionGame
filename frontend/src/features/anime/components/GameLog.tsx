import { useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import type { GameLog } from '../hooks/useAnimeGame'

interface GameLogProps {
  logs: GameLog[]
}

const TYPE_COLORS: Record<string, string> = {
  info: 'var(--color-text-secondary)',
  hero: 'var(--color-accent-green)',
  villain: 'var(--color-accent-red)',
  event: 'var(--color-accent-gold)',
  boss: 'var(--color-accent-purple-light)',
  dice: 'var(--color-accent-cyan)',
  warning: 'var(--color-accent-gold)',
  buff: '#a78bfa',
  move: '#67e8f9',
}

export default function GameLogPanel({ logs }: GameLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs.length])

  return (
    <div className="glass-card" style={{ padding: '1rem', height: '100%' }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.9rem',
        fontWeight: 700,
        marginBottom: '0.75rem',
        color: 'var(--color-accent-gold)',
      }}>
        📜 Adventure Log
      </h3>

      <div
        ref={scrollRef}
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.3rem',
        }}
      >
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={i === logs.length - 1 ? { opacity: 0, x: -10 } : false}
            animate={{ opacity: 1, x: 0 }}
            style={{
              fontSize: '0.75rem',
              lineHeight: 1.5,
              padding: '0.3rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              borderLeft: `3px solid ${TYPE_COLORS[log.type] || 'var(--color-border)'}`,
              background: 'rgba(255, 255, 255, 0.02)',
              color: TYPE_COLORS[log.type] || 'var(--color-text-secondary)',
            }}
          >
            {log.message}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
