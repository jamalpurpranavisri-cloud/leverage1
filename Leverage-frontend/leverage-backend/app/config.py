"""
Centralized configuration for the Leverage backend.

All secrets/URLs come from environment variables (see .env.example).
Never hardcode API keys — production security best practices are strictly enforced.
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # Hindsight — the shared memory layer. Every negotiation, across every
    # employee, is retained here. This app does NOT store negotiation
    # content in its own database; Hindsight is the single source of truth
    # for "what has the company learned about this vendor."
    HINDSIGHT_BASE_URL: str = os.getenv(
        "HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io"
    )
    HINDSIGHT_API_KEY: str = os.getenv("HINDSIGHT_API_KEY", "")

    # Groq — used only for the optional "parse freeform negotiation notes
    # into structured fields" helper. The core retain/recall/reflect
    # intelligence is entirely Hindsight's, not Groq's.
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

    CORS_ORIGINS: list[str] = os.getenv(
        "CORS_ORIGINS", "http://localhost:3000"
    ).split(",")

    LOCAL_INDEX_DB_PATH: str = os.getenv(
        "LOCAL_INDEX_DB_PATH", "./leverage_index.db"
    )


settings = Settings()

if not settings.HINDSIGHT_API_KEY:
    # Fail loudly at startup rather than silently returning empty briefs
    # later — this is the #1 thing to catch before a live demo.
    print(
        "⚠️  WARNING: HINDSIGHT_API_KEY is not set. "
        "Set it in your .env file before running the app."
    )
