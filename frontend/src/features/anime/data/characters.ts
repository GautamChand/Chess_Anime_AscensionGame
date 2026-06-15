export interface Character {
  name: string
  type: 'hero' | 'villain'
  tile: number
  title: string
  description: string
  emoji: string
  color: string
  effect: CharacterEffect
  lore: CharacterLore
}

export interface CharacterLore {
  fullTitle: string
  role: string
  powers: string[]
  gameplayEffects: string[]
  backstory: string
}

export interface CharacterEffect {
  movement?: number           // Forward/backward movement
  attackBonus?: number
  defenseBonus?: number
  magicBonus?: number
  speedBonus?: number
  healthBonus?: number
  immunity?: boolean          // Immunity against next villain
  doubleTurns?: number        // Double movement for N turns
  doubleAttack?: boolean      // Double attack for next encounter
  luckySurvivor?: boolean     // 50% chance for bonus turns
  teleport?: number           // Teleport forward N spaces
  removeBuff?: boolean        // Remove all buffs
  randomTeleportBack?: boolean // Random teleport to lower tile
  loseTurn?: boolean          // Lose next turn
  skipTurn?: boolean          // Skip next turn
  attackReduction?: number    // Reduce attack by %
  randomStatReduction?: boolean // Random stat reduction
}

