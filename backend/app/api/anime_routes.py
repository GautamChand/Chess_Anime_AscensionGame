"""
Anime Ascension Board Game API Routes
=======================================
REST API endpoints for the Anime Ascension board game AI.
"""

from fastapi import APIRouter, HTTPException

from ..schemas.anime import AnimeAIRequest, AnimeAIResponse, AnimePlayerState
from ..engine.anime_ai import (
    PlayerState,
    get_ai_analysis,
    HERO_TILES,
    VILLAIN_TILES,
    EVENT_TILES,
)

router = APIRouter(prefix="/api/anime", tags=["Anime Ascension"])


def _convert_player(p: AnimePlayerState) -> PlayerState:
    """Convert API player state to engine player state."""
    return PlayerState(
        position=p.position,
        health=p.health,
        attack=p.attack,
        defense=p.defense,
        magic=p.magic,
        speed=p.speed,
        collected_heroes=list(p.collected_heroes),
        active_buffs=[dict(b) for b in p.active_buffs],
        skip_turn=p.skip_turn,
        double_movement_turns=p.double_movement_turns,
        immunity=p.immunity,
        double_attack=p.double_attack,
        lucky_survivor=p.lucky_survivor,
    )


@router.post("/ai-decision", response_model=AnimeAIResponse)
async def get_ai_decision(request: AnimeAIRequest):
    """
    Get AI analysis and strategic recommendations for the current game state.
    """
    player = _convert_player(request.player)
    opponent = _convert_player(request.opponent)

    try:
        analysis = get_ai_analysis(player, opponent, request.depth)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return AnimeAIResponse(**analysis)


@router.get("/board-info")
async def get_board_info():
    """
    Get complete board information including all special tiles.
    """
    return {
        "board_size": 100,
        "hero_tiles": {str(k): v for k, v in HERO_TILES.items()},
        "villain_tiles": {str(k): v for k, v in VILLAIN_TILES.items()},
        "event_tiles": {str(k): v for k, v in EVENT_TILES.items()},
        "boss_zone": list(range(95, 101)),
    }
