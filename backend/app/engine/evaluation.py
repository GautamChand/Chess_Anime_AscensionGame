"""
Heuristic Evaluation Function for Chess AI
==========================================
Evaluates board positions using multiple factors:
- Material advantage (standard piece values)
- Piece-square tables (positional scoring)
- King safety (castling, pawn shield, open files)
- Mobility (legal moves, center control)
- Piece activity scoring
"""

import chess
import numpy as np

# ============================================================
# PIECE VALUES (centipawns)
# ============================================================
PIECE_VALUES = {
    chess.PAWN: 100,
    chess.KNIGHT: 320,
    chess.BISHOP: 330,
    chess.ROOK: 500,
    chess.QUEEN: 900,
    chess.KING: 20000,
}

# ============================================================
# PIECE-SQUARE TABLES (from White's perspective, a1=index 0)
# Values represent positional bonuses/penalties in centipawns
# ============================================================

# fmt: off
PAWN_TABLE = [
     0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
     5,  5, 10, 25, 25, 10,  5,  5,
     0,  0,  0, 20, 20,  0,  0,  0,
     5, -5,-10,  0,  0,-10, -5,  5,
     5, 10, 10,-20,-20, 10, 10,  5,
     0,  0,  0,  0,  0,  0,  0,  0,
]

KNIGHT_TABLE = [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50,
]

BISHOP_TABLE = [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20,
]

ROOK_TABLE = [
     0,  0,  0,  0,  0,  0,  0,  0,
     5, 10, 10, 10, 10, 10, 10,  5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
     0,  0,  0,  5,  5,  0,  0,  0,
]

QUEEN_TABLE = [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
     -5,  0,  5,  5,  5,  5,  0, -5,
      0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20,
]

KING_MIDDLEGAME_TABLE = [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
     20, 20,  0,  0,  0,  0, 20, 20,
     20, 30, 10,  0,  0, 10, 30, 20,
]

KING_ENDGAME_TABLE = [
    -50,-40,-30,-20,-20,-30,-40,-50,
    -30,-20,-10,  0,  0,-10,-20,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-30,  0,  0,  0,  0,-30,-30,
    -50,-30,-30,-30,-30,-30,-30,-50,
]
# fmt: on

PST = {
    chess.PAWN: PAWN_TABLE,
    chess.KNIGHT: KNIGHT_TABLE,
    chess.BISHOP: BISHOP_TABLE,
    chess.ROOK: ROOK_TABLE,
    chess.QUEEN: QUEEN_TABLE,
    chess.KING: KING_MIDDLEGAME_TABLE,
}

# Center squares for control evaluation
CENTER_SQUARES = [chess.D4, chess.E4, chess.D5, chess.E5]
EXTENDED_CENTER = [
    chess.C3, chess.D3, chess.E3, chess.F3,
    chess.C4, chess.D4, chess.E4, chess.F4,
    chess.C5, chess.D5, chess.E5, chess.F5,
    chess.C6, chess.D6, chess.E6, chess.F6,
]


def is_endgame(board: chess.Board) -> bool:
    """Determine if the position is in the endgame phase."""
    queens = len(board.pieces(chess.QUEEN, chess.WHITE)) + len(
        board.pieces(chess.QUEEN, chess.BLACK)
    )
    if queens == 0:
        return True

    # Count minor pieces
    white_minor = len(board.pieces(chess.KNIGHT, chess.WHITE)) + len(
        board.pieces(chess.BISHOP, chess.WHITE)
    )
    black_minor = len(board.pieces(chess.KNIGHT, chess.BLACK)) + len(
        board.pieces(chess.BISHOP, chess.BLACK)
    )

    # Endgame if each side has at most 1 minor piece + queen, or no queens
    white_major = len(board.pieces(chess.ROOK, chess.WHITE)) + len(
        board.pieces(chess.QUEEN, chess.WHITE)
    )
    black_major = len(board.pieces(chess.ROOK, chess.BLACK)) + len(
        board.pieces(chess.QUEEN, chess.BLACK)
    )

    total_material = (
        white_minor + black_minor + white_major + black_major
    )
    return total_material <= 6


def evaluate_material(board: chess.Board) -> int:
    """Evaluate material balance."""
    score = 0
    for piece_type in PIECE_VALUES:
        white_pieces = len(board.pieces(piece_type, chess.WHITE))
        black_pieces = len(board.pieces(piece_type, chess.BLACK))
        score += PIECE_VALUES[piece_type] * (white_pieces - black_pieces)
    return score


def evaluate_pst(board: chess.Board) -> int:
    """Evaluate piece-square table bonuses."""
    score = 0
    endgame = is_endgame(board)

    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece is None:
            continue

        if piece.piece_type == chess.KING and endgame:
            table = KING_ENDGAME_TABLE
        else:
            table = PST.get(piece.piece_type, [0] * 64)

        if piece.color == chess.WHITE:
            # Mirror vertically for white (tables are from white's view, rank 8 first)
            mirrored = chess.square_mirror(square)
            score += table[mirrored]
        else:
            score -= table[square]

    return score


