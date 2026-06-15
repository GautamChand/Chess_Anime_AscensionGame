import axios from 'axios'

// In development, Vite proxy forwards /api requests to localhost:8000
// In production, configure your reverse proxy to do the same
const API_BASE = ''

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

export default api

