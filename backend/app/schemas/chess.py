"""
Pydantic schemas for Chess API requests and responses.
"""

from pydantic import BaseModel, Field
from typing import Optional


class ChessMoveRequest(BaseModel):
    """Request to get the AI's best move."""
    fen: str = Field(..., description="FEN string of the current board position")
    depth: int = Field(default=4, ge=1, le=10, description="Search depth (1-10)")


class ChessMoveResponse(BaseModel):
    """Response containing the AI's best move and statistics."""
    best_move: str = Field(..., description="Best move in UCI notation")
    best_move_san: Optional[str] = Field(None, description="Best move in SAN notation")
    score: int = Field(..., description="Evaluation score in centipawns")
    depth: int = Field(..., description="Search depth completed")
    nodes_explored: int = Field(..., description="Total nodes explored")
    nodes_pruned: int = Field(..., description="Nodes pruned by alpha-beta")
    search_time_ms: float = Field(..., description="Search time in milliseconds")
    pv_line: list[str] = Field(default_factory=list, description="Principal variation")
    tt_hits: int = Field(default=0, description="Transposition table hits")
    from_book: bool = Field(default=False, description="Whether move came from opening book")
    estimated_minimax_nodes: int = Field(default=0, description="Estimated nodes without pruning")
    pruning_reduction_pct: float = Field(default=0, description="Percentage reduction from pruning")


class ChessAnalyzeRequest(BaseModel):
    """Request to analyze a chess position."""
    fen: str = Field(..., description="FEN string of the position to analyze")
    depth: int = Field(default=4, ge=1, le=10, description="Analysis depth")


class ChessAnalyzeResponse(BaseModel):
    """Response with position analysis."""
    fen: str
    best_move: str
    best_move_san: Optional[str] = None
    score: int
    depth: int
    nodes_explored: int
    nodes_pruned: int
    search_time_ms: float
    is_check: bool
    is_checkmate: bool
    is_stalemate: bool
    is_game_over: bool
    legal_moves: list[str]
    in_book: bool
    pv_line: list[str] = []
    tt_hits: int = 0
    estimated_minimax_nodes: int = 0
    pruning_reduction_pct: float = 0
    from_book: bool = False


class ChessValidateRequest(BaseModel):
    """Request to validate a move."""
    fen: str
    move: str  # UCI notation
