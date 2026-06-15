"""
Opening Book for Chess AI
==========================
Small built-in opening book with common chess openings.
Returns known good moves for popular opening positions.
"""

import chess
import random
from typing import Optional


# Opening book stored as FEN -> list of good moves (in UCI notation)
# Each entry is a list of (move_uci, weight) tuples
OPENING_BOOK: dict[str, list[tuple[str, int]]] = {
    # Starting position
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": [
        ("e2e4", 40), ("d2d4", 35), ("c2c4", 15), ("g1f3", 10),
    ],

    # === KING'S PAWN (1. e4) ===
    # After 1. e4
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq -": [
        ("e7e5", 30), ("c7c5", 35), ("e7e6", 15), ("c7c6", 10), ("d7d5", 10),
    ],

    # Sicilian Defense: 1. e4 c5
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": [
        ("g1f3", 60), ("b1c3", 20), ("c2c3", 10), ("d2d4", 10),
    ],
    # Sicilian: 1. e4 c5 2. Nf3
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": [
        ("d7d6", 35), ("b8c6", 30), ("e7e6", 25), ("g7g6", 10),
    ],

    # Italian Game: 1. e4 e5 2. Nf3 Nc6
    "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": [
        ("f1c4", 40), ("f1b5", 35), ("d2d4", 15), ("b1c3", 10),
    ],
    # Italian: 1. e4 e5 2. Nf3 Nc6 3. Bc4
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": [
        ("g8f6", 35), ("f8c5", 40), ("f8e7", 15), ("d7d6", 10),
    ],

    # Ruy Lopez: 1. e4 e5 2. Nf3 Nc6 3. Bb5
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": [
        ("a7a6", 45), ("g8f6", 30), ("f8c5", 15), ("d7d6", 10),
    ],

    # After 1. e4 e5
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": [
        ("g1f3", 60), ("f1c4", 15), ("b1c3", 10), ("d2d4", 10), ("f2f4", 5),
    ],

    # After 1. e4 e5 2. Nf3
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": [
        ("b8c6", 55), ("g8f6", 25), ("d7d6", 10), ("f7f5", 5), ("d7d5", 5),
    ],

    # === QUEEN'S PAWN (1. d4) ===
    # After 1. d4
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq -": [
        ("d7d5", 35), ("g8f6", 40), ("e7e6", 10), ("f7f5", 5), ("c7c5", 10),
    ],

    # Queen's Gambit: 1. d4 d5 2. c4
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq -": [
        ("e7e6", 35), ("c7c6", 30), ("d5c4", 25), ("e7e5", 5), ("g8f6", 5),
    ],

    # King's Indian: 1. d4 Nf6 2. c4
    "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq -": [
        ("g7g6", 35), ("e7e6", 30), ("c7c5", 15), ("d7d5", 15), ("e7e5", 5),
    ],

    # After 1. d4 d5
    "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq -": [
        ("c2c4", 50), ("g1f3", 25), ("b1c3", 10), ("c2c3", 10), ("e2e3", 5),
    ],

    # After 1. d4 Nf6
    "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq -": [
        ("c2c4", 50), ("g1f3", 25), ("b1c3", 10), ("c2c3", 5), ("e2e3", 5), ("f1g5", 5),
    ],

    # === ENGLISH (1. c4) ===
    "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq -": [
        ("e7e5", 30), ("g8f6", 30), ("c7c5", 20), ("e7e6", 10), ("g7g6", 10),
    ],

    # === RETI (1. Nf3) ===
    "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq -": [
        ("d7d5", 35), ("g8f6", 30), ("c7c5", 15), ("d7d6", 10), ("g7g6", 10),
    ],

    # French Defense: 1. e4 e6
    "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": [
        ("d2d4", 55), ("d2d3", 15), ("g1f3", 15), ("b1c3", 10), ("g2g3", 5),
    ],

    # Caro-Kann: 1. e4 c6
    "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": [
        ("d2d4", 50), ("b1c3", 20), ("g1f3", 15), ("c2c4", 10), ("d2d3", 5),
    ],

    # Scandinavian: 1. e4 d5
    "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": [
        ("e4d5", 60), ("b1c3", 20), ("e4e5", 15), ("g1f3", 5),
    ],
}


def normalize_fen_for_book(fen: str) -> str:
    """
    Normalize FEN for book lookup by removing move counters.
    We keep position, active color, castling, and en passant.
    """
    parts = fen.split()
    if len(parts) >= 4:
        return " ".join(parts[:4])
    return fen


def get_book_move(board: chess.Board) -> Optional[chess.Move]:
    """
    Look up the current position in the opening book.
    Returns a weighted random move from known good moves, or None.
    """
    fen = normalize_fen_for_book(board.fen())

    if fen not in OPENING_BOOK:
        return None

    entries = OPENING_BOOK[fen]

    # Filter to only legal moves
    legal_entries = []
    for move_uci, weight in entries:
        try:
            move = chess.Move.from_uci(move_uci)
            if move in board.legal_moves:
                legal_entries.append((move, weight))
        except (ValueError, chess.InvalidMoveError):
            continue

    if not legal_entries:
        return None

    # Weighted random selection
    moves, weights = zip(*legal_entries)
    total = sum(weights)
    probabilities = [w / total for w in weights]
    chosen = random.choices(moves, weights=probabilities, k=1)[0]

    return chosen


def is_in_book(board: chess.Board) -> bool:
    """Check if the current position is in the opening book."""
    fen = normalize_fen_for_book(board.fen())
    return fen in OPENING_BOOK
