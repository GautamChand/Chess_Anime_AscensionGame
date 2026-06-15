import { useState, useCallback, useEffect } from 'react'
import { HEROES, VILLAINS, getCharacterByTile, type Character } from '../data/characters'
import { getEventByTile, type SpecialEvent } from '../data/events'

export type GamePhase = 'waiting' | 'rolling' | 'moving' | 'encounter' | 'event' | 'boss' | 'gameover'
export type PlayerMode = 'pvp' | 'pvai'

// ============================================
// BUFF SYSTEM — Typed, Duration-Tracked Buffs
// ============================================

export type BuffType = 'stat' | 'immunity' | 'doubleMove' | 'doubleAttack' | 'lucky' | 'custom'

export interface Buff {
  id: string
  name: string
  source: string        // character who granted it
  type: BuffType
  description: string
  duration: number      // -1 = permanent, N = turns remaining
  stackable: boolean
  emoji: string
}

// ============================================
// COLLECTED HERO TRACKING
// ============================================

export interface CollectedHero {
  name: string
  emoji: string
  tile: number
  acquiredTurn: number
  active: boolean
}

// ============================================
// PLAYER STATE
// ============================================

export interface PlayerState {
  id: number
  name: string
  position: number
  health: number
  attack: number
  defense: number
  magic: number
  speed: number
  collectedHeroes: CollectedHero[]
  activeBuffs: Buff[]
  skipTurn: boolean
  color: string
  emoji: string
}

export interface GameLog {
  turn: number
  player: string
  message: string
  type: 'info' | 'hero' | 'villain' | 'event' | 'boss' | 'dice' | 'warning' | 'buff' | 'move'
  timestamp: number
}

export interface AnimeGameState {
  players: [PlayerState, PlayerState]
  currentPlayer: 0 | 1
  turn: number
  phase: GamePhase
  diceValue: number | null
  isRolling: boolean
  logs: GameLog[]
  currentEncounter: Character | null
  currentEvent: SpecialEvent | null
  winner: number | null
  mode: PlayerMode
}

// ============================================
// BUFF HELPERS
// ============================================

let buffIdCounter = 0
function nextBuffId(): string {
  return `buff_${++buffIdCounter}_${Date.now()}`
}

function createBuff(name: string, source: string, type: BuffType, description: string, duration: number, emoji: string, stackable = false): Buff {
  return { id: nextBuffId(), name, source, type, description, duration, stackable, emoji }
}

function hasBuffType(player: PlayerState, type: BuffType): boolean {
  return player.activeBuffs.some(b => b.type === type)
}

function addBuff(player: PlayerState, buff: Buff): PlayerState {
  const existing = player.activeBuffs.find(b => b.name === buff.name)
  if (existing && !buff.stackable) {
    // Refresh duration instead of stacking
    return {
      ...player,
      activeBuffs: player.activeBuffs.map(b =>
        b.name === buff.name ? { ...b, duration: Math.max(b.duration, buff.duration) } : b
      ),
    }
  }
  return { ...player, activeBuffs: [...player.activeBuffs, buff] }
}

function tickBuffs(player: PlayerState): { player: PlayerState; expiredNames: string[] } {
  const expiredNames: string[] = []
  const remaining: Buff[] = []

  for (const buff of player.activeBuffs) {
    if (buff.duration === -1) {
      remaining.push(buff) // permanent buff
    } else if (buff.duration > 1) {
      remaining.push({ ...buff, duration: buff.duration - 1 })
    } else {
      expiredNames.push(buff.name)
    }
  }

  return { player: { ...player, activeBuffs: remaining }, expiredNames }
}

function removeAllBuffs(player: PlayerState): PlayerState {
  return { ...player, activeBuffs: [] }
}

function hasHero(player: PlayerState, heroName: string): boolean {
  return player.collectedHeroes.some(h => h.name === heroName)
}

function hasAnyHero(player: PlayerState, heroNames: string[]): boolean {
  return heroNames.some(name => hasHero(player, name))
}

