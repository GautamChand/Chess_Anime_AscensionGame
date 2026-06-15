interface CapturedPiecesProps {
  white: string[]
  black: string[]
}

export default function CapturedPieces({ white, black }: CapturedPiecesProps) {
  const pieceValues: Record<string, number> = {
    '♟': 1, '♙': 1,
    '♞': 3, '♘': 3,
    '♝': 3, '♗': 3,
    '♜': 5, '♖': 5,
    '♛': 9, '♕': 9,
  }

  const getValue = (pieces: string[]) =>
    pieces.reduce((sum, p) => sum + (pieceValues[p] || 0), 0)

  const whiteAdvantage = getValue(white) - getValue(black)

  return (
    <div className="glass-card" style={{ padding: '1rem' }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.9rem',
        fontWeight: 700,
        marginBottom: '0.75rem',
        color: 'var(--color-accent-purple-light)',
      }}>
        ⚔ Captured Pieces
      </h3>

      {/* White's captures (Black pieces captured by White) */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>♔ White captured:</span>
          {whiteAdvantage > 0 && <span style={{ color: 'var(--color-accent-green)' }}>+{whiteAdvantage}</span>}
        </div>
        <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', minHeight: '28px' }}>
          {white.length === 0 ? (
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontStyle: 'italic' }}>—</span>
          ) : (
            white.map((p, i) => (
              <span key={i} style={{ fontSize: '1.3rem', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>
                {p}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Black's captures (White pieces captured by Black) */}
      <div>
        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>♚ Black captured:</span>
          {whiteAdvantage < 0 && <span style={{ color: 'var(--color-accent-green)' }}>+{Math.abs(whiteAdvantage)}</span>}
        </div>
        <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', minHeight: '28px' }}>
          {black.length === 0 ? (
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontStyle: 'italic' }}>—</span>
          ) : (
            black.map((p, i) => (
              <span key={i} style={{ fontSize: '1.3rem', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}>
                {p}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
