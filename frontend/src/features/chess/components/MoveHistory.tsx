import { motion } from 'motion/react'
import type { Move } from 'chess.js'

interface MoveHistoryProps {
  history: Move[]
}

export default function MoveHistory({ history }: MoveHistoryProps) {
  // Group moves into pairs (white, black)
  const movePairs: { number: number; white: string; black?: string }[] = []
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: history[i]?.san || '',
      black: history[i + 1]?.san,
    })
  }

  return (
    <div className="glass-card" style={{ padding: '1rem', height: '100%' }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.9rem',
        fontWeight: 700,
        marginBottom: '0.75rem',
        color: 'var(--color-accent-purple-light)',
      }}>
        📜 Move History
      </h3>

      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        fontSize: '0.8rem',
      }}>
        {movePairs.length === 0 ? (
          <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
            No moves yet. Make your first move!
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>
                <th style={{ padding: '0.25rem', textAlign: 'left', width: '30px' }}>#</th>
                <th style={{ padding: '0.25rem', textAlign: 'left' }}>White</th>
                <th style={{ padding: '0.25rem', textAlign: 'left' }}>Black</th>
              </tr>
            </thead>
            <tbody>
              {movePairs.map((pair, i) => (
                <motion.tr
                  key={pair.number}
                  initial={i === movePairs.length - 1 ? { opacity: 0, x: -10 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <td style={{ padding: '0.3rem 0.25rem', color: 'var(--color-text-muted)' }}>
                    {pair.number}.
                  </td>
                  <td style={{
                    padding: '0.3rem 0.25rem',
                    fontWeight: 600,
                    fontFamily: 'monospace',
                  }}>
                    {pair.white}
                  </td>
                  <td style={{
                    padding: '0.3rem 0.25rem',
                    fontWeight: 600,
                    fontFamily: 'monospace',
                    color: pair.black ? 'var(--color-text-primary)' : 'transparent',
                  }}>
                    {pair.black || '...'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
