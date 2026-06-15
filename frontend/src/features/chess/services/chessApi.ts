import api from '../../../lib/api'

export interface AIStats {
  depth: number
  score: number
  nodes_explored: number
  nodes_pruned: number
  search_time_ms: number
  best_move: string
  best_move_san?: string
  pv_line: string[]
  tt_hits: number
  from_book: boolean
  estimated_minimax_nodes: number
  pruning_reduction_pct: number
}

export async function getAIMove(fen: string, depth: number = 4): Promise<AIStats> {
  const resp = await api.post('/api/chess/move', { fen, depth })
  return resp.data
}

export async function analyzePosition(fen: string, depth: number = 4) {
  const resp = await api.post('/api/chess/analyze', { fen, depth })
  return resp.data
}

export async function validateMove(fen: string, move: string) {
  const resp = await api.post('/api/chess/validate', { fen, move })
  return resp.data
}
