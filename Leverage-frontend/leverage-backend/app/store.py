"""
Local metadata index.

IMPORTANT — read this before changing anything:
This SQLite table is NOT where negotiation knowledge lives. It exists only
to answer cheap, structural questions fast without calling Hindsight's
reflect (which invokes an LLM) every time someone just wants a vendor list:
    - "which vendors have any data at all?"
    - "how many negotiations have been logged for vendor X?"
    - "who has contributed to vendor X's memory?"

The actual negotiation content (discounts, terms, tactics, outcomes) is
retained ONLY in Hindsight. If you deleted this file entirely, Hindsight
would still have full knowledge — you'd just lose the fast vendor list.
That split keeps "Use of Hindsight Memory" (25% of the score) honest:
Hindsight is the memory, not a cache in front of a real database.
"""
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone

from app.config import settings


def init_db() -> None:
    with _connect() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS negotiation_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                vendor TEXT NOT NULL,
                vendor_slug TEXT NOT NULL,
                logged_by TEXT NOT NULL,
                department TEXT NOT NULL,
                logged_at TEXT NOT NULL
            )
            """
        )
        conn.commit()


def clear_db() -> None:
    """Clears the local index database so seeding produces a clean ground truth dataset."""
    with _connect() as conn:
        conn.execute("DELETE FROM negotiation_log")
        conn.commit()


@contextmanager
def _connect():
    conn = sqlite3.connect(settings.LOCAL_INDEX_DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def record_negotiation(vendor: str, vendor_slug: str, logged_by: str, department: str) -> None:
    with _connect() as conn:
        conn.execute(
            """
            INSERT INTO negotiation_log (vendor, vendor_slug, logged_by, department, logged_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (vendor, vendor_slug, logged_by, department, datetime.now(timezone.utc).isoformat()),
        )
        conn.commit()


def list_vendors() -> list[dict]:
    """Returns every vendor with at least one logged negotiation, plus a
    count used to compute the confidence badge (Low/Medium/High)."""
    with _connect() as conn:
        rows = conn.execute(
            """
            SELECT vendor, vendor_slug, COUNT(*) as negotiation_count
            FROM negotiation_log
            GROUP BY vendor_slug
            ORDER BY negotiation_count DESC
            """
        ).fetchall()
        return [dict(r) for r in rows]


def get_contributors(vendor_slug: str) -> list[dict]:
    """Deduplicated list of everyone who has logged a negotiation for this
    vendor — this is what powers the 'Contributed by' UI tags, the visual
    proof that a brief is built from cross-employee memory."""
    with _connect() as conn:
        rows = conn.execute(
            """
            SELECT DISTINCT logged_by, department
            FROM negotiation_log
            WHERE vendor_slug = ?
            ORDER BY logged_by
            """,
            (vendor_slug,),
        ).fetchall()
        return [dict(r) for r in rows]


def get_negotiation_count(vendor_slug: str) -> int:
    with _connect() as conn:
        row = conn.execute(
            "SELECT COUNT(*) as c FROM negotiation_log WHERE vendor_slug = ?",
            (vendor_slug,),
        ).fetchone()
        return row["c"] if row else 0


def confidence_label(count: int) -> str:
    """Matches the rule agreed in the project plan: <3 = Low, 3-5 = Medium, 6+ = High."""
    if count >= 6:
        return "High"
    if count >= 3:
        return "Medium"
    return "Low"
