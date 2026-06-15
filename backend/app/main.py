"""
FastAPI Main Application
=========================
Entry point for the Chess AI & Anime Ascension backend server.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.chess_routes import router as chess_router
from .api.anime_routes import router as anime_router

app = FastAPI(
    title="Chess AI & Anime Ascension",
    description="AI Gaming Platform with Chess Engine and Anime Ascension Board Game",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(chess_router)
app.include_router(anime_router)


@app.get("/")
async def root():
    return {
        "name": "Chess AI & Anime Ascension",
        "version": "1.0.0",
        "endpoints": {
            "chess": "/api/chess",
            "anime": "/api/anime",
            "docs": "/docs",
        },
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
