"""
Quiescence Search for Chess AI
================================
Extends the search at leaf nodes by examining capture sequences
to avoid the horizon effect (missing a capture right after search depth ends).
"""

import chess
from .evaluation import evaluate_board


def quiescence_search(
    board: chess.Board,
    alpha: int,
    beta: int,
    stats: dict,
    max_depth: int = 8,
    depth: int = 0,
) -> int:
    """
    Quiescence search: continue searching captures/checks at leaf nodes
    until the position is "quiet" (no more captures available).

    Args:
        board: Current board position
        alpha: Alpha bound
        beta: Beta bound
        stats: Dictionary to track nodes explored
        max_depth: Maximum quiescence depth
        depth: Current quiescence depth

    Returns:
        Evaluation score in centipawns from the side to move's perspective
    """
    stats["nodes"] += 1

    # Stand-pat: evaluate the current position
    stand_pat = evaluate_board(board)
    if board.turn == chess.BLACK:
        stand_pat = -stand_pat

    # Beta cutoff
    if stand_pat >= beta:
        return beta

    # Update alpha
    if stand_pat > alpha:
        alpha = stand_pat

    # Maximum quiescence depth reached
    if depth >= max_depth:
        return alpha

    # Generate and search capture moves only
    capture_moves = []
    for move in board.legal_moves:
        if board.is_capture(move):
            capture_moves.append(move)

    # Sort captures by MVV-LVA (Most Valuable Victim - Least Valuable Attacker)
    capture_moves.sort(key=lambda m: _mvv_lva_score(board, m), reverse=True)

    for move in capture_moves:
        # Delta pruning: skip captures that can't possibly raise alpha
        if not board.is_en_passant(move):
            captured = board.piece_at(move.to_square)
            if captured:
                from .evaluation import PIECE_VALUES
                delta = stand_pat + PIECE_VALUES.get(captured.piece_type, 0) + 200
                if delta < alpha:
                    continue

        board.push(move)
        score = -quiescence_search(board, -beta, -alpha, stats, max_depth, depth + 1)
        board.pop()

        if score >= beta:
            stats["pruned"] += 1
            return beta

        if score > alpha:
            alpha = score

    return alpha


def _mvv_lva_score(board: chess.Board, move: chess.Move) -> int:
    """
    Score a capture move using MVV-LVA (Most Valuable Victim - Least Valuable Attacker).
    Higher scores indicate more promising captures.
    """
    from .evaluation import PIECE_VALUES

    victim_value = 0
    attacker_value = 0

    # Victim
    if board.is_en_passant(move):
        victim_value = PIECE_VALUES[chess.PAWN]
    else:
        captured = board.piece_at(move.to_square)
        if captured:
            victim_value = PIECE_VALUES.get(captured.piece_type, 0)

    # Attacker
    attacker = board.piece_at(move.from_square)
    if attacker:
        attacker_value = PIECE_VALUES.get(attacker.piece_type, 0)

    return victim_value * 10 - attacker_value