export const HEROES: Character[] = [
  {
    name: 'Rimuru Tempest',
    type: 'hero',
    tile: 8,
    title: 'The Great Rimuru',
    description: 'Ultimate Wisdom grants +20 ATK, +20 DEF. Move forward 8 spaces. Required for the final boss battle!',
    emoji: '🔵',
    color: '#06b6d4',
    effect: {
      attackBonus: 20,
      defenseBonus: 20,
      movement: 8,
    },
    lore: {
      fullTitle: 'Supreme Slime Demon Lord',
      role: 'Hero — Required for Boss Battle',
      powers: ['Great Sage / Raphael / Ciel', 'Predator / Beelzebuth', 'Gluttony / Void God Azathoth', 'Universal Shapeshift'],
      gameplayEffects: ['+20 Attack', '+20 Defense', 'Advance 8 Tiles', 'Required for Final Boss'],
      backstory: 'Originally a human from Japan, Rimuru was reincarnated as a slime in a fantasy world. Through his unique ability Predator and the counsel of Great Sage, he became one of the most powerful beings in existence. As the founder and leader of Tempest, he commands the loyalty of powerful subordinates and stands as an Awakened Demon Lord.',
    },
  },
  {
    name: 'Gobta',
    type: 'hero',
    tile: 18,
    title: 'Lucky Survivor',
    description: 'Gobta\'s incredible luck grants 50% chance for bonus turns on each roll!',
    emoji: '🟢',
    color: '#10b981',
    effect: {
      luckySurvivor: true,
    },
    lore: {
      fullTitle: 'Captain of the Goblin Riders',
      role: 'Hero — Luck-Based',
      powers: ['Shadow Step', 'Goblin Rider Summoning', 'Incredible Luck', 'Quick Recovery'],
      gameplayEffects: ['50% chance for bonus turns', 'Persists permanently'],
      backstory: 'Despite being a mere goblin, Gobta possesses extraordinary luck and surprising combat instincts. He has an uncanny ability to survive situations that would kill far stronger warriors. His luck often turns the tide of battles, making him an invaluable asset despite his comedic nature.',
    },
  },
  {
    name: 'Benimaru',
    type: 'hero',
    tile: 25,
    title: 'Flame Commander',
    description: 'The fierce Kijin commander blazes the path forward. Move forward 7 spaces!',
    emoji: '🔥',
    color: '#ef4444',
    effect: {
      movement: 7,
    },
    lore: {
      fullTitle: 'Commander of the Kijin Warriors',
      role: 'Hero — Movement Boost',
      powers: ['Flare Circle', 'Hell Flare', 'Black Lightning', 'Generalissimo'],
      gameplayEffects: ['Advance 7 Tiles'],
      backstory: 'Benimaru is the leader of the Kijin and Rimuru\'s most trusted military commander. After evolving from an Ogre to a Kijin under Rimuru\'s naming, his fire manipulation abilities reached extraordinary levels. He commands Tempest\'s military forces with unwavering loyalty and strategic brilliance.',
    },
  },
  {
    name: 'Shion',
    type: 'hero',
    tile: 33,
    title: 'Berserker Enhancement',
    description: 'Shion\'s berserker rage doubles your attack for the next encounter!',
    emoji: '💜',
    color: '#8b5cf6',
    effect: {
      doubleAttack: true,
    },
    lore: {
      fullTitle: 'Secretary and Berserker',
      role: 'Hero — Attack Buff',
      powers: ['Optimal Action (Cook)', 'Berserker Mode', 'Ultra Speed Regeneration', 'Herculean Strength'],
      gameplayEffects: ['Double Attack for next encounter', 'Permanent buff'],
      backstory: 'Shion is Rimuru\'s self-proclaimed secretary and one of the strongest Kijin warriors. Her unique skill "Optimal Action" (known as "Cook") allows her to alter reality to achieve her desired outcome. Combined with her overwhelming physical strength and berserker fighting style, she is a fearsome warrior on the battlefield.',
    },
  },
  {
    name: 'Veldora',
    type: 'hero',
    tile: 42,
    title: 'Storm Dragon Blessing',
    description: 'The Storm Dragon blesses you with incredible speed. Double movement for the next 3 turns!',
    emoji: '🐉',
    color: '#3b82f6',
    effect: {
      doubleTurns: 3,
    },
    lore: {
      fullTitle: 'Storm Dragon Veldora Tempest',
      role: 'Hero — Speed Buff (Boss Requirement)',
      powers: ['Storm Magic', 'Investigation King Faust', 'Dragon Spirit Haki', 'Probability Manipulation'],
      gameplayEffects: ['Double movement for 3 turns', 'Qualifies as Boss Ally'],
      backstory: 'Veldora Tempest is one of the four True Dragons and was sealed by the Hero for 300 years until Rimuru befriended him. After being freed, he became Rimuru\'s sworn brother and took the surname Tempest. His Storm Dragon powers make him one of the strongest beings in existence.',
    },
  },
  {
    name: 'Diablo',
    type: 'hero',
    tile: 55,
    title: 'Primordial Noir',
    description: 'Diablo\'s dark power grants immunity against the next villain encounter. Move forward 10 spaces!',
    emoji: '😈',
    color: '#1e1b4b',
    effect: {
      immunity: true,
      movement: 10,
    },
    lore: {
      fullTitle: 'Primordial Black (Noir)',
      role: 'Hero — Immunity + Movement (Boss Requirement)',
      powers: ['Temptation World', 'Time Stop', 'Space-Time Manipulation', 'World End'],
      gameplayEffects: ['Immunity to next villain', 'Advance 10 Tiles', 'Qualifies as Boss Ally'],
      backstory: 'Diablo is one of the seven Primordial Demons, known as "Noir" (Black). He voluntarily became Rimuru\'s servant after witnessing Rimuru\'s power during the Farmus Kingdom invasion. Despite being one of the oldest and most powerful demons in existence, he considers serving Rimuru his greatest honor.',
    },
  },
  {
    name: 'Guy Crimson',
    type: 'hero',
    tile: 68,
    title: 'Demon Lord Authority',
    description: 'Guy Crimson bestows Demon Lord Authority. +25 ATK. Move forward 12 spaces!',
    emoji: '👹',
    color: '#dc2626',
    effect: {
      attackBonus: 25,
      movement: 12,
    },
    lore: {
      fullTitle: 'Primordial Red — First Demon Lord',
      role: 'Hero — High Power (Boss Requirement)',
      powers: ['Prideful King Lucifer', 'Ice-Flame Manipulation', 'Demon Lord Haki', 'Reality Warping'],
      gameplayEffects: ['+25 Attack', 'Advance 12 Tiles', 'Qualifies as Boss Ally'],
      backstory: 'Guy Crimson is the first and oldest Demon Lord, also known as the Primordial Red. He has existed since the dawn of time and serves as the de facto ruler of the demon lords. His power rivals that of True Dragons, and he maintains balance in the world through his overwhelming strength and ancient wisdom.',
    },
  },
  {
    name: 'Milim Nava',
    type: 'hero',
    tile: 82,
    title: 'Destroyer Mode',
    description: 'Milim activates Destroyer Mode! Teleport forward 15 spaces instantly!',
    emoji: '💫',
    color: '#ec4899',
    effect: {
      teleport: 15,
    },
    lore: {
      fullTitle: 'Destroyer Dragonoid Demon Lord',
      role: 'Hero — Teleport (Boss Requirement)',
      powers: ['Wrathful King Satan', 'Magicule Breeder Reactor', 'Destroyer Mode', 'Dragon Nova'],
      gameplayEffects: ['Teleport forward 15 Tiles', 'Qualifies as Boss Ally'],
      backstory: 'Milim Nava is the daughter of True Dragon Veldanava and one of the oldest and most powerful Demon Lords. Known as "The Destroyer," her power is virtually limitless due to her Magicule Breeder Reactor, which produces infinite energy. Despite her childlike demeanor, she is recognized as the strongest Demon Lord.',
    },
  },
]

