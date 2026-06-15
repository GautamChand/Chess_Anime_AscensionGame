"""
Anime Ascension Board Game AI
===============================
Strategic AI opponent using Expectimax for probabilistic decision-making.

Features:
- Expectimax for dice-based probabilistic analysis
- Risk/reward evaluation of tile positions
- Priority system for collecting required allies
- Villain avoidance strategies
- Boss requirement tracking
- Expected utility calculations
"""

import random
from typing import Optional
from dataclasses import dataclass, field


# ============================================================
# GAME CONSTANTS
# ============================================================

BOARD_SIZE = 100
DICE_MIN = 1
DICE_MAX = 6

# Hero tiles: {tile_number: hero_name}
HERO_TILES = {
    8: "Rimuru Tempest",
    18: "Gobta",
    25: "Benimaru",
    33: "Shion",
    42: "Veldora",
    55: "Diablo",
    68: "Guy Crimson",
    82: "Milim Nava",
}

# Villain tiles: {tile_number: villain_name}
VILLAIN_TILES = {
    15: "Clayman",
    28: "Orc Lord",
    38: "Jahil",
    50: "Velzard",
    62: "Feldway",
    78: "Michael",
}

# Special event tiles
EVENT_TILES = {
    12: "Great Sage Guidance",
    22: "Dragon's Blessing",
    35: "Harvest Festival",
    45: "Labyrinth Challenge",
    58: "Empire Invasion",
    72: "Demon Lord Awakening",
}

# Boss zone
BOSS_ZONE = range(95, 101)


@dataclass
class PlayerState:
    """Represents a player's current state in the game."""
    position: int = 1
    health: int = 100
    attack: int = 10
    defense: int = 10
    magic: int = 10
    speed: int = 10
    collected_heroes: list[str] = field(default_factory=list)
    active_buffs: list[dict] = field(default_factory=list)
    skip_turn: bool = False
    double_movement_turns: int = 0
    immunity: bool = False
    double_attack: bool = False
    lucky_survivor: bool = False

    def has_boss_requirements(self) -> bool:
        """Check if player can challenge Veldanava."""
        has_rimuru = "Rimuru Tempest" in self.collected_heroes
        has_ally = any(
            h in self.collected_heroes
            for h in ["Diablo", "Guy Crimson", "Veldora", "Milim Nava"]
        )
        return has_rimuru and has_ally

    def clone(self) -> "PlayerState":
        """Create a deep copy of this state."""
        p = PlayerState(
            position=self.position,
            health=self.health,
            attack=self.attack,
            defense=self.defense,
            magic=self.magic,
            speed=self.speed,
            collected_heroes=list(self.collected_heroes),
            active_buffs=[dict(b) for b in self.active_buffs],
            skip_turn=self.skip_turn,
            double_movement_turns=self.double_movement_turns,
            immunity=self.immunity,
            double_attack=self.double_attack,
            lucky_survivor=self.lucky_survivor,
        )
        return p


def evaluate_tile(tile: int, player: PlayerState) -> float:
    """
    Evaluate the desirability of landing on a particular tile.
    Returns a score where higher is better.
    """
    score = 0.0

    # Base progress score — moving forward is generally good
    score += tile * 0.5

    # Hero tile bonuses
    if tile in HERO_TILES:
        hero = HERO_TILES[tile]
        if hero not in player.collected_heroes:
            score += 50  # High value for uncollected heroes

            # Extra value for boss requirement heroes
            if hero == "Rimuru Tempest":
                if "Rimuru Tempest" not in player.collected_heroes:
                    score += 100  # Critical for boss fight
            elif hero in ["Diablo", "Guy Crimson", "Veldora", "Milim Nava"]:
                if not player.has_boss_requirements():
                    score += 80  # Very important for boss requirements
            elif hero == "Milim Nava":
                score += 40  # Teleport 15 is very powerful
            elif hero == "Gobta":
                score += 20  # Lucky survivor is useful
        else:
            score += 5  # Already collected, smaller bonus

    # Villain tile penalties
    if tile in VILLAIN_TILES:
        villain = VILLAIN_TILES[tile]
        if player.immunity:
            score += 10  # Immunity negates villain effect
        else:
            if villain == "Michael":
                score -= 80  # Worst villain: removes all buffs + move back 20
            elif villain == "Feldway":
                score -= 60  # Random teleport backward
            elif villain == "Orc Lord":
                score -= 40  # Lose turn + move back 10
            elif villain == "Velzard":
                score -= 35  # Skip turn
            elif villain == "Clayman":
                score -= 25  # Reduce attack
            elif villain == "Jahil":
                score -= 30  # Random stat reduction

    # Event tile evaluation
    if tile in EVENT_TILES:
        score += 15  # Events are generally beneficial

    # Boss zone evaluation
    if tile in BOSS_ZONE:
        if player.has_boss_requirements():
            score += 200  # Can win!
        else:
            score -= 100  # Will be sent back to tile 70

    # Proximity to hero tiles bonus
    for hero_tile in HERO_TILES:
        if hero_tile > tile and HERO_TILES[hero_tile] not in player.collected_heroes:
            distance = hero_tile - tile
            if distance <= 6:  # Reachable in one roll
                score += 10

    return score


