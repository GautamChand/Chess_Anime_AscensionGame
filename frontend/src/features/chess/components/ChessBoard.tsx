import { memo, useCallback } from 'react'
import { motion } from 'motion/react'
import type { Square } from 'chess.js'

// Unicode chess pieces
const PIECE_SYMBOLS: Record<string, string> = {
  wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙',
  bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟',
}

interface ChessBoardProps {
  fen: string
  selectedSquare: Square | null
  legalMoves: string[]
  lastMove: { from: Square; to: Square } | null
  onSquareClick: (square: Square) => void
  isFlipped?: boolean
}

function ChessBoard({ fen, selectedSquare, legalMoves, lastMove, onSquareClick, isFlipped = false }: ChessBoardProps) {
  // Parse FEN to get piece positions
  const parseFEN = useCallback((fen: string) => {
    const board: (string | null)[][] = []
    const rows = fen.split(' ')[0].split('/')
    
    for (const row of rows) {
      const boardRow: (string | null)[] = []
      for (const ch of row) {
        if (ch >= '1' && ch <= '8') {
          for (let i = 0; i < parseInt(ch); i++) boardRow.push(null)
        } else {
          const color = ch === ch.toUpperCase() ? 'w' : 'b'
          const piece = ch.toLowerCase()
          boardRow.push(color + piece)
        }
      }
      board.push(boardRow)
    }
    return board
  }, [])

  const board = parseFEN(fen)
  const isInCheck = fen.includes(' ') // We'll check via the game status

  // Find king in check
  const turn = fen.split(' ')[1] || 'w'
  const kingSquare = findKingSquare(board, turn)

  const ranks = isFlipped ? [0, 1, 2, 3, 4, 5, 6, 7] : [0, 1, 2, 3, 4, 5, 6, 7]
  const files = isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7]

  return (
    <div style={{ position: 'relative' }}>
      {/* Board coordinate labels */}
      <div style={{ display: 'flex', paddingLeft: '24px' }}>
        {files.map(f => (
          <div key={f} style={{
            flex: 1,
            textAlign: 'center',
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            fontWeight: 600,
            paddingBottom: '4px',
          }}>
            {String.fromCharCode(97 + f)}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex' }}>
        {/* Rank labels */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', paddingRight: '4px' }}>
          {ranks.map(r => (
            <div key={r} style={{
              fontSize: '0.7rem',
              color: 'var(--color-text-muted)',
              fontWeight: 600,
              width: '20px',
              textAlign: 'center',
            }}>
              {isFlipped ? r + 1 : 8 - r}
            </div>
          ))}
        </div>

        {/* The board */}
        <div className="chess-board" style={{ flex: 1, maxWidth: '560px' }}>
          {ranks.map(rank => (
            files.map(file => {
              const square = `${String.fromCharCode(97 + file)}${8 - rank}` as Square
              const isLight = (rank + file) % 2 === 0
              const piece = board[rank]?.[file]
              const isSelected = selectedSquare === square
              const isLegal = legalMoves.includes(square)
              const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square)
              const hasPiece = piece !== null
              const isKingInCheck = kingSquare === square && isInCheckFromFen(fen)

              let className = `chess-square ${isLight ? 'light' : 'dark'}`
              if (isSelected) className += ' selected'
              if (isLegal && !hasPiece) className += ' legal-move'
              if (isLegal && hasPiece) className += ' legal-capture'
              if (isLastMove) className += ' last-move'
              if (isKingInCheck) className += ' in-check'

              return (
                <div
                  key={square}
                  id={`square-${square}`}
                  className={className}
                  onClick={() => onSquareClick(square)}
                >
                  {piece && (
                    <motion.span
                      className="chess-piece"
                      initial={false}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 1.2 }}
                      style={{
                        filter: piece.startsWith('b') ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                      }}
                    >
                      {PIECE_SYMBOLS[piece]}
                    </motion.span>
                  )}
                </div>
              )
            })
          ))}
        </div>
      </div>
    </div>
  )
}

function findKingSquare(board: (string | null)[][], turn: string): string | null {
  const king = turn + 'k'
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      if (board[r]?.[f] === king) {
        return `${String.fromCharCode(97 + f)}${8 - r}`
      }
    }
  }
  return null
}

function isInCheckFromFen(fen: string): boolean {
  // Simple heuristic: we rely on game state for this
  // This is handled by the statusMessage in the game hook
  return false
}

export default memo(ChessBoard)