export const VILLAINS: Character[] = [
  {
    name: 'Clayman',
    type: 'villain',
    tile: 15,
    title: 'Puppet Master',
    description: 'Clayman\'s manipulation reduces your attack by 20%!',
    emoji: '🎭',
    color: '#6b7280',
    effect: {
      attackReduction: 20,
    },
    lore: {
      fullTitle: 'Marionette Master Demon Lord',
      role: 'Villain — Stat Debuff',
      powers: ['Marionette Control', 'Telepathy', 'Five Fingers Manipulation'],
      gameplayEffects: ['Reduce Attack by 20%'],
      backstory: 'Clayman is a scheming Demon Lord who preferred manipulation over direct combat. He used his Marionette control abilities to manipulate nations and individuals alike, including attempting to control Milim Nava. His arrogance ultimately led to his downfall at the hands of Rimuru during the Walpurgis Council.',
    },
  },
  {
    name: 'Orc Lord',
    type: 'villain',
    tile: 28,
    title: 'Chaos Eater',
    description: 'The Orc Lord\'s overwhelming force pushes you back! Lose one turn and move backward 10 spaces.',
    emoji: '👹',
    color: '#854d0e',
    effect: {
      loseTurn: true,
      movement: -10,
    },
    lore: {
      fullTitle: 'Orc Disaster — Geld',
      role: 'Villain — Turn Skip + Pushback',
      powers: ['Starved (Chaos Eater)', 'Orc Army Command', 'Self-Evolution', 'Regeneration'],
      gameplayEffects: ['Skip next turn', 'Move backward 10 tiles'],
      backstory: 'The Orc Lord Geld evolved into the Orc Disaster after being driven by the Unique Skill "Starved." Leading an army of 200,000 orcs, he consumed everything in his path, including other monsters. Though originally a noble leader trying to save his starving people, his corruption made him a devastating force.',
    },
  },
  {
    name: 'Jahil',
    type: 'villain',
    tile: 38,
    title: 'Chaotic Sorcerer',
    description: 'Jahil\'s chaotic magic randomly reduces one of your stats!',
    emoji: '🧙',
    color: '#4c1d95',
    effect: {
      randomStatReduction: true,
    },
    lore: {
      fullTitle: 'Demon Sorcerer',
      role: 'Villain — Random Debuff',
      powers: ['Chaotic Magic', 'Demonic Sorcery', 'Curse Manipulation', 'Reality Distortion'],
      gameplayEffects: ['Randomly reduce one stat by 10'],
      backstory: 'Jahil is a chaotic sorcerer whose unpredictable magic affects everything around him. His spells target random aspects of his opponents, making him a dangerous and unpredictable foe. His chaotic nature makes it impossible to predict which of your abilities he will target.',
    },
  },
  {
    name: 'Velzard',
    type: 'villain',
    tile: 50,
    title: 'Ice Dragon',
    description: 'Velzard\'s absolute zero freezes you in place! Skip your next turn.',
    emoji: '❄',
    color: '#bfdbfe',
    effect: {
      skipTurn: true,
    },
    lore: {
      fullTitle: 'White Ice Dragon — True Dragon',
      role: 'Villain — Turn Freeze',
      powers: ['Absolute Zero', 'Ice-Space Manipulation', 'True Dragon Aura', 'Frost King Gabriel'],
      gameplayEffects: ['Skip your next turn'],
      backstory: 'Velzard is one of the four True Dragons and the eldest sister among them. Her mastery over ice and cold is absolute — her Absolute Zero can freeze anything in existence, including time and space. She is Guy Crimson\'s partner and one of the most powerful entities in the Tensura universe.',
    },
  },
  {
    name: 'Feldway',
    type: 'villain',
    tile: 62,
    title: 'Fallen Angel',
    description: 'Feldway\'s divine power teleports you to a random lower tile!',
    emoji: '👼',
    color: '#fef3c7',
    effect: {
      randomTeleportBack: true,
    },
    lore: {
      fullTitle: 'Primordial Angel — Phantom King',
      role: 'Villain — Random Teleport',
      powers: ['Phantom King Mephisto', 'Space-Time Transport', 'Angelic Army Command', 'Divine Energy'],
      gameplayEffects: ['Teleport to random lower tile'],
      backstory: 'Feldway is the first angel created by Veldanava and the leader of all angels. After Veldanava\'s death, Feldway became consumed with the mission to resurrect his creator, willing to destroy the world if necessary. His Phantom King ability allows him to transport and manipulate beings across dimensions.',
    },
  },
  {
    name: 'Michael',
    type: 'villain',
    tile: 78,
    title: 'The Tyrant',
    description: 'Michael\'s Justice Lord removes ALL your buffs and sends you back 20 spaces!',
    emoji: '⚡',
    color: '#fbbf24',
    effect: {
      removeBuff: true,
      movement: -20,
    },
    lore: {
      fullTitle: 'Justice King Michael',
      role: 'Villain — Buff Purge + Major Pushback',
      powers: ['Justice King Michael', 'Armageddon', 'Castle Guard', 'Domination'],
      gameplayEffects: ['Remove ALL active buffs', 'Move backward 20 tiles'],
      backstory: 'Michael is a powerful skill entity that possessed the Archangel of the same name. As Justice King, Michael has the power to dominate and control other beings\' skills and abilities. Combined with the ability to strip all enhancements and push enemies backward, Michael is the most devastating villain encounter on the board.',
    },
  },
]

export const ALL_CHARACTERS = [...HEROES, ...VILLAINS]

export function getCharacterByTile(tile: number): Character | undefined {
  return ALL_CHARACTERS.find(c => c.tile === tile)
}

export function getCharacterByName(name: string): Character | undefined {
  return ALL_CHARACTERS.find(c => c.name === name)
}
