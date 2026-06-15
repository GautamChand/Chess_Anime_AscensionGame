"""
Transposition Table for Chess AI
=================================
Uses Zobrist hashing to cache previously evaluated positions,
avoiding redundant computation in the search tree.
"""

import chess
import random
from dataclasses import dataclass
from enum import IntEnum
from typing import Optional


class TTFlag(IntEnum):
    """Transposition table entry flags."""
    EXACT = 0    # Exact score
    ALPHA = 1    # Upper bound (fail-low)
    BETA = 2     # Lower bound (fail-high)


@dataclass
class TTEntry:
    """A single transposition table entry."""
    key: int          # Zobrist hash of the position
    depth: int        # Search depth
    score: int        # Evaluation score
    flag: TTFlag      # Type of score bound
    best_move: Optional[chess.Move]  # Best move found


class TranspositionTable:
    """
    Hash table for storing previously searched positions.
    Uses Zobrist hashing for fast position identification.
    """

    def __init__(self, size: int = 1 << 20):  # Default 1M entries
        self.size = size
        self.table: dict[int, TTEntry] = {}
        self.hits = 0
        self.stores = 0

        # Initialize Zobrist keys
        random.seed(42)  # Deterministic for reproducibility
        self.piece_keys = {}
        for color in [chess.WHITE, chess.BLACK]:
            for piece_type in chess.PIECE_TYPES:
                for square in chess.SQUARES:
                    self.piece_keys[(color, piece_type, square)] = random.getrandbits(64)

        self.side_key = random.getrandbits(64)  # Side to move
        self.castling_keys = [random.getrandbits(64) for _ in range(16)]
        self.ep_keys = [random.getrandbits(64) for _ in range(8)]  # En passant file

    def compute_hash(self, board: chess.Board) -> int:
        """Compute Zobrist hash for a board position."""
        h = 0

        for square in chess.SQUARES:
            piece = board.piece_at(square)
            if piece:
                h ^= self.piece_keys[(piece.color, piece.piece_type, square)]

        if board.turn == chess.BLACK:
            h ^= self.side_key

        # Castling rights
        castling = 0
        if board.has_kingside_castling_rights(chess.WHITE):
            castling |= 1
        if board.has_queenside_castling_rights(chess.WHITE):
            castling |= 2
        if board.has_kingside_castling_rights(chess.BLACK):
            castling |= 4
        if board.has_queenside_castling_rights(chess.BLACK):
            castling |= 8
        h ^= self.castling_keys[castling]

        # En passant
        if board.ep_square is not None:
            h ^= self.ep_keys[chess.square_file(board.ep_square)]

        return h

    def lookup(self, board: chess.Board, depth: int, alpha: int, beta: int) -> Optional[tuple[int, Optional[chess.Move]]]:
        """
        Look up a position in the transposition table.
        Returns (score, best_move) if a valid entry is found, None otherwise.
        """
        key = self.compute_hash(board)
        entry = self.table.get(key)

        if entry is None or entry.key != key:
            return None

        if entry.depth < depth:
            # Return the best move hint even if depth is insufficient
            return None

        self.hits += 1

        if entry.flag == TTFlag.EXACT:
            return (entry.score, entry.best_move)
        elif entry.flag == TTFlag.ALPHA and entry.score <= alpha:
            return (alpha, entry.best_move)
        elif entry.flag == TTFlag.BETA and entry.score >= beta:
            return (beta, entry.best_move)

        return None

    def get_best_move(self, board: chess.Board) -> Optional[chess.Move]:
        """Get the best move from the transposition table without score."""
        key = self.compute_hash(board)
        entry = self.table.get(key)
        if entry and entry.key == key:
            return entry.best_move
        return None

    def store(self, board: chess.Board, depth: int, score: int, flag: TTFlag, best_move: Optional[chess.Move] = None):
        """Store a position in the transposition table."""
        key = self.compute_hash(board)

        # Replace if new entry has greater or equal depth
        existing = self.table.get(key)
        if existing and existing.depth > depth and existing.key == key:
            return

        self.table[key] = TTEntry(
            key=key,
            depth=depth,
            score=score,
            flag=flag,
            best_move=best_move,
        )
        self.stores += 1

        # Evict old entries if table is too large
        if len(self.table) > self.size:
            # Remove oldest entries (simple strategy)
            keys_to_remove = list(self.table.keys())[:self.size // 4]
            for k in keys_to_remove:
                del self.table[k]

    def clear(self):
        """Clear the transposition table."""
        self.table.clear()
        self.hits = 0
        self.stores = 0

    @property
    def usage(self) -> float:
        """Return table usage as a percentage."""
        return (len(self.table) / self.size) * 100
