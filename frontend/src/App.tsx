import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Component, type ReactNode } from 'react'
import Navigation from './components/Navigation'
import ParticleBackground from './components/ParticleBackground'
import Home from './pages/Home'
import ChessPage from './features/chess/ChessPage'
import AnimePage from './features/anime/AnimePage'

// Error boundary to catch and display render errors
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#ef4444',
          fontFamily: 'monospace',
          background: '#0a0a0f',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⚠ Render Error</h1>
          <pre style={{ fontSize: '0.85rem', maxWidth: '600px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {this.state.error.message}
          </pre>
          <button
            onClick={() => { this.setState({ error: null }); window.location.reload() }}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1.5rem',
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ParticleBackground />
        <Navigation />
        <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chess" element={<ChessPage />} />
            <Route path="/anime" element={<AnimePage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