function hasBossRequirements(player: PlayerState): boolean {
  return hasHero(player, 'Rimuru Tempest') &&
    hasAnyHero(player, ['Diablo', 'Guy Crimson', 'Veldora', 'Milim Nava'])
}

// ============================================
// PLAYER FACTORY
// ============================================

function createPlayer(id: number): PlayerState {
  return {
    id,
    name: id === 0 ? 'Player 1' : 'Player 2',
    position: 1,
    health: 100,
    attack: 10,
    defense: 10,
    magic: 10,
    speed: 10,
    collectedHeroes: [],
    activeBuffs: [],
    skipTurn: false,
    color: id === 0 ? '#06b6d4' : '#ec4899',
    emoji: id === 0 ? '⚔' : '🛡',
  }
}

// ============================================
// TURN HELPER — Determines the next player
// ============================================

function advanceTurn(prev: AnimeGameState, updatedPlayer: PlayerState, newLogs: GameLog[]): Pick<AnimeGameState, 'currentPlayer' | 'turn' | 'logs'> {
  // Lucky survivor bonus roll check
  const hasLucky = hasBuffType(updatedPlayer, 'lucky')
  let nextPlayer = (prev.currentPlayer === 0 ? 1 : 0) as 0 | 1
  const logs = [...newLogs]

  if (hasLucky && Math.random() < 0.5) {
    nextPlayer = prev.currentPlayer as 0 | 1
    logs.push({
      turn: prev.turn,
      player: updatedPlayer.name,
      message: `🍀 ${updatedPlayer.name}'s Lucky Survivor activates! Bonus turn!`,
      type: 'info',
      timestamp: Date.now(),
    })
  }

  return {
    currentPlayer: nextPlayer,
    turn: nextPlayer === 0 ? prev.turn + 1 : prev.turn,
    logs,
  }
}

// ============================================
// GAME HOOK
// ============================================

