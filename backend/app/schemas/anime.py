"""
Pydantic schemas for Anime Ascension Board Game API.
"""

from pydantic import BaseModel, Field
from typing import Optional


class AnimePlayerState(BaseModel):
    """Player state for the board game."""
    position: int = Field(default=1, ge=1, le=100)
    health: int = Field(default=100)
    attack: int = Field(default=10)
    defense: int = Field(default=10)
    magic: int = Field(default=10)
    speed: int = Field(default=10)
    collected_heroes: list[str] = Field(default_factory=list)
    active_buffs: list[dict] = Field(default_factory=list)
    skip_turn: bool = False
    double_movement_turns: int = 0
    immunity: bool = False
    double_attack: bool = False
    lucky_survivor: bool = False


class AnimeAIRequest(BaseModel):
    """Request for AI analysis of the board game state."""
    player: AnimePlayerState
    opponent: AnimePlayerState
    depth: int = Field(default=3, ge=1, le=5)


class AnimeAIResponse(BaseModel):
    """AI analysis response."""
    position_score: float
    expected_value: float
    strategy: str
    tile_analysis: list[dict]
    needed_heroes: list[str]
    boss_ready: bool
    risk_level: str
