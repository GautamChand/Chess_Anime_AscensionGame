# User Manual

## Getting Started

### Launching the Application
1. Start the backend server (see Installation Guide)
2. Start the frontend dev server
3. Open **http://localhost:5173** in your browser

### Home Screen
The home screen presents two game options:
- **♟ Chess AI** — Play chess against an AI opponent
- **✦ Anime Ascension** — Play the Tensura-inspired board game

Click either card to start playing.

---

## Chess AI

### Game Modes

| Mode | Description |
|------|-------------|
| **Human vs Human** | Two players take turns on the same board |
| **Human vs AI** | Play as White against the AI (Black) |
| **AI vs AI** | Watch two AI engines play against each other |

### Difficulty Levels

| Level | Search Depth | Strength |
|-------|-------------|----------|
| Easy | 2 plies | Beginner-friendly |
| Medium | 4 plies | Intermediate challenge |
| Hard | 6 plies | Strong play |

### How to Play
1. Select your **game mode** from the left panel
2. Choose **difficulty** (if playing against AI)
3. **Click a piece** to select it — legal moves will be highlighted
4. **Click a highlighted square** to make your move
5. The AI will respond automatically (in HvAI mode)

### Controls
- **↩ Undo** — Take back your last move (undoes both your move and AI's response)
- **🔄 New Game** — Start a fresh game

### AI Statistics Panel
The right panel shows real-time AI analysis:
- **Best Move** — The move the AI chose (📖 = from opening book)
- **Search Depth** — How many moves ahead the AI searched
- **Evaluation** — Position score (+ = White advantage, - = Black advantage)
- **Nodes Explored** — Total positions evaluated
- **Nodes Pruned** — Positions skipped by Alpha-Beta pruning
- **Search Time** — How long the AI took to decide
- **Principal Variation** — The AI's predicted best line of play
- **Efficiency Comparison** — Shows the reduction from pruning vs exhaustive search

---

## Anime Ascension

### Objective
Travel from **Tile 1 to Tile 100**, collecting powerful anime allies along the way. You must collect the right heroes to defeat **Veldanava** (the final boss) at Tile 95-100.

### How to Play
1. Click the **dice** to roll (1-6)
2. Your token moves forward by the rolled number
3. Special tiles trigger encounters:
   - 🟢 **Hero tiles** — Recruit allies and gain buffs
   - 🔴 **Villain tiles** — Face penalties and setbacks
   - 🟡 **Event tiles** — Trigger special events
   - 🟣 **Boss zone** (95-100) — Challenge the final boss

### Winning Conditions
To defeat Veldanava at the final boss zone, you MUST have:
- ✅ **Rimuru Tempest** (from Tile 8)
- ✅ At least ONE of: **Diablo**, **Guy Crimson**, **Veldora**, or **Milim Nava**

If you enter the boss zone without these requirements, you are sent back to Tile 70!

### Player Stats
Each player has:
- ❤ **HP** (Health) — Your life force
- ⚔ **ATK** (Attack) — Combat power
- 🛡 **DEF** (Defense) — Damage resistance
- ✨ **MAG** (Magic) — Magical ability
- 💨 **SPD** (Speed) — Movement speed

### Hero Allies

| Hero | Tile | Effect |
|------|------|--------|
| Rimuru Tempest | 8 | +20 ATK, +20 DEF, move forward 8 |
| Gobta | 18 | 50% chance for bonus turns |
| Benimaru | 25 | Move forward 7 spaces |
| Shion | 33 | Double attack for next encounter |
| Veldora | 42 | Double movement for 3 turns |
| Diablo | 55 | Immunity + move forward 10 |
| Guy Crimson | 68 | +25 ATK, move forward 12 |
| Milim Nava | 82 | Teleport forward 15 spaces |

### Villains

| Villain | Tile | Effect |
|---------|------|--------|
| Clayman | 15 | Reduce attack by 20% |
| Orc Lord | 28 | Lose turn, move back 10 |
| Jahil | 38 | Random stat reduction |
| Velzard | 50 | Skip next turn |
| Feldway | 62 | Random teleport backward |
| Michael | 78 | Remove ALL buffs, move back 20 |

### Tips
- 🎯 **Priority**: Collect Rimuru early (Tile 8) — it's required for the boss
- 🛡 **Diablo's immunity** (Tile 55) is extremely valuable before Michael (Tile 78)
- ⚡ **Veldora's double movement** (Tile 42) helps you skip dangerous zones
- 🌟 **Milim Nava's teleport** (Tile 82) can jump you directly to the boss zone
