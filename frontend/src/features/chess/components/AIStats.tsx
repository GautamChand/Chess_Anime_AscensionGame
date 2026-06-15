import { motion } from 'motion/react'
import type { AIStats } from '../services/chessApi'

interface AIStatsProps {
  stats: AIStats | null
  isThinking: boolean
}

export default function AIStatsPanel({ stats, isThinking }: AIStatsProps) {
  return (
    <div className="glass-card" style={{ padding: '1rem' }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.9rem',
        fontWeight: 700,
        marginBottom: '0.75rem',
        color: 'var(--color-accent-cyan)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        🤖 AI Performance
        {isThinking && (
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ fontSize: '0.7rem', color: 'var(--color-accent-gold)' }}
          >
            ⚡ Thinking...
          </motion.span>
        )}
      </h3>

      {!stats ? (
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
          AI stats will appear after the first AI move
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.8rem' }}>
          {/* Best Move */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-md)', background: 'rgba(124, 58, 237, 0.1)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Best Move</span>
            <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-accent-gold)' }}>
              {stats.best_move_san || stats.best_move}
              {stats.from_book && <span style={{ fontSize: '0.65rem', marginLeft: '0.25rem', color: 'var(--color-accent-green)' }}>📖</span>}
            </span>
          </div>

          {/* Search Depth */}
          <StatRow label="Search Depth" value={`${stats.depth} plies`} />

          {/* Evaluation */}
          <StatRow
            label="Evaluation"
            value={formatScore(stats.score)}
            valueColor={stats.score > 0 ? 'var(--color-accent-green)' : stats.score < 0 ? 'var(--color-accent-red)' : 'var(--color-text-primary)'}
          />

          {/* Nodes Explored */}
          <StatRow label="Nodes Explored" value={formatNumber(stats.nodes_explored)} />

          {/* Nodes Pruned */}
          <StatRow label="Nodes Pruned" value={formatNumber(stats.nodes_pruned)} />

          {/* TT Hits */}
          <StatRow label="TT Hits" value={formatNumber(stats.tt_hits)} />

          {/* Search Time */}
          <StatRow label="Search Time" value={`${stats.search_time_ms.toFixed(0)} ms`} />

          {/* PV Line */}
          {stats.pv_line.length > 0 && (
            <div style={{ padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.05)' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', marginBottom: '0.2rem' }}>Principal Variation</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                {stats.pv_line.join(' → ')}
              </div>
            </div>
          )}

          {/* Comparison Section */}
          <div style={{
            marginTop: '0.5rem',
            padding: '0.6rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245, 158, 11, 0.05)',
            border: '1px solid rgba(245, 158, 11, 0.1)',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-accent-gold)' }}>
              📊 Search Efficiency Comparison
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.7rem' }}>
              <div>
                <div style={{ color: 'var(--color-text-muted)' }}>Exhaustive Minimax</div>
                <div style={{ fontWeight: 600, color: 'var(--color-accent-red)' }}>
                  O(b<sup>d</sup>) ≈ {formatNumber(stats.estimated_minimax_nodes)}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--color-text-muted)' }}>Alpha-Beta Pruning</div>
                <div style={{ fontWeight: 600, color: 'var(--color-accent-green)' }}>
                  O(b<sup>d/2</sup>) ≈ {formatNumber(stats.nodes_explored)}
                </div>
              </div>
            </div>

            {/* Reduction bar */}
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                <span>Search Space Reduction</span>
                <span style={{ fontWeight: 700, color: 'var(--color-accent-green)' }}>
                  {stats.pruning_reduction_pct.toFixed(1)}%
                </span>
              </div>
              <div className="stat-bar-container">
                <motion.div
                  className="stat-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(stats.pruning_reduction_pct, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4)' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0.6rem' }}>
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 600, fontFamily: 'monospace', color: valueColor || 'var(--color-text-primary)' }}>{value}</span>
    </div>
  )
}

function formatScore(score: number): string {
  if (Math.abs(score) >= 9000) return score > 0 ? 'M' + Math.ceil((99999 - score) / 2) : '-M' + Math.ceil((99999 + score) / 2)
  return (score > 0 ? '+' : '') + (score / 100).toFixed(2)
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}
