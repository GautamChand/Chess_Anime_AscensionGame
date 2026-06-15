# AI Algorithm Documentation

## Table of Contents
1. [Minimax Algorithm](#minimax-algorithm)
2. [Alpha-Beta Pruning](#alpha-beta-pruning)
3. [Iterative Deepening](#iterative-deepening)
4. [Heuristic Evaluation](#heuristic-evaluation)
5. [Transposition Tables](#transposition-tables)
6. [Quiescence Search](#quiescence-search)
7. [Move Ordering](#move-ordering)
8. [Expectimax Algorithm](#expectimax-algorithm)
9. [Complexity Analysis](#complexity-analysis)

---

## Minimax Algorithm

### Concept
Minimax is a decision-making algorithm for two-player zero-sum games. It assumes both players play optimally:
- **Maximizing player** (White) tries to maximize the evaluation score
- **Minimizing player** (Black) tries to minimize the evaluation score

### Pseudocode
```
function minimax(position, depth, maximizing):
    if depth == 0 or game_over:
        return evaluate(position)
    
    if maximizing:
        maxEval = -∞
        for each move in legal_moves:
            eval = minimax(apply(move), depth-1, false)
            maxEval = max(maxEval, eval)
        return maxEval
    else:
        minEval = +∞
        for each move in legal_moves:
            eval = minimax(apply(move), depth-1, true)
            minEval = min(minEval, eval)
        return minEval
```

### Complexity
- **Time**: O(b^d) where b = branching factor (~35 for chess), d = depth
- **Space**: O(b × d) for the recursion stack

---

## Alpha-Beta Pruning

### Concept
Alpha-Beta pruning is an optimization of Minimax that eliminates branches that cannot influence the final decision.

- **Alpha (α)**: Best score the maximizer can guarantee (lower bound)
- **Beta (β)**: Best score the minimizer can guarantee (upper bound)
- **Pruning occurs when**: α ≥ β (the current branch can't produce a better result)

### Pseudocode
```
function alphabeta(position, depth, α, β, maximizing):
    if depth == 0 or game_over:
        return evaluate(position)
    
    if maximizing:
        maxEval = -∞
        for each move in legal_moves:
            eval = alphabeta(apply(move), depth-1, α, β, false)
            maxEval = max(maxEval, eval)
            α = max(α, eval)
            if β ≤ α: break  ← PRUNING
        return maxEval
    else:
        minEval = +∞
        for each move in legal_moves:
            eval = alphabeta(apply(move), depth-1, α, β, true)
            minEval = min(minEval, eval)
            β = min(β, eval)
            if β ≤ α: break  ← PRUNING
        return minEval
```

### Complexity
- **Best case** (perfect move ordering): O(b^(d/2))
- **Worst case** (no pruning): O(b^d) — same as Minimax
- **Average case**: O(b^(3d/4))

### Impact
With optimal move ordering, Alpha-Beta pruning effectively **doubles the search depth** for the same computation time.

---

## Iterative Deepening

### Concept
Instead of searching directly to the maximum depth, we search depth 1, then depth 2, then depth 3, etc.

### Benefits
1. **Time management**: We always have a "best move" available
2. **Move ordering**: Results from depth N help order moves at depth N+1
3. **Overhead is minimal**: Due to exponential growth, the final iteration dominates

### Implementation
```python
for depth in range(1, max_depth + 1):
    best_move = alpha_beta(position, depth, -∞, +∞, true)
```

---

## Heuristic Evaluation

### Components (in our implementation)

| Factor | Weight | Description |
|--------|--------|-------------|
| Material | High | Standard piece values (P=100, N=320, B=330, R=500, Q=900, K=20000) |
| Piece-Square Tables | Medium | Position-dependent bonuses for each piece type |
| King Safety | Medium | Castling rights, pawn shield, open files near king |
| Mobility | Low-Medium | Number of legal moves, center control |
| Piece Activity | Low-Medium | Bishop pair, rook on open files, passed pawns |

### Piece Values
```
Pawn   = 100  (1 pawn unit)
Knight = 320  (3.2 pawns)
Bishop = 330  (3.3 pawns)
Rook   = 500  (5 pawns)
Queen  = 900  (9 pawns)
King   = 20000 (effectively infinite)
```

---

## Transposition Tables

### Concept
A hash table that stores previously evaluated positions to avoid redundant computation.

### Zobrist Hashing
- Assign random 64-bit numbers to each (piece, square) combination
- XOR all occupied squares to compute the position hash
- Very fast incremental updates when making/unmaking moves

### Entry Types
| Flag | Meaning |
|------|---------|
| EXACT | The stored score is exact |
| ALPHA | Upper bound (score ≤ stored value) |
| BETA | Lower bound (score ≥ stored value) |

---

## Quiescence Search

### Problem: Horizon Effect
Regular depth-limited search might stop right before a capture, giving an inaccurate evaluation.

### Solution
At leaf nodes, continue searching **capture moves only** until the position is "quiet."

### MVV-LVA Ordering
Captures are ordered by **Most Valuable Victim - Least Valuable Attacker**:
- Score = Victim_Value × 10 - Attacker_Value
- Example: PxQ (pawn captures queen) scores highest

---

## Move Ordering

Priority order in our implementation:
1. **TT Move**: Best move from transposition table (score: 10M)
2. **Winning Captures**: MVV-LVA ordering (score: 1M+)
3. **Promotions**: Especially queen promotions (score: 900K)
4. **Killer Moves**: Quiet moves that caused cutoffs at this depth (score: 500K)
5. **Checks**: Moves that give check (score: 400K)
6. **History Heuristic**: Quiet moves ranked by historical success (variable)

---

## Expectimax Algorithm

### Concept
Used for the Anime Ascension board game where **chance nodes** (dice rolls) exist.

Unlike Minimax, Expectimax handles stochastic elements:
- **Max nodes**: Player chooses the best action
- **Chance nodes**: Average over all possible outcomes (dice: 1/6 each)

### Pseudocode
```
function expectimax(state, depth):
    if depth == 0 or terminal:
        return evaluate(state)
    
    if chance_node:  # Dice roll
        expected_value = 0
        for each dice ∈ {1,2,3,4,5,6}:
            new_state = apply_move(state, dice)
            expected_value += (1/6) × expectimax(new_state, depth-1)
        return expected_value
    
    if max_node:  # Player decision
        return max(expectimax(child, depth-1) for child in children)
```

---

## Complexity Analysis

### Chess Engine

| Algorithm | Time Complexity | Space Complexity |
|-----------|----------------|-----------------|
| Minimax (exhaustive) | O(b^d) | O(b×d) |
| Alpha-Beta (optimal) | O(b^(d/2)) | O(b×d) |
| Alpha-Beta (average) | O(b^(3d/4)) | O(b×d) |
| Quiescence Search | O(b_q^d_q) | O(b_q×d_q) |
| Transposition Lookup | O(1) | O(n) entries |

Where:
- b = branching factor (~35 for chess)
- d = search depth
- b_q = capture branching factor (~5-8)
- d_q = quiescence depth

### Concrete Example (depth=4)

| Metric | Minimax | Alpha-Beta |
|--------|---------|------------|
| Branching factor | 35 | 35 |
| Depth | 4 | 4 |
| Estimated nodes | 35^4 = 1,500,625 | 35^2 = 1,225 (optimal) |
| Actual nodes (typical) | 1,500,625 | ~50,000-200,000 |
| Reduction | 0% | ~87-97% |

### Board Game AI

| Algorithm | Time Complexity |
|-----------|----------------|
| Expectimax (depth d) | O(b × 6^d) |
| Position evaluation | O(1) |
| Tile analysis | O(1) per tile |
