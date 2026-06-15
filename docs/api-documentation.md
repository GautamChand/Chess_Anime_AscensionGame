# API Documentation

## Base URL
```
http://localhost:8000
```

## Interactive Docs
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Chess AI Endpoints

### POST `/api/chess/move`
Get the AI's best move for a given position.

**Request Body:**
```json
{
  "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
  "depth": 4
}
```

**Response:**
```json
{
  "best_move": "e7e5",
  "best_move_san": "e5",
  "score": -10,
  "depth": 4,
  "nodes_explored": 42350,
  "nodes_pruned": 8921,
  "search_time_ms": 1250.5,
  "pv_line": ["e7e5", "g1f3", "b8c6", "f1b5"],
  "tt_hits": 1523,
  "from_book": false,
  "estimated_minimax_nodes": 1500625,
  "pruning_reduction_pct": 97.2
}
```

### POST `/api/chess/analyze`
Analyze a position with full details.

**Request Body:**
```json
{
  "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "depth": 4
}
```

**Response:** Same as `/move` plus:
```json
{
  "is_check": false,
  "is_checkmate": false,
  "is_stalemate": false,
  "is_game_over": false,
  "legal_moves": ["a2a3", "a2a4", ...],
  "in_book": true
}
```

### POST `/api/chess/validate`
Validate a move in the given position.

**Request Body:**
```json
{
  "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
  "move": "e7e5"
}
```

**Response:**
```json
{
  "valid": true,
  "move_uci": "e7e5",
  "move_san": "e5",
  "resulting_fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
  "is_check": false,
  "is_checkmate": false
}
```

### GET `/api/chess/opening-book/{fen}`
Check if a position is in the opening book.

---

## Anime Ascension Endpoints

### POST `/api/anime/ai-decision`
Get AI analysis for the board game state.

**Request Body:**
```json
{
  "player": {
    "position": 42,
    "health": 120,
    "attack": 30,
    "defense": 20,
    "magic": 25,
    "speed": 15,
    "collected_heroes": ["Rimuru Tempest", "Gobta"],
    "active_buffs": [],
    "skip_turn": false,
    "double_movement_turns": 0,
    "immunity": false
  },
  "opponent": {
    "position": 35,
    "health": 100,
    "attack": 10,
    "defense": 10,
    "magic": 10,
    "speed": 10,
    "collected_heroes": [],
    "active_buffs": []
  },
  "depth": 3
}
```

**Response:**
```json
{
  "position_score": 156.5,
  "expected_value": 78.3,
  "strategy": "COLLECT_HEROES",
  "tile_analysis": [
    {"dice_value": 1, "position": 43, "tile_type": "normal", "tile_name": "Tile 43", "score": 21.5},
    {"dice_value": 2, "position": 44, "tile_type": "normal", "tile_name": "Tile 44", "score": 22.0}
  ],
  "needed_heroes": ["Diablo", "Guy Crimson", "Veldora", "Milim Nava"],
  "boss_ready": false,
  "risk_level": "LOW"
}
```

### GET `/api/anime/board-info`
Get complete board layout information.

---

## Health Check

### GET `/health`
```json
{"status": "healthy"}
```
