import { motion } from 'motion/react'
import { useChessGame } from './hooks/useChessGame'
import ChessBoard from './components/ChessBoard'
import MoveHistory from './components/MoveHistory'
import CapturedPieces from './components/CapturedPieces'
import AIStatsPanel from './components/AIStats'
import GameControls from './components/GameControls'

export default function ChessPage() {
  const {
    fen, history, selectedSquare, legalMoves, lastMove,
    gameMode, gameStatus, aiDepth, isAiThinking, aiStats,
    capturedPieces, statusMessage,
    selectSquare, undoMove, newGame, setGameMode, setAiDepth,
  } = useChessGame()

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
          <span className="gradient-text">♟ Chess AI Engine</span>
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Adversarial Search • Minimax • Alpha-Beta Pruning • Iterative Deepening
        </p>
      </motion.div>

      {/* Main Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr 320px',
        gap: '1.5rem',
        alignItems: 'start',
      }}>
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <GameControls
            gameMode={gameMode}
            aiDepth={aiDepth}
            gameStatus={gameStatus}
            statusMessage={statusMessage}
            isAiThinking={isAiThinking}
            onSetGameMode={setGameMode}
            onSetAiDepth={setAiDepth}
            onUndo={undoMove}
            onNewGame={newGame}
          />
          <CapturedPieces
            white={capturedPieces.white}
            black={capturedPieces.black}
          />
        </motion.div>

        {/* Center - Chess Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ width: '100%', maxWidth: '560px' }}>
            <ChessBoard
              fen={fen}
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              lastMove={lastMove}
              onSquareClick={selectSquare}
            />

            {/* FEN display */}
            <div style={{
              marginTop: '0.75rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              fontSize: '0.65rem',
              fontFamily: 'monospace',
              color: 'var(--color-text-muted)',
              wordBreak: 'break-all',
            }}>
              <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>FEN: </span>
              {fen}
            </div>
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <AIStatsPanel stats={aiStats} isThinking={isAiThinking} />
          <MoveHistory history={history} />
        </motion.div>
      </div>

      {/* Responsive: stack on smaller screens */}
      <style>{`
        @media (max-width: 1100px) {
          div[style*="grid-template-columns: 280px 1fr 320px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.div>
  )
}
