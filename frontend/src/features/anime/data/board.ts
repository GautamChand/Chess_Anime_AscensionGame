import { HEROES, VILLAINS } from './characters'
import { SPECIAL_EVENTS } from './events'

export type TileType = 'normal' | 'start' | 'hero' | 'villain' | 'event' | 'boss'

export interface BoardTile {
  number: number
  type: TileType
  label?: string
  emoji?: string
  color?: string
}

// Build the board layout
function buildBoard(): BoardTile[] {
  const tiles: BoardTile[] = []

  const heroTiles = new Set(HEROES.map(h => h.tile))
  const villainTiles = new Set(VILLAINS.map(v => v.tile))
  const eventTiles = new Set(Object.keys(SPECIAL_EVENTS).map(Number))
  const bossTiles = new Set([95, 96, 97, 98, 99, 100])

  for (let i = 1; i <= 100; i++) {
    if (i === 1) {
      tiles.push({ number: i, type: 'start', label: 'START', emoji: '🌟', color: '#3b82f6' })
    } else if (bossTiles.has(i)) {
      tiles.push({
        number: i,
        type: 'boss',
        label: i === 100 ? 'GOAL' : `Boss ${i}`,
        emoji: i === 100 ? '👑' : '🐉',
        color: '#7c3aed',
      })
    } else if (heroTiles.has(i)) {
      const hero = HEROES.find(h => h.tile === i)!
      tiles.push({
        number: i,
        type: 'hero',
        label: hero.name.split(' ')[0],
        emoji: hero.emoji,
        color: hero.color,
      })
    } else if (villainTiles.has(i)) {
      const villain = VILLAINS.find(v => v.tile === i)!
      tiles.push({
        number: i,
        type: 'villain',
        label: villain.name.split(' ')[0],
        emoji: villain.emoji,
        color: villain.color,
      })
    } else if (eventTiles.has(i)) {
      const event = SPECIAL_EVENTS[i]
      tiles.push({
        number: i,
        type: 'event',
        label: event.name.split(' ')[0],
        emoji: event.emoji,
        color: event.color,
      })
    } else {
      tiles.push({ number: i, type: 'normal' })
    }
  }

  return tiles
}

export const BOARD_TILES = buildBoard()

/**
 * Get the display order of tiles for the 10x10 grid.
 * The board snakes: row 1 goes left-to-right, row 2 right-to-left, etc.
 * Starting from bottom (tile 1) to top (tile 100).
 */
export function getDisplayOrder(): number[] {
  const order: number[] = []
  for (let row = 9; row >= 0; row--) {
    const start = row * 10 + 1
    const end = start + 9
    const rowTiles: number[] = []
    for (let i = start; i <= end; i++) {
      rowTiles.push(i)
    }
    // Snake pattern: even rows (from bottom) go right-to-left
    if ((9 - row) % 2 === 1) {
      rowTiles.reverse()
    }
    order.push(...rowTiles)
  }
  return order
}

export function getTile(tileNumber: number): BoardTile | undefined {
  return BOARD_TILES.find(t => t.number === tileNumber)
}
