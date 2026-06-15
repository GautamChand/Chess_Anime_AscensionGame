import { useState, useCallback, useRef, useEffect } from 'react'
import { Chess } from 'chess.js'
import type { Square, Move } from 'chess.js'
import { getAIMove, type AIStats } from '../services/chessApi'

export type GameMode = 'hvh' | 'hvai' | 'aivai'
export type GameStatus = 'playing' | 'checkmate' | 'stalemate' | 'draw' | 'resigned'

interface GameState {
  game: Chess
  fen: string
  history: Move[]
  selectedSquare: Square | null
  legalMoves: string[]
  lastMove: { from: Square; to: Square } | null
  gameMode: GameMode
  gameStatus: GameStatus
  aiDepth: number
  isAiThinking: boolean
  aiStats: AIStats | null
  capturedPieces: { white: string[]; black: string[] }
  statusMessage: string
}

export function useChessGame() {
  const gameRef = useRef(new Chess())
  const [state, setState] = useState<GameState>(() => ({
    game: gameRef.current,
    fen: gameRef.current.fen(),
    history: [],
    selectedSquare: null,
    legalMoves: [],
    lastMove: null,
    gameMode: 'hvai',
    gameStatus: 'playing',
    aiDepth: 4,
    isAiThinking: false,
    aiStats: null,
    capturedPieces: { white: [], black: [] },
    statusMessage: "White's turn",
  }))

  const aiThinkingRef = useRef(false)

  const updateState = useCallback(() => {
    const game = gameRef.current
    let status: GameStatus = 'playing'
    let message = game.turn() === 'w' ? "White's turn" : "Black's turn"

    if (game.isCheckmate()) {
      status = 'checkmate'
      message = `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`
    } else if (game.isStalemate()) {
      status = 'stalemate'
      message = 'Stalemate! Game is a draw.'
    } else if (game.isDraw()) {
      status = 'draw'
      message = 'Draw!'
    } else if (game.isCheck()) {
      message += ' (Check!)'
    }

    // Calculate captured pieces
    const captured = { white: [] as string[], black: [] as string[] }
    const hist = game.history({ verbose: true })
    for (const move of hist) {
      if (move.captured) {
        const pieceSymbols: Record<string, string> = {
          p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚'
        }
        const symbol = pieceSymbols[move.captured] || move.captured
        if (move.color === 'w') {
          captured.black.push(symbol)
        } else {
          captured.white.push(symbol)
        }
      }
    }

    setState(prev => ({
      ...prev,
      fen: game.fen(),
      history: hist,
      gameStatus: status,
      capturedPieces: captured,
      statusMessage: message,
    }))
  }, [])

  const selectSquare = useCallback((square: Square) => {
    const game = gameRef.current
    if (state.gameStatus !== 'playing') return
    if (state.isAiThinking) return

    // If in HvAI mode and it's AI's turn, ignore clicks
    if (state.gameMode === 'hvai' && game.turn() === 'b') return
    if (state.gameMode === 'aivai') return

    const piece = game.get(square)

    // If a square is already selected, try to move there
    if (state.selectedSquare) {
      const moveResult = tryMove(state.selectedSquare, square)
      if (moveResult) return

      // If clicking own piece, select it instead
      if (piece && piece.color === game.turn()) {
        const moves = game.moves({ square, verbose: true })
        setState(prev => ({
          ...prev,
          selectedSquare: square,
          legalMoves: moves.map(m => m.to),
        }))
        return
      }

      // Deselect
      setState(prev => ({ ...prev, selectedSquare: null, legalMoves: [] }))
      return
    }

    // Select a piece
    if (piece && piece.color === game.turn()) {
      const moves = game.moves({ square, verbose: true })
      setState(prev => ({
        ...prev,
        selectedSquare: square,
        legalMoves: moves.map(m => m.to),
      }))
    }
  }, [state.selectedSquare, state.gameStatus, state.isAiThinking, state.gameMode])

  const tryMove = useCallback((from: Square, to: Square): boolean => {
    const game = gameRef.current
    try {
      // Check for promotion
      const piece = game.get(from)
      let promotion: 'q' | 'r' | 'b' | 'n' | undefined
      if (piece && piece.type === 'p') {
        const toRank = parseInt(to[1])
        if ((piece.color === 'w' && toRank === 8) || (piece.color === 'b' && toRank === 1)) {
          promotion = 'q' // Auto-promote to queen
        }
      }

      const move = game.move({ from, to, promotion })
      if (move) {
        setState(prev => ({
          ...prev,
          selectedSquare: null,
          legalMoves: [],
          lastMove: { from: from, to: to },
        }))
        updateState()
        return true
      }
    } catch {
      // Invalid move
    }
    return false
  }, [updateState])

  const makeAIMove = useCallback(async () => {
    if (aiThinkingRef.current) return
    const game = gameRef.current
    if (game.isGameOver()) return

    aiThinkingRef.current = true
    setState(prev => ({ ...prev, isAiThinking: true, statusMessage: '🤖 AI is thinking...' }))

    try {
      const stats = await getAIMove(game.fen(), state.aiDepth)
      
      if (stats.best_move && !game.isGameOver()) {
        const from = stats.best_move.substring(0, 2) as Square
        const to = stats.best_move.substring(2, 4) as Square
        const promotion = stats.best_move.length > 4 ? stats.best_move[4] as 'q' | 'r' | 'b' | 'n' : undefined

        game.move({ from, to, promotion })

        setState(prev => ({
          ...prev,
          aiStats: stats,
          lastMove: { from, to },
          selectedSquare: null,
          legalMoves: [],
        }))
        updateState()
      }
    } catch (err) {
      console.error('AI move failed:', err)
      // Fallback: make a random legal move
      const moves = game.moves()
      if (moves.length > 0) {
        game.move(moves[Math.floor(Math.random() * moves.length)])
        updateState()
      }
      setState(prev => ({ ...prev, aiStats: null }))
    } finally {
      aiThinkingRef.current = false
      setState(prev => ({ ...prev, isAiThinking: false }))
    }
  }, [state.aiDepth, updateState])

  // Auto-trigger AI moves
  useEffect(() => {
    const game = gameRef.current
    if (game.isGameOver()) return
    if (aiThinkingRef.current) return

    if (state.gameMode === 'hvai' && game.turn() === 'b') {
      const timer = setTimeout(() => makeAIMove(), 300)
      return () => clearTimeout(timer)
    }

    if (state.gameMode === 'aivai') {
      const timer = setTimeout(() => makeAIMove(), 500)
      return () => clearTimeout(timer)
    }
  }, [state.fen, state.gameMode, makeAIMove])

  const undoMove = useCallback(() => {
    const game = gameRef.current
    if (state.isAiThinking) return

    if (state.gameMode === 'hvai') {
      // Undo both AI and player move
      game.undo()
      game.undo()
    } else {
      game.undo()
    }

    setState(prev => ({ ...prev, selectedSquare: null, legalMoves: [], lastMove: null }))
    updateState()
  }, [state.isAiThinking, state.gameMode, updateState])

  const newGame = useCallback(() => {
    gameRef.current = new Chess()
    setState({
      game: gameRef.current,
      fen: gameRef.current.fen(),
      history: [],
      selectedSquare: null,
      legalMoves: [],
      lastMove: null,
      gameMode: state.gameMode,
      gameStatus: 'playing',
      aiDepth: state.aiDepth,
      isAiThinking: false,
      aiStats: null,
      capturedPieces: { white: [], black: [] },
      statusMessage: "White's turn",
    })
    aiThinkingRef.current = false
  }, [state.gameMode, state.aiDepth])

  const setGameMode = useCallback((mode: GameMode) => {
    setState(prev => ({ ...prev, gameMode: mode }))
    newGame()
  }, [newGame])

  const setAiDepth = useCallback((depth: number) => {
    setState(prev => ({ ...prev, aiDepth: depth }))
  }, [])

  return {
    ...state,
    selectSquare,
    undoMove,
    newGame,
    setGameMode,
    setAiDepth,
  }
}
