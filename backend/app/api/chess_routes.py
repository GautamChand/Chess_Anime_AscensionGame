"""
Chess API Routes
=================
REST API endpoints for the Chess AI engine.
"""

from fastapi import APIRouter, HTTPException
import chess

from ..schemas.chess import (
    ChessMoveRequest,
    ChessMoveResponse,
    ChessAnalyzeRequest,
    ChessAnalyzeResponse,
    ChessValidateRequest,
)
from ..engine.chess_engine import ChessEngine, analyze_position
from ..engine.opening_book import is_in_book

router = APIRouter(prefix="/api/chess", tags=["Chess"])


@router.post("/move", response_model=ChessMoveResponse)
async def get_best_move(request: ChessMoveRequest):
    """
    Get the AI's best move for a given board position.

    The engine uses iterative deepening with alpha-beta pruning,
    transposition tables, and quiescence search.
    """
    try:
        board = chess.Board(request.fen)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid FEN string")

    if not board.is_valid():
        raise HTTPException(status_code=400, detail="Invalid board position")

    if board.is_game_over():
        raise HTTPException(status_code=400, detail="Game is already over")

    engine = ChessEngine(max_depth=request.depth)
    best_move, stats = engine.get_best_move(board)

    if not best_move:
        raise HTTPException(status_code=500, detail="Engine failed to find a move")

    return ChessMoveResponse(
        best_move=best_move.uci(),
        best_move_san=board.san(best_move),
        score=stats.score,
        depth=stats.depth,
        nodes_explored=stats.nodes_explored,
        nodes_pruned=stats.nodes_pruned,
        search_time_ms=stats.search_time_ms,
        pv_line=stats.pv_line,
        tt_hits=stats.tt_hits,
        from_book=stats.from_book,
        estimated_minimax_nodes=stats.estimated_minimax_nodes,
        pruning_reduction_pct=stats.pruning_reduction_pct,
    )


@router.post("/analyze", response_model=ChessAnalyzeResponse)
async def analyze(request: ChessAnalyzeRequest):
    """
    Analyze a chess position and return detailed evaluation.
    """
    try:
        result = analyze_position(request.fen, request.depth)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return ChessAnalyzeResponse(**result)


@router.post("/validate")
async def validate_move(request: ChessValidateRequest):
    """
    Validate whether a move is legal in the given position.
    """
    try:
        board = chess.Board(request.fen)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid FEN string")

    try:
        move = chess.Move.from_uci(request.move)
    except ValueError:
        return {"valid": False, "reason": "Invalid move notation"}

    is_legal = move in board.legal_moves
    result = {
        "valid": is_legal,
        "move_uci": request.move,
    }

    if is_legal:
        result["move_san"] = board.san(move)
        board.push(move)
        result["resulting_fen"] = board.fen()
        result["is_check"] = board.is_check()
        result["is_checkmate"] = board.is_checkmate()
        result["is_stalemate"] = board.is_stalemate()
        result["is_game_over"] = board.is_game_over()
    else:
        result["reason"] = "Illegal move"
        result["legal_moves"] = [m.uci() for m in board.legal_moves]

    return result


@router.get("/opening-book/{fen:path}")
async def check_opening_book(fen: str):
    """
    Check if a position is in the opening book.
    """
    try:
        board = chess.Board(fen)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid FEN string")

    return {
        "in_book": is_in_book(board),
        "fen": fen,
    }
