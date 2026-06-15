# System Architecture

## Overview

The Chess AI & Anime Ascension platform follows a clean **client-server architecture** with a React frontend and Python FastAPI backend.

## Architecture Diagram

```mermaid
graph TB
    subgraph Frontend["Frontend (React + TypeScript)"]
        UI["UI Layer<br/>React Components"]
        Hooks["State Management<br/>Custom Hooks"]
        API["API Service<br/>Axios"]
    end

    subgraph Backend["Backend (Python + FastAPI)"]
        Routes["API Routes<br/>FastAPI Router"]
        
        subgraph ChessEngine["Chess AI Engine"]
            MM["Minimax + Alpha-Beta"]
            Eval["Heuristic Evaluation"]
            TT["Transposition Tables"]
            QS["Quiescence Search"]
            OB["Opening Book"]
        end
        
        subgraph AnimeEngine["Anime AI Engine"]
            EM["Expectimax"]
            TE["Tile Evaluation"]
            SA["Strategic Analysis"]
        end
    end

    subgraph Data["Data Layer"]
        SQLite["SQLite Database"]
    end

    UI --> Hooks
    Hooks --> API
    API -->|"HTTP/REST"| Routes
    Routes --> ChessEngine
    Routes --> AnimeEngine
    Routes --> SQLite
```

## Component Architecture

```mermaid
graph LR
    subgraph Pages
        Home["Home Page"]
        Chess["Chess Page"]
        Anime["Anime Page"]
    end
    
    subgraph ChessComponents["Chess Components"]
        CB["ChessBoard"]
        MH["MoveHistory"]
        CP["CapturedPieces"]
        AS["AIStats"]
        GC["GameControls"]
    end
    
    subgraph AnimeComponents["Anime Components"]
        GB["GameBoard"]
        PP["PlayerPanel"]
        EM["EventModal"]
        GL["GameLog"]
        DR["DiceRoller"]
    end
    
    Chess --> CB
    Chess --> MH
    Chess --> CP
    Chess --> AS
    Chess --> GC
    
    Anime --> GB
    Anime --> PP
    Anime --> EM
    Anime --> GL
    Anime --> DR
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant React as React Frontend
    participant FastAPI as FastAPI Backend
    participant Engine as AI Engine

    User->>React: Makes a chess move
    React->>React: Validates move (chess.js)
    React->>FastAPI: POST /api/chess/move {fen, depth}
    FastAPI->>Engine: analyze_position(fen, depth)
    Engine->>Engine: Iterative Deepening Search
    Engine->>Engine: Alpha-Beta with TT + Quiescence
    Engine-->>FastAPI: {best_move, stats}
    FastAPI-->>React: AI Move + Statistics
    React->>React: Update board & UI
    React-->>User: Display move + AI stats
```

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend Framework | React + TypeScript | Type safety, component model, ecosystem |
| Build Tool | Vite | Fast HMR, modern ESM support |
| Styling | Tailwind CSS v4 | Utility-first, rapid prototyping |
| Animations | Motion (Framer Motion) | Declarative animations, layout animations |
| Backend | FastAPI | Async, auto-docs, Pydantic validation |
| Chess Logic (Backend) | python-chess | Production-grade move generation |
| Chess Logic (Frontend) | chess.js | Client-side validation |
| AI Algorithms | Custom implementation | Educational purpose, full control |
