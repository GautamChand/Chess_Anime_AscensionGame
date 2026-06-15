"""
Chess AI Engine
================
Core search engine implementing:
- Minimax Algorithm
- Alpha-Beta Pruning
- Iterative Deepening Search
- Depth-Limited Search
- Move Ordering Heuristics
- Transposition Tables
- Quiescence Search
- Opening Book

Provides real-time statistics for educational/analytical purposes.
"""

import chess
import time
from typing import Optional
from dataclasses import dataclass, field

from .evaluation import evaluate_board, PIECE_VALUES
from .transposition import TranspositionTable, TTFlag
from .quiescence import quiescence_search
from .opening_book import get_book_move, is_in_book


@dataclass
class SearchStats:
    """Statistics from a search operation."""
    depth: int = 0
    score: int = 0
    nodes_explored: int = 0
    nodes_pruned: int = 0
    search_time_ms: float = 0
    best_move: str = ""
    pv_line: list[str] = field(default_factory=list)
    tt_hits: int = 0
    from_book: bool = False

    # For comparison display
    estimated_minimax_nodes: int = 0  # O(b^d) without pruning
    pruning_reduction_pct: float = 0

    def to_dict(self) -> dict:
        return {
            "depth": self.depth,
            "score": self.score,
            "nodes_explored": self.nodes_explored,
            "nodes_pruned": self.nodes_pruned,
            "search_time_ms": round(self.search_time_ms, 1),
            "best_move": self.best_move,
            "pv_line": self.pv_line,
            "tt_hits": self.tt_hits,
            "from_book": self.from_book,
            "estimated_minimax_nodes": self.estimated_minimax_nodes,
            "pruning_reduction_pct": round(self.pruning_reduction_pct, 1),
        }


