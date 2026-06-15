export interface SpecialEvent {
  name: string
  description: string
  emoji: string
  color: string
  effect: EventEffect
}

export interface EventEffect {
  attackBonus?: number
  defenseBonus?: number
  magicBonus?: number
  speedBonus?: number
  healthBonus?: number
  movement?: number
  doubleTurns?: number
  extraRoll?: boolean
}

export const SPECIAL_EVENTS: Record<number, SpecialEvent> = {
  12: {
    name: 'Great Sage Guidance',
    description: 'The Great Sage analyzes the battlefield! +10 to all stats.',
    emoji: '🧠',
    color: '#06b6d4',
    effect: {
      attackBonus: 10,
      defenseBonus: 10,
      magicBonus: 10,
      speedBonus: 10,
    },
  },
  22: {
    name: "Dragon's Blessing",
    description: 'A dragon descends from the heavens and blesses you! +15 Magic, +10 Defense.',
    emoji: '🐲',
    color: '#8b5cf6',
    effect: {
      magicBonus: 15,
      defenseBonus: 10,
    },
  },
  35: {
    name: 'Harvest Festival',
    description: 'The Harvest Festival empowers your evolution! +20 Health, move forward 5 spaces.',
    emoji: '🎊',
    color: '#f59e0b',
    effect: {
      healthBonus: 20,
      movement: 5,
    },
  },
  45: {
    name: 'Labyrinth Challenge',
    description: 'You navigate the perilous Labyrinth! Your determination grants +15 Attack, +10 Speed.',
    emoji: '🏰',
    color: '#10b981',
    effect: {
      attackBonus: 15,
      speedBonus: 10,
    },
  },
  58: {
    name: 'Empire Invasion',
    description: 'The Empire attacks! You rally your forces and gain combat experience. +20 Attack, +15 Defense.',
    emoji: '⚔',
    color: '#ef4444',
    effect: {
      attackBonus: 20,
      defenseBonus: 15,
    },
  },
  72: {
    name: 'Demon Lord Awakening',
    description: 'You undergo Demon Lord Awakening! All stats increase by 15, gain double movement for 2 turns!',
    emoji: '👑',
    color: '#ec4899',
    effect: {
      attackBonus: 15,
      defenseBonus: 15,
      magicBonus: 15,
      speedBonus: 15,
      doubleTurns: 2,
    },
  },
}

export function getEventByTile(tile: number): SpecialEvent | undefined {
  return SPECIAL_EVENTS[tile]
}