def expectimax_evaluate(
    player: PlayerState,
    opponent: PlayerState,
    depth: int,
    is_chance_node: bool = True,
) -> float:
    """
    Expectimax evaluation for the board game.

    For chance nodes (dice roll), compute expected value across all outcomes.
    For decision nodes, pick the best available action.
    """
    if depth <= 0 or player.position >= BOARD_SIZE:
        return evaluate_position(player, opponent)

    if player.skip_turn:
        # Must skip — evaluate opponent's turn
        return -expectimax_evaluate(opponent, player, depth - 1, True)

    if is_chance_node:
        # Chance node: average over all dice outcomes (1-6)
        expected_value = 0.0
        for dice in range(DICE_MIN, DICE_MAX + 1):
            new_pos = min(player.position + dice, BOARD_SIZE)

            # Apply double movement if active
            if player.double_movement_turns > 0:
                new_pos = min(player.position + dice * 2, BOARD_SIZE)

            sim_player = player.clone()
            sim_player.position = new_pos

            tile_score = evaluate_tile(new_pos, sim_player)
            expected_value += (tile_score + expectimax_evaluate(
                sim_player, opponent, depth - 1, False
            )) / 6.0

        return expected_value
    else:
        # Decision node — in this game, decisions are limited
        # (dice-based, so mainly we evaluate the position)
        return evaluate_position(player, opponent)


def evaluate_position(player: PlayerState, opponent: PlayerState) -> float:
    """
    Evaluate the overall game position from the player's perspective.
    """
    score = 0.0

    # Position progress
    score += player.position * 2.0
    score -= opponent.position * 1.5

    # Stats evaluation
    score += player.attack * 0.5
    score += player.defense * 0.3
    score += player.magic * 0.3
    score += player.speed * 0.2
    score += player.health * 0.1

    # Hero collection value
    score += len(player.collected_heroes) * 20

    # Boss readiness bonus
    if player.has_boss_requirements():
        score += 150
        # Extra bonus if close to boss zone
        if player.position >= 80:
            score += 100
    elif "Rimuru Tempest" in player.collected_heroes:
        score += 50  # Halfway to boss requirements

    # Active buff value
    score += len(player.active_buffs) * 10
    if player.immunity:
        score += 30
    if player.double_attack:
        score += 25
    if player.double_movement_turns > 0:
        score += 20 * player.double_movement_turns
    if player.lucky_survivor:
        score += 15

    # Penalize opponent's advantages
    score -= len(opponent.collected_heroes) * 15
    if opponent.has_boss_requirements():
        score -= 100

    return score


def get_ai_analysis(
    player: PlayerState,
    opponent: PlayerState,
    depth: int = 3,
) -> dict:
    """
    Get AI analysis for the current game state.

    Returns strategic recommendations and position evaluation.
    """
    # Evaluate current position
    position_score = evaluate_position(player, opponent)

    # Analyze upcoming tiles (next 6 positions)
    tile_analysis = []
    for dice in range(DICE_MIN, DICE_MAX + 1):
        new_pos = min(player.position + dice, BOARD_SIZE)
        if player.double_movement_turns > 0:
            new_pos = min(player.position + dice * 2, BOARD_SIZE)

        tile_score = evaluate_tile(new_pos, player)
        tile_type = "normal"
        tile_name = f"Tile {new_pos}"

        if new_pos in HERO_TILES:
            tile_type = "hero"
            tile_name = HERO_TILES[new_pos]
        elif new_pos in VILLAIN_TILES:
            tile_type = "villain"
            tile_name = VILLAIN_TILES[new_pos]
        elif new_pos in EVENT_TILES:
            tile_type = "event"
            tile_name = EVENT_TILES[new_pos]
        elif new_pos in BOSS_ZONE:
            tile_type = "boss"
            tile_name = "Veldanava's Domain"

        tile_analysis.append({
            "dice_value": dice,
            "position": new_pos,
            "tile_type": tile_type,
            "tile_name": tile_name,
            "score": round(tile_score, 1),
        })

    # Determine strategy
    strategy = _determine_strategy(player, opponent)

    # Expectimax evaluation
    expected_value = expectimax_evaluate(player, opponent, depth)

    # Needed heroes for boss fight
    needed_heroes = []
    if "Rimuru Tempest" not in player.collected_heroes:
        needed_heroes.append("Rimuru Tempest")
    if not any(h in player.collected_heroes for h in ["Diablo", "Guy Crimson", "Veldora", "Milim Nava"]):
        needed_heroes.extend(["Diablo", "Guy Crimson", "Veldora", "Milim Nava"])

    return {
        "position_score": round(position_score, 1),
        "expected_value": round(expected_value, 1),
        "strategy": strategy,
        "tile_analysis": tile_analysis,
        "needed_heroes": needed_heroes,
        "boss_ready": player.has_boss_requirements(),
        "risk_level": _assess_risk(player),
    }


def _determine_strategy(player: PlayerState, opponent: PlayerState) -> str:
    """Determine the current strategic priority."""
    if player.has_boss_requirements() and player.position >= 80:
        return "RUSH_BOSS"
    elif not player.has_boss_requirements() and player.position >= 70:
        return "COLLECT_HEROES"
    elif "Rimuru Tempest" not in player.collected_heroes:
        return "FIND_RIMURU"
    elif opponent.position > player.position + 20:
        return "CATCH_UP"
    elif len(player.active_buffs) == 0:
        return "BUILD_POWER"
    else:
        return "ADVANCE"


def _assess_risk(player: PlayerState) -> str:
    """Assess the current risk level based on nearby villain tiles."""
    risk_count = 0
    for dice in range(DICE_MIN, DICE_MAX + 1):
        new_pos = min(player.position + dice, BOARD_SIZE)
        if new_pos in VILLAIN_TILES and not player.immunity:
            risk_count += 1

    if risk_count >= 3:
        return "HIGH"
    elif risk_count >= 1:
        return "MEDIUM"
    else:
        return "LOW"