def evaluate_king_safety(board: chess.Board) -> int:
    """Evaluate king safety including castling and pawn shield."""
    if is_endgame(board):
        return 0  # King safety less relevant in endgame

    score = 0

    for color in [chess.WHITE, chess.BLACK]:
        sign = 1 if color == chess.WHITE else -1
        king_sq = board.king(color)
        if king_sq is None:
            continue

        king_file = chess.square_file(king_sq)
        king_rank = chess.square_rank(king_sq)

        # Castling rights bonus
        if color == chess.WHITE:
            if board.has_kingside_castling_rights(chess.WHITE):
                score += sign * 15
            if board.has_queenside_castling_rights(chess.WHITE):
                score += sign * 10
        else:
            if board.has_kingside_castling_rights(chess.BLACK):
                score += sign * 15
            if board.has_queenside_castling_rights(chess.BLACK):
                score += sign * 10

        # Pawn shield evaluation
        shield_bonus = 0
        pawn_dir = 1 if color == chess.WHITE else -1
        for df in [-1, 0, 1]:
            f = king_file + df
            if 0 <= f <= 7:
                shield_rank = king_rank + pawn_dir
                if 0 <= shield_rank <= 7:
                    shield_sq = chess.square(f, shield_rank)
                    piece = board.piece_at(shield_sq)
                    if piece and piece.piece_type == chess.PAWN and piece.color == color:
                        shield_bonus += 10

                # Double pawn shield
                shield_rank_2 = king_rank + 2 * pawn_dir
                if 0 <= shield_rank_2 <= 7:
                    shield_sq_2 = chess.square(f, shield_rank_2)
                    piece2 = board.piece_at(shield_sq_2)
                    if piece2 and piece2.piece_type == chess.PAWN and piece2.color == color:
                        shield_bonus += 5

        score += sign * shield_bonus

        # Penalty for open files around king
        for df in [-1, 0, 1]:
            f = king_file + df
            if 0 <= f <= 7:
                has_own_pawn = False
                for r in range(8):
                    sq = chess.square(f, r)
                    p = board.piece_at(sq)
                    if p and p.piece_type == chess.PAWN and p.color == color:
                        has_own_pawn = True
                        break
                if not has_own_pawn:
                    score -= sign * 15  # Open file near king is dangerous

    return score


def evaluate_mobility(board: chess.Board) -> int:
    """Evaluate mobility (number of legal moves) and center control."""
    score = 0

    # Current side's mobility
    current_moves = board.legal_moves.count()

    # Switch sides to count opponent's moves
    board.push(chess.Move.null())
    opponent_moves = board.legal_moves.count()
    board.pop()

    if board.turn == chess.WHITE:
        score += (current_moves - opponent_moves) * 3
    else:
        score += (opponent_moves - current_moves) * 3

    # Center control bonus
    for sq in CENTER_SQUARES:
        attackers_w = len(board.attackers(chess.WHITE, sq))
        attackers_b = len(board.attackers(chess.BLACK, sq))
        score += (attackers_w - attackers_b) * 5

    return score


def evaluate_piece_activity(board: chess.Board) -> int:
    """Evaluate piece activity and development."""
    score = 0

    # Bishop pair bonus
    white_bishops = len(board.pieces(chess.BISHOP, chess.WHITE))
    black_bishops = len(board.pieces(chess.BISHOP, chess.BLACK))
    if white_bishops >= 2:
        score += 30
    if black_bishops >= 2:
        score -= 30

    # Rook on open file bonus
    for color in [chess.WHITE, chess.BLACK]:
        sign = 1 if color == chess.WHITE else -1
        for rook_sq in board.pieces(chess.ROOK, color):
            rook_file = chess.square_file(rook_sq)
            own_pawns = False
            enemy_pawns = False
            for r in range(8):
                sq = chess.square(rook_file, r)
                p = board.piece_at(sq)
                if p and p.piece_type == chess.PAWN:
                    if p.color == color:
                        own_pawns = True
                    else:
                        enemy_pawns = True

            if not own_pawns and not enemy_pawns:
                score += sign * 20  # Open file
            elif not own_pawns:
                score += sign * 10  # Semi-open file

    # Connected rooks bonus
    for color in [chess.WHITE, chess.BLACK]:
        sign = 1 if color == chess.WHITE else -1
        rooks = list(board.pieces(chess.ROOK, color))
        if len(rooks) == 2:
            r1, r2 = rooks
            # Check if rooks can see each other (same rank or file, no pieces between)
            if chess.square_rank(r1) == chess.square_rank(r2) or chess.square_file(r1) == chess.square_file(r2):
                score += sign * 10

    # Passed pawn bonus
    for color in [chess.WHITE, chess.BLACK]:
        sign = 1 if color == chess.WHITE else -1
        for pawn_sq in board.pieces(chess.PAWN, color):
            pawn_file = chess.square_file(pawn_sq)
            pawn_rank = chess.square_rank(pawn_sq)
            is_passed = True

            enemy_color = not color
            check_dir = 1 if color == chess.WHITE else -1

            for df in [-1, 0, 1]:
                f = pawn_file + df
                if 0 <= f <= 7:
                    r = pawn_rank + check_dir
                    while 0 <= r <= 7:
                        sq = chess.square(f, r)
                        p = board.piece_at(sq)
                        if p and p.piece_type == chess.PAWN and p.color == enemy_color:
                            is_passed = False
                            break
                        r += check_dir

            if is_passed:
                # Bonus increases as pawn advances
                advance = pawn_rank if color == chess.WHITE else (7 - pawn_rank)
                score += sign * (10 + advance * 10)

    return score


def evaluate_board(board: chess.Board) -> int:
    """
    Main evaluation function. Returns score in centipawns from White's perspective.
    Positive = White advantage, Negative = Black advantage.
    """
    # Terminal states
    if board.is_checkmate():
        if board.turn == chess.WHITE:
            return -99999  # Black wins
        else:
            return 99999  # White wins

    if board.is_stalemate() or board.is_insufficient_material():
        return 0

    if board.is_fifty_moves() or board.is_repetition():
        return 0

    score = 0
    score += evaluate_material(board)
    score += evaluate_pst(board)
    score += evaluate_king_safety(board)
    score += evaluate_mobility(board)
    score += evaluate_piece_activity(board)

    return score
