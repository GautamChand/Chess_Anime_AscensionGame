# Chess AI & Anime Ascension: An AI Gaming Platform
## Research Paper

### Abstract

This paper presents the design and implementation of a full-stack AI gaming platform featuring two independent games: a Chess AI engine based on adversarial search algorithms and "Anime Ascension," a strategy board game utilizing probabilistic AI decision-making. The Chess AI implements Minimax with Alpha-Beta Pruning, achieving search space reductions of 87-97% compared to exhaustive search. The board game AI uses Expectimax for strategic decision-making under uncertainty. The platform demonstrates practical applications of Game Theory, Heuristic Evaluation, and Strategic AI in interactive game environments.

**Keywords:** Artificial Intelligence, Adversarial Search, Minimax, Alpha-Beta Pruning, Game Theory, Expectimax, Heuristic Evaluation, Chess Engine, Full Stack Development

---

### 1. Introduction

Game-playing AI has been a cornerstone of Artificial Intelligence research since the field's inception. From Claude Shannon's foundational 1950 paper on chess programming to DeepMind's AlphaZero, games have served as ideal testbeds for AI algorithms due to their well-defined rules, measurable outcomes, and scalable complexity.

This project implements two distinct AI systems:

1. **Chess AI Engine**: A classical chess engine demonstrating adversarial search in a deterministic, perfect-information game with complexity of approximately 10^120 possible game states.

2. **Anime Ascension Board Game AI**: A strategy game AI demonstrating probabilistic decision-making in a stochastic environment with imperfect information.

### 2. Literature Review

#### 2.1 Adversarial Search
The Minimax algorithm, formalized by Von Neumann (1928), provides the theoretical foundation for two-player zero-sum game AI. Shannon (1950) proposed two strategies for chess programs: Type A (brute-force) and Type B (selective search).

#### 2.2 Alpha-Beta Pruning
Independently discovered by multiple researchers in the 1950s-60s, Alpha-Beta pruning reduces the search tree from O(b^d) to O(b^(d/2)) with optimal move ordering (Knuth & Moore, 1975).

#### 2.3 Evaluation Functions
Modern chess engines use multi-factor evaluation combining material balance, piece-square tables, king safety, pawn structure, and mobility (Chessprogramming Wiki).

#### 2.4 Expectimax
For stochastic games, Expectimax extends Minimax by introducing chance nodes that compute expected values across possible outcomes (Russell & Norvig, 2020).

### 3. System Design

#### 3.1 Architecture
The platform uses a client-server architecture:
- **Frontend**: React 19 + TypeScript + Tailwind CSS + Motion
- **Backend**: Python + FastAPI
- **Communication**: REST API

#### 3.2 Chess Engine Design

The engine implements a hierarchical search system:

```
Iterative Deepening (depth 1 → max_depth)
  └── Alpha-Beta Search
       ├── Transposition Table Lookup
       ├── Null Move Pruning
       ├── Late Move Reductions
       ├── Move Ordering (TT → MVV-LVA → Killers → History)
       └── Quiescence Search (at leaf nodes)
            └── Capture-only search with Delta Pruning
```

#### 3.3 Evaluation Function

The evaluation function scores positions across five dimensions:

| Dimension | Implementation | Weight |
|-----------|---------------|--------|
| Material | Standard piece values | High |
| Position | Piece-Square Tables (6 tables) | Medium |
| King Safety | Castling, pawn shield, open files | Medium |
| Mobility | Legal moves, center control | Low-Medium |
| Activity | Bishop pair, rook files, passed pawns | Low-Medium |

#### 3.4 Board Game AI Design

The Anime Ascension AI uses:
- **Expectimax** for probabilistic dice outcomes
- **Tile evaluation** considering hero/villain effects
- **Strategic planning** prioritizing boss requirements
- **Risk assessment** for villain proximity

### 4. Implementation

#### 4.1 Search Optimizations

| Optimization | Effect | Implementation |
|-------------|--------|----------------|
| Alpha-Beta Pruning | Reduces nodes by 87-97% | Fail-soft with aspiration windows |
| Transposition Tables | Eliminates redundant subtrees | Zobrist hashing, 1M entries |
| Move Ordering | Maximizes pruning efficiency | TT + MVV-LVA + Killers + History |
| Quiescence Search | Prevents horizon effect | Capture-only with delta pruning |
| Null Move Pruning | Skips clearly good positions | R=3 reduction, non-check only |
| Late Move Reductions | Reduces late moves depth | R=1 for moves after the 4th |
| Iterative Deepening | Always has a best move | Progressive deepening with TT |
| Opening Book | Instant known-good responses | 30+ positions, weighted random |

#### 4.2 Performance Metrics

At depth 4 (typical medium difficulty):
- **Exhaustive Minimax**: ~1.5M nodes
- **With Alpha-Beta**: ~50K-200K nodes
- **Pruning Reduction**: ~87-97%
- **Search Time**: ~500-3000ms (depending on position)

### 5. Results

#### 5.1 Chess Engine Performance
The engine demonstrates strong tactical play at medium depth (4), handling:
- Opening theory via the opening book
- Tactical combinations via quiescence search
- Positional play via piece-square tables and activity scoring
- Endgame play via specialized king endgame tables

#### 5.2 Search Efficiency
The combined optimizations achieve near-optimal Alpha-Beta efficiency, with typical pruning rates exceeding 90%.

#### 5.3 Board Game AI
The Expectimax-based AI demonstrates strategic behavior:
- Prioritizes collecting boss-requirement heroes
- Avoids villain tiles when possible
- Adapts strategy based on game state
- Assesses risk levels for upcoming tiles

### 6. Conclusion

This project successfully demonstrates the practical application of multiple AI concepts:
- **Adversarial Search** (Minimax, Alpha-Beta)
- **Heuristic Evaluation** (multi-factor position scoring)
- **Game Theory** (optimal strategy in zero-sum games)
- **Probabilistic AI** (Expectimax for stochastic environments)
- **Search Optimization** (transposition tables, move ordering, quiescence)

The platform serves as both an educational tool for understanding these AI concepts and a polished interactive application.

### 7. Future Work
- Neural network-based evaluation (NNUE-style)
- Monte Carlo Tree Search (MCTS) implementation
- Online multiplayer with WebSocket
- Mobile-responsive PWA
- Deeper Expectimax search with pruning

### References

1. Shannon, C. E. (1950). "Programming a Computer for Playing Chess." *Philosophical Magazine*.
2. Knuth, D. E., & Moore, R. W. (1975). "An analysis of alpha-beta pruning." *Artificial Intelligence*, 6(4), 293-326.
3. Russell, S., & Norvig, P. (2020). *Artificial Intelligence: A Modern Approach* (4th ed.). Pearson.
4. Von Neumann, J., & Morgenstern, O. (1944). *Theory of Games and Economic Behavior*. Princeton University Press.
5. Chessprogramming Wiki. https://www.chessprogramming.org/
