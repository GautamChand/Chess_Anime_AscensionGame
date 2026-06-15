import { memo } from 'react'
import { motion } from 'motion/react'
import { BOARD_TILES, getDisplayOrder, type BoardTile } from '../data/board'
import type { PlayerState } from '../hooks/useAnimeGame'

interface GameBoardProps {
  players: [PlayerState, PlayerState]
}

function GameBoard({ players }: GameBoardProps) {
  const displayOrder = getDisplayOrder()

  return (
    <div className="game-board-grid">
      {displayOrder.map(tileNum => {
        const tile = BOARD_TILES.find(t => t.number === tileNum)!
        const hasP1 = players[0].position === tileNum
        const hasP2 = players[1].position === tileNum

        return (
          <motion.div
            key={tileNum}
            className={`board-tile ${tile.type}`}
            whileHover={{ scale: 1.08, zIndex: 10 }}
            title={tile.label ? `${tile.number}: ${tile.label}` : `Tile ${tile.number}`}
            style={{ position: 'relative', flexDirection: 'column', overflow: 'visible' }}
          >
            {/* Tile number */}
            <span style={{
              fontSize: '0.55rem',
              color: tile.type === 'normal' ? 'var(--color-text-muted)' : 'rgba(255,255,255,0.8)',
              fontWeight: 600,
              position: 'absolute',
              top: '1px',
              left: '3px',
            }}>
              {tileNum}
            </span>

            {/* Tile emoji/icon */}
            {tile.emoji && (
              <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{tile.emoji}</span>
            )}

            {/* Player tokens */}
            {hasP1 && (
              <motion.div
                className="player-token player-1"
                layoutId="p1-token"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            {hasP2 && (
              <motion.div
                className="player-token player-2"
                layoutId="p2-token"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

export default memo(GameBoard)