export function useAnimeGame() {
  const [state, setState] = useState<AnimeGameState>({
    players: [createPlayer(0), createPlayer(1)],
    currentPlayer: 0,
    turn: 1,
    phase: 'waiting',
    diceValue: null,
    isRolling: false,
    logs: [{
      turn: 0,
      player: 'System',
      message: '🌟 Welcome to Anime Ascension! Roll the dice to begin your journey to godhood!',
      type: 'info',
      timestamp: Date.now(),
    }],
    currentEncounter: null,
    currentEvent: null,
    winner: null,
    mode: 'pvp',
  })

  // ==========================================
  // AI AUTO-PLAY (PvAI mode)
  // ==========================================

  useEffect(() => {
    if (state.mode !== 'pvai') return
    if (state.currentPlayer !== 1) return
    if (state.phase === 'gameover') return

    if (state.phase === 'waiting') {
      const timer = setTimeout(() => rollDice(), 800)
      return () => clearTimeout(timer)
    }

    if (state.phase === 'encounter' || state.phase === 'event' || state.phase === 'boss') {
      const timer = setTimeout(() => {
        if (state.phase === 'encounter') resolveEncounter()
        else if (state.phase === 'event') resolveEvent()
        else if (state.phase === 'boss') resolveBoss()
      }, 1200)
      return () => clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPlayer, state.phase, state.mode])

  // ==========================================
  // DICE ROLL
  // ==========================================

  const rollDice = useCallback(() => {
    if (state.phase !== 'waiting' || state.isRolling) return

    setState(prev => {
      const player = prev.players[prev.currentPlayer]

      // Check if player must skip turn
      if (player.skipTurn) {
        const newPlayers = [...prev.players] as [PlayerState, PlayerState]
        newPlayers[prev.currentPlayer] = { ...player, skipTurn: false }
        const nextPlayer = (prev.currentPlayer === 0 ? 1 : 0) as 0 | 1
        return {
          ...prev,
          players: newPlayers,
          currentPlayer: nextPlayer,
          turn: nextPlayer === 0 ? prev.turn + 1 : prev.turn,
          logs: [...prev.logs, {
            turn: prev.turn,
            player: player.name,
            message: `❄ ${player.name} is frozen and must skip this turn!`,
            type: 'warning',
            timestamp: Date.now(),
          }],
        }
      }

      // Start rolling animation
      return { ...prev, isRolling: true, phase: 'rolling' as GamePhase }
    })

    // After animation, resolve dice (delay for visual roll effect)
    setTimeout(() => {
      setState(prev => {
        if (!prev.isRolling) return prev // Guard against double-fire

        const player = prev.players[prev.currentPlayer]
        const dice = Math.floor(Math.random() * 6) + 1
        let movement = dice

        // Double movement buff
        if (hasBuffType(player, 'doubleMove')) {
          movement *= 2
        }

        const newPosition = Math.min(player.position + movement, 100)

        // Tick buffs at start of turn
        const { player: tickedPlayer, expiredNames } = tickBuffs(player)
        const updatedPlayer = {
          ...tickedPlayer,
          position: newPosition,
        }
        const newPlayers = [...prev.players] as [PlayerState, PlayerState]
        newPlayers[prev.currentPlayer] = updatedPlayer

        const newLogs = [...prev.logs]

        // Log expired buffs
        for (const name of expiredNames) {
          newLogs.push({
            turn: prev.turn,
            player: player.name,
            message: `⏳ ${name} expired!`,
            type: 'buff',
            timestamp: Date.now(),
          })
        }

        // Detailed dice roll log
        newLogs.push({
          turn: prev.turn,
          player: player.name,
          message: `🎲 ${player.name} rolled a ${dice}${movement !== dice ? ` (×2 = ${movement})` : ''}!`,
          type: 'dice',
          timestamp: Date.now(),
        })

        // Movement log
        newLogs.push({
          turn: prev.turn,
          player: player.name,
          message: `➡️ Moved from Tile ${player.position} → Tile ${newPosition}`,
          type: 'move',
          timestamp: Date.now(),
        })

        // Check what's on the tile
        const character = getCharacterByTile(newPosition)
        const event = getEventByTile(newPosition)
        const isBossZone = newPosition >= 95

        let phase: GamePhase = 'waiting'
        let encounter: Character | null = null
        let currentEvent: SpecialEvent | null = null

        if (isBossZone) {
          phase = 'boss'
          newLogs.push({
            turn: prev.turn,
            player: player.name,
            message: `🐉 ${player.name} enters Veldanava's Domain!`,
            type: 'boss',
            timestamp: Date.now(),
          })
        } else if (character) {
          phase = 'encounter'
          encounter = character
          newLogs.push({
            turn: prev.turn,
            player: player.name,
            message: character.type === 'hero'
              ? `👑 Encountered ${character.name} — ${character.title}!`
              : `⚠ Encountered ${character.name} — ${character.title}!`,
            type: character.type === 'hero' ? 'hero' : 'villain',
            timestamp: Date.now(),
          })
        } else if (event) {
          phase = 'event'
          currentEvent = event
          newLogs.push({
            turn: prev.turn,
            player: player.name,
            message: `🌟 Triggered event: ${event.name}!`,
            type: 'event',
            timestamp: Date.now(),
          })
        }

        // === KEY FIX: If landing on a normal tile (no encounter/event/boss),
        //     switch turn immediately. Previously this was missing! ===
        if (phase === 'waiting') {
          const turnAdvance = advanceTurn(prev, updatedPlayer, newLogs)
          return {
            ...prev,
            players: newPlayers,
            diceValue: dice,
            isRolling: false,
            phase: 'waiting',
            currentEncounter: null,
            currentEvent: null,
            ...turnAdvance,
          }
        }

        return {
          ...prev,
          players: newPlayers,
          diceValue: dice,
          isRolling: false,
          phase,
          currentEncounter: encounter,
          currentEvent: currentEvent,
          logs: newLogs,
        }
      })
    }, 800)
  }, [state.phase, state.isRolling])

  // ==========================================
  // RESOLVE HERO/VILLAIN ENCOUNTER
  // ==========================================

  const resolveEncounter = useCallback(() => {
    setState(prev => {
      const player = prev.players[prev.currentPlayer]
      const encounter = prev.currentEncounter
      if (!encounter) return prev

      const newPlayers = [...prev.players] as [PlayerState, PlayerState]
      let updatedPlayer = { ...player }
      const newLogs = [...prev.logs]

      if (encounter.type === 'hero') {
        // Collect hero if not already collected
        if (!hasHero(updatedPlayer, encounter.name)) {
          const collectedHero: CollectedHero = {
            name: encounter.name,
            emoji: encounter.emoji,
            tile: encounter.tile,
            acquiredTurn: prev.turn,
            active: true,
          }
          updatedPlayer.collectedHeroes = [...updatedPlayer.collectedHeroes, collectedHero]
        }

        // Apply hero effects
        const effect = encounter.effect
        if (effect.attackBonus) {
          updatedPlayer.attack += effect.attackBonus
          newLogs.push({ turn: prev.turn, player: player.name, message: `🔥 +${effect.attackBonus} Attack!`, type: 'buff', timestamp: Date.now() })
        }
        if (effect.defenseBonus) {
          updatedPlayer.defense += effect.defenseBonus
          newLogs.push({ turn: prev.turn, player: player.name, message: `🛡 +${effect.defenseBonus} Defense!`, type: 'buff', timestamp: Date.now() })
        }
        if (effect.magicBonus) {
          updatedPlayer.magic += effect.magicBonus
          newLogs.push({ turn: prev.turn, player: player.name, message: `✨ +${effect.magicBonus} Magic!`, type: 'buff', timestamp: Date.now() })
        }
        if (effect.speedBonus) {
          updatedPlayer.speed += effect.speedBonus
          newLogs.push({ turn: prev.turn, player: player.name, message: `💨 +${effect.speedBonus} Speed!`, type: 'buff', timestamp: Date.now() })
        }
        if (effect.healthBonus) {
          updatedPlayer.health += effect.healthBonus
          newLogs.push({ turn: prev.turn, player: player.name, message: `❤ +${effect.healthBonus} Health!`, type: 'buff', timestamp: Date.now() })
        }

        // Immunity buff
        if (effect.immunity) {
          updatedPlayer = addBuff(updatedPlayer,
            createBuff('Primordial Shield', encounter.name, 'immunity', 'Immune to next villain encounter', -1, '🛡')
          )
          newLogs.push({ turn: prev.turn, player: player.name, message: `🛡 Buff: Primordial Shield (Villain Immunity)`, type: 'buff', timestamp: Date.now() })
        }

        // Double movement buff
        if (effect.doubleTurns) {
          updatedPlayer = addBuff(updatedPlayer,
            createBuff('Storm Dragon Speed', encounter.name, 'doubleMove', `Double movement for ${effect.doubleTurns} turns`, effect.doubleTurns, '💨')
          )
          newLogs.push({ turn: prev.turn, player: player.name, message: `💨 Buff: Storm Dragon Speed (×2 movement for ${effect.doubleTurns} turns)`, type: 'buff', timestamp: Date.now() })
        }

        // Double attack buff
        if (effect.doubleAttack) {
          updatedPlayer = addBuff(updatedPlayer,
            createBuff('Berserker Rage', encounter.name, 'doubleAttack', 'Double attack for next encounter', -1, '⚔')
          )
          newLogs.push({ turn: prev.turn, player: player.name, message: `⚔ Buff: Berserker Rage (×2 Attack)`, type: 'buff', timestamp: Date.now() })
        }

        // Lucky survivor buff
        if (effect.luckySurvivor) {
          updatedPlayer = addBuff(updatedPlayer,
            createBuff('Lucky Survivor', encounter.name, 'lucky', '50% chance for bonus turns', -1, '🍀')
          )
          newLogs.push({ turn: prev.turn, player: player.name, message: `🍀 Buff: Lucky Survivor (50% bonus turns)`, type: 'buff', timestamp: Date.now() })
        }

        // Forward movement
        if (effect.movement && effect.movement > 0) {
          const oldPos = updatedPlayer.position
          updatedPlayer.position = Math.min(updatedPlayer.position + effect.movement, 100)
          newLogs.push({ turn: prev.turn, player: player.name, message: `➡️ Advanced ${effect.movement} tiles → Tile ${updatedPlayer.position}`, type: 'move', timestamp: Date.now() })
        }
        if (effect.teleport) {
          updatedPlayer.position = Math.min(updatedPlayer.position + effect.teleport, 100)
          newLogs.push({ turn: prev.turn, player: player.name, message: `🌀 Teleported forward ${effect.teleport} tiles → Tile ${updatedPlayer.position}`, type: 'move', timestamp: Date.now() })
        }

        newLogs.push({
          turn: prev.turn,
          player: player.name,
          message: `✨ ${player.name} recruited ${encounter.name}!`,
          type: 'hero',
          timestamp: Date.now(),
        })
      } else {
        // VILLAIN ENCOUNTER
        const hasImmunity = hasBuffType(updatedPlayer, 'immunity')

        if (hasImmunity) {
          // Remove immunity buff after use
          updatedPlayer = {
            ...updatedPlayer,
            activeBuffs: updatedPlayer.activeBuffs.filter(b => b.type !== 'immunity'),
          }
          newLogs.push({
            turn: prev.turn,
            player: player.name,
            message: `🛡 ${player.name} is immune! ${encounter.name}'s attack was blocked! (Shield consumed)`,
            type: 'info',
            timestamp: Date.now(),
          })
        } else {
          // Apply villain-specific effects
          const effect = encounter.effect

          // Michael: Remove ALL buffs + move back 20
          if (effect.removeBuff) {
            const buffCount = updatedPlayer.activeBuffs.length
            updatedPlayer = removeAllBuffs(updatedPlayer)
            newLogs.push({ turn: prev.turn, player: player.name, message: `💥 All buffs removed! (${buffCount} buffs lost)`, type: 'villain', timestamp: Date.now() })
          }

          // Movement penalty
          if (effect.movement && effect.movement < 0) {
            const oldPos = updatedPlayer.position
            updatedPlayer.position = Math.max(1, updatedPlayer.position + effect.movement)
            newLogs.push({ turn: prev.turn, player: player.name, message: `⬅️ Pushed back ${Math.abs(effect.movement)} tiles → Tile ${updatedPlayer.position}`, type: 'move', timestamp: Date.now() })
          }

          // Feldway: Random teleport backward
          if (effect.randomTeleportBack) {
            const oldPos = updatedPlayer.position
            const newPos = Math.max(1, Math.floor(Math.random() * Math.max(1, updatedPlayer.position - 20)) + 1)
            updatedPlayer.position = newPos
            newLogs.push({ turn: prev.turn, player: player.name, message: `🌀 Teleported backward → Tile ${newPos} (from ${oldPos})`, type: 'move', timestamp: Date.now() })
          }

          // Velzard: Skip turn
          if (effect.loseTurn || effect.skipTurn) {
            updatedPlayer.skipTurn = true
            newLogs.push({ turn: prev.turn, player: player.name, message: `❄ Frozen! Must skip next turn.`, type: 'warning', timestamp: Date.now() })
          }

          // Clayman: Attack reduction
          if (effect.attackReduction) {
            const oldAtk = updatedPlayer.attack
            updatedPlayer.attack = Math.max(1, Math.floor(updatedPlayer.attack * (1 - effect.attackReduction / 100)))
            newLogs.push({ turn: prev.turn, player: player.name, message: `📉 Attack reduced by ${effect.attackReduction}%! (${oldAtk} → ${updatedPlayer.attack})`, type: 'villain', timestamp: Date.now() })
          }

          // Jahil: Random stat reduction
          if (effect.randomStatReduction) {
            const stats = ['attack', 'defense', 'magic', 'speed'] as const
            const statNames = { attack: 'Attack', defense: 'Defense', magic: 'Magic', speed: 'Speed' }
            const stat = stats[Math.floor(Math.random() * stats.length)]
            const oldVal = updatedPlayer[stat]
            updatedPlayer[stat] = Math.max(1, updatedPlayer[stat] - 10)
            newLogs.push({ turn: prev.turn, player: player.name, message: `📉 ${statNames[stat]} reduced by 10! (${oldVal} → ${updatedPlayer[stat]})`, type: 'villain', timestamp: Date.now() })
          }

          newLogs.push({
            turn: prev.turn,
            player: player.name,
            message: `💀 ${player.name} was attacked by ${encounter.name}!`,
            type: 'villain',
            timestamp: Date.now(),
          })
        }
      }

      newPlayers[prev.currentPlayer] = updatedPlayer

      // Advance turn
      const turnAdvance = advanceTurn(prev, updatedPlayer, newLogs)

      return {
        ...prev,
        players: newPlayers,
        phase: 'waiting',
        currentEncounter: null,
        ...turnAdvance,
      }
    })
  }, [])

  // ==========================================
  // RESOLVE SPECIAL EVENT
  // ==========================================

  const resolveEvent = useCallback(() => {
    setState(prev => {
      const player = prev.players[prev.currentPlayer]
      const event = prev.currentEvent
      if (!event) return prev

      const newPlayers = [...prev.players] as [PlayerState, PlayerState]
      let updatedPlayer = { ...player }
      const newLogs = [...prev.logs]

      const e = event.effect
      if (e.attackBonus) {
        updatedPlayer.attack += e.attackBonus
        newLogs.push({ turn: prev.turn, player: player.name, message: `🔥 +${e.attackBonus} Attack!`, type: 'buff', timestamp: Date.now() })
      }
      if (e.defenseBonus) {
        updatedPlayer.defense += e.defenseBonus
        newLogs.push({ turn: prev.turn, player: player.name, message: `🛡 +${e.defenseBonus} Defense!`, type: 'buff', timestamp: Date.now() })
      }
      if (e.magicBonus) {
        updatedPlayer.magic += e.magicBonus
        newLogs.push({ turn: prev.turn, player: player.name, message: `✨ +${e.magicBonus} Magic!`, type: 'buff', timestamp: Date.now() })
      }
      if (e.speedBonus) {
        updatedPlayer.speed += e.speedBonus
        newLogs.push({ turn: prev.turn, player: player.name, message: `💨 +${e.speedBonus} Speed!`, type: 'buff', timestamp: Date.now() })
      }
      if (e.healthBonus) {
        updatedPlayer.health += e.healthBonus
        newLogs.push({ turn: prev.turn, player: player.name, message: `❤ +${e.healthBonus} Health!`, type: 'buff', timestamp: Date.now() })
      }
      if (e.movement) {
        updatedPlayer.position = Math.min(updatedPlayer.position + e.movement, 100)
        newLogs.push({ turn: prev.turn, player: player.name, message: `➡️ Advanced ${e.movement} tiles → Tile ${updatedPlayer.position}`, type: 'move', timestamp: Date.now() })
      }

      if (e.doubleTurns) {
        updatedPlayer = addBuff(updatedPlayer,
          createBuff('Event Boost', event.name, 'doubleMove', `Double movement for ${e.doubleTurns} turns`, e.doubleTurns, '⚡')
        )
        newLogs.push({ turn: prev.turn, player: player.name, message: `⚡ Buff: Double Movement for ${e.doubleTurns} turns!`, type: 'buff', timestamp: Date.now() })
      }

      newLogs.push({
        turn: prev.turn,
        player: player.name,
        message: `🌟 ${event.name}: ${event.description}`,
        type: 'event',
        timestamp: Date.now(),
      })

      newPlayers[prev.currentPlayer] = updatedPlayer

      // Advance turn
      const turnAdvance = advanceTurn(prev, updatedPlayer, newLogs)

      return {
        ...prev,
        players: newPlayers,
        phase: 'waiting',
        currentEvent: null,
        ...turnAdvance,
      }
    })
  }, [])

  // ==========================================
  // RESOLVE BOSS BATTLE
  // ==========================================

  const resolveBoss = useCallback(() => {
    setState(prev => {
      const player = prev.players[prev.currentPlayer]
      const newPlayers = [...prev.players] as [PlayerState, PlayerState]
      const updatedPlayer = { ...player }
      const newLogs = [...prev.logs]

      const canFight = hasBossRequirements(updatedPlayer)

      if (canFight) {
        // VICTORY!
        newLogs.push({
          turn: prev.turn,
          player: player.name,
          message: `👑 ${player.name} defeats Veldanava, the Creator Dragon! VICTORY!`,
          type: 'boss',
          timestamp: Date.now(),
        })
        updatedPlayer.position = 100
        newPlayers[prev.currentPlayer] = updatedPlayer

        return {
          ...prev,
          players: newPlayers,
          phase: 'gameover' as GamePhase,
          winner: prev.currentPlayer,
          logs: newLogs,
        }
      } else {
        // DEFEAT — sent back to tile 70
        const missing: string[] = []
        if (!hasHero(updatedPlayer, 'Rimuru Tempest')) missing.push('Rimuru Tempest')
        if (!hasAnyHero(updatedPlayer, ['Diablo', 'Guy Crimson', 'Veldora', 'Milim Nava'])) {
          missing.push('one of: Diablo, Guy Crimson, Veldora, Milim Nava')
        }

        newLogs.push({
          turn: prev.turn,
          player: player.name,
          message: `💀 ${player.name} challenged Veldanava without the required allies and was defeated!`,
          type: 'boss',
          timestamp: Date.now(),
        })
        newLogs.push({
          turn: prev.turn,
          player: player.name,
          message: `📋 Missing: ${missing.join(' AND ')}`,
          type: 'warning',
          timestamp: Date.now(),
        })
        newLogs.push({
          turn: prev.turn,
          player: player.name,
          message: `⬅️ Sent back to Tile 70`,
          type: 'move',
          timestamp: Date.now(),
        })

        updatedPlayer.position = 70
        newPlayers[prev.currentPlayer] = updatedPlayer

        const nextPlayer = (prev.currentPlayer === 0 ? 1 : 0) as 0 | 1

        return {
          ...prev,
          players: newPlayers,
          phase: 'waiting' as GamePhase,
          currentPlayer: nextPlayer,
          turn: nextPlayer === 0 ? prev.turn + 1 : prev.turn,
          logs: newLogs,
        }
      }
    })
  }, [])

  // ==========================================
  // NEW GAME & MODE
  // ==========================================

  const newGame = useCallback(() => {
    buffIdCounter = 0
    setState({
      players: [createPlayer(0), createPlayer(1)],
      currentPlayer: 0,
      turn: 1,
      phase: 'waiting',
      diceValue: null,
      isRolling: false,
      logs: [{
        turn: 0,
        player: 'System',
        message: '🌟 New game started! Roll the dice to begin your journey!',
        type: 'info',
        timestamp: Date.now(),
      }],
      currentEncounter: null,
      currentEvent: null,
      winner: null,
      mode: state.mode,
    })
  }, [state.mode])

  const setMode = useCallback((mode: PlayerMode) => {
    setState(prev => ({ ...prev, mode }))
  }, [])

  return {
    ...state,
    rollDice,
    resolveEncounter,
    resolveEvent,
    resolveBoss,
    newGame,
    setMode,
    hasBossRequirements: (player: PlayerState) => hasBossRequirements(player),
  }
}