class ChessEngine:
    """
    Chess AI engine with configurable search depth and multiple algorithms.

    Usage:
        engine = ChessEngine(max_depth=4)
        move, stats = engine.get_best_move(board)
    """

    def __init__(self, max_depth: int = 4):
        self.max_depth = max_depth
        self.tt = TranspositionTable()
        self.killer_moves: dict[int, list[chess.Move]] = {}  # depth -> [killer1, killer2]
        self.history_table: dict[tuple[int, int], int] = {}  # (from, to) -> score
        self._abort = False

    def get_best_move(self, board: chess.Board) -> tuple[Optional[chess.Move], SearchStats]:
        """
        Get the best move for the current position using iterative deepening
        with alpha-beta pruning.

        Args:
            board: Current board state

        Returns:
            Tuple of (best_move, search_statistics)
        """
        stats = SearchStats()
        self._abort = False

        # Check opening book first
        book_move = get_book_move(board)
        if book_move:
            stats.best_move = book_move.uci()
            stats.from_book = True
            stats.score = 0
            return book_move, stats

        start_time = time.time()
        best_move = None
        best_score = float("-inf")

        # Iterative deepening
        for depth in range(1, self.max_depth + 1):
            if self._abort:
                break

            self.killer_moves.clear()
            search_stats = {"nodes": 0, "pruned": 0}

            current_best_move = None
            current_best_score = float("-inf")
            alpha = float("-inf")
            beta = float("inf")

            # Generate and order moves
            moves = self._order_moves(board, depth)

            for move in moves:
                board.push(move)
                score = -self._alpha_beta(
                    board, depth - 1, -beta, -alpha, False, search_stats
                )
                board.pop()

                if score > current_best_score:
                    current_best_score = score
                    current_best_move = move

                alpha = max(alpha, score)

            if current_best_move:
                best_move = current_best_move
                best_score = current_best_score

            stats.depth = depth
            stats.score = int(best_score) if best_score != float("-inf") else 0
            stats.nodes_explored = search_stats["nodes"]
            stats.nodes_pruned = search_stats["pruned"]
            stats.tt_hits = self.tt.hits

        elapsed = (time.time() - start_time) * 1000
        stats.search_time_ms = elapsed

        if best_move:
            stats.best_move = best_move.uci()
            # Extract PV line from transposition table
            stats.pv_line = self._extract_pv(board, self.max_depth)

        # Compute comparison metrics
        avg_branching = 35  # Average branching factor in chess
        stats.estimated_minimax_nodes = avg_branching ** self.max_depth
        if stats.estimated_minimax_nodes > 0 and stats.nodes_explored > 0:
            stats.pruning_reduction_pct = (
                1 - stats.nodes_explored / stats.estimated_minimax_nodes
            ) * 100
        else:
            stats.pruning_reduction_pct = 0

        return best_move, stats

    def _alpha_beta(
        self,
        board: chess.Board,
        depth: int,
        alpha: int,
        beta: int,
        is_maximizing: bool,
        stats: dict,
    ) -> int:
        """
        Alpha-Beta pruning with Minimax.

        Args:
            board: Current board state
            depth: Remaining search depth
            alpha: Alpha bound
            beta: Beta bound
            is_maximizing: Whether this is a maximizing node
            stats: Statistics dictionary

        Returns:
            Evaluation score
        """
        stats["nodes"] += 1

        # Check transposition table
        tt_result = self.tt.lookup(board, depth, alpha, beta)
        if tt_result is not None:
            return tt_result[0]

        # Terminal node checks
        if board.is_checkmate():
            return -99999 - depth  # Prefer faster checkmates

        if board.is_stalemate() or board.is_insufficient_material() or board.is_repetition():
            return 0

        if board.is_fifty_moves():
            return 0

        # Leaf node: use quiescence search
        if depth <= 0:
            return quiescence_search(board, alpha, beta, stats)

        # Null move pruning (when not in check)
        if depth >= 3 and not board.is_check():
            board.push(chess.Move.null())
            null_score = -self._alpha_beta(
                board, depth - 3, -beta, -beta + 1, not is_maximizing, stats
            )
            board.pop()
            if null_score >= beta:
                stats["pruned"] += 1
                return beta

        best_score = float("-inf")
        best_move = None
        original_alpha = alpha

        # Generate and order moves
        moves = self._order_moves(board, depth)

        for i, move in enumerate(moves):
            board.push(move)

            # Late Move Reductions (LMR)
            if i >= 4 and depth >= 3 and not board.is_check() and not board.is_capture(move):
                # Search with reduced depth first
                score = -self._alpha_beta(
                    board, depth - 2, -alpha - 1, -alpha, not is_maximizing, stats
                )
                if score <= alpha:
                    board.pop()
                    continue
                # If it exceeds alpha, re-search at full depth

            score = -self._alpha_beta(
                board, depth - 1, -beta, -alpha, not is_maximizing, stats
            )
            board.pop()

            if score > best_score:
                best_score = score
                best_move = move

            alpha = max(alpha, score)

            if alpha >= beta:
                stats["pruned"] += 1

                # Update killer moves
                if not board.is_capture(move):
                    if depth not in self.killer_moves:
                        self.killer_moves[depth] = []
                    killers = self.killer_moves[depth]
                    if move not in killers:
                        killers.insert(0, move)
                        if len(killers) > 2:
                            killers.pop()

                    # Update history table
                    key = (move.from_square, move.to_square)
                    self.history_table[key] = self.history_table.get(key, 0) + depth * depth

                break

        # Store in transposition table
        if best_score <= original_alpha:
            flag = TTFlag.ALPHA
        elif best_score >= beta:
            flag = TTFlag.BETA
        else:
            flag = TTFlag.EXACT

        self.tt.store(board, depth, int(best_score) if best_score != float("-inf") else 0, flag, best_move)

        return best_score

    def _order_moves(self, board: chess.Board, depth: int) -> list[chess.Move]:
        """
        Order moves for better alpha-beta pruning efficiency.

        Priority:
        1. PV move from transposition table
        2. Winning captures (MVV-LVA)
        3. Killer moves
        4. History heuristic
        5. Quiet moves
        """
        moves = list(board.legal_moves)
        scored_moves = []

        # Get TT best move
        tt_move = self.tt.get_best_move(board)

        for move in moves:
            score = 0

            # Highest priority: TT move
            if tt_move and move == tt_move:
                score += 10000000
            # Captures: MVV-LVA scoring
            elif board.is_capture(move):
                victim = board.piece_at(move.to_square)
                attacker = board.piece_at(move.from_square)
                if victim and attacker:
                    victim_val = PIECE_VALUES.get(victim.piece_type, 0)
                    attacker_val = PIECE_VALUES.get(attacker.piece_type, 0)
                    score += 1000000 + victim_val * 10 - attacker_val
                elif board.is_en_passant(move):
                    score += 1000000 + 100 * 10 - 100
            # Promotions
            elif move.promotion:
                score += 900000 + PIECE_VALUES.get(move.promotion, 0)
            # Killer moves
            elif depth in self.killer_moves and move in self.killer_moves[depth]:
                score += 500000
            # Checks
            elif board.gives_check(move):
                score += 400000
            # History heuristic
            else:
                key = (move.from_square, move.to_square)
                score += self.history_table.get(key, 0)

            scored_moves.append((score, move))

        scored_moves.sort(key=lambda x: x[0], reverse=True)
        return [m for _, m in scored_moves]

    def _extract_pv(self, board: chess.Board, max_depth: int) -> list[str]:
        """Extract the Principal Variation from the transposition table."""
        pv = []
        board_copy = board.copy()

        for _ in range(max_depth):
            tt_move = self.tt.get_best_move(board_copy)
            if tt_move and tt_move in board_copy.legal_moves:
                pv.append(tt_move.uci())
                board_copy.push(tt_move)
            else:
                break

        return pv

    def set_depth(self, depth: int):
        """Set the maximum search depth."""
        self.max_depth = max(1, min(depth, 10))

    def clear_tables(self):
        """Clear transposition table and history data."""
        self.tt.clear()
        self.killer_moves.clear()
        self.history_table.clear()

    def abort(self):
        """Abort the current search."""
        self._abort = True


# ============================================================
# Convenience functions for the API
# ============================================================

def analyze_position(fen: str, depth: int = 4) -> dict:
    """
    Analyze a chess position given in FEN notation.

    Args:
        fen: FEN string of the position
        depth: Search depth

    Returns:
        Dictionary with best move and analysis stats
    """
    board = chess.Board(fen)

    if not board.is_valid():
        return {"error": "Invalid FEN position"}

    engine = ChessEngine(max_depth=depth)
    best_move, stats = engine.get_best_move(board)

    result = stats.to_dict()
    result["fen"] = fen
    result["is_check"] = board.is_check()
    result["is_checkmate"] = board.is_checkmate()
    result["is_stalemate"] = board.is_stalemate()
    result["is_game_over"] = board.is_game_over()
    result["legal_moves"] = [m.uci() for m in board.legal_moves]
    result["in_book"] = is_in_book(board)

    if best_move:
        # Also provide SAN notation
        result["best_move_san"] = board.san(best_move)

    return result
