"""
Seed script for Leverage Memory Layer — Person A (Memory Engine).

Seeds realistic negotiation history across three distinct vendors to demonstrate
evidence-based confidence tiers:
1. Microsoft (8 deals, multi-employee, High confidence)
2. Apex Logistics (3 deals, medium depth, Medium confidence)
3. NovaCloud Hosting (1 deal, single data point, Low confidence)

Usage:
    python scripts/seed_memory.py
"""
import sys
import os

# Set UTF-8 encoding for standard output on Windows
if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

# Ensure app package is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.memory import retain_negotiation
from app import store

MICROSOFT_NEGOTIATIONS = [
    {
        "vendor": "Microsoft",
        "logged_by": "Aarav Kumar",
        "department": "Procurement",
        "date": "2025-10-15",
        "discount_pct": 12,
        "payment_terms_days": 30,
        "flexible_terms": ["contract_duration"],
        "firm_terms": ["liability_clause"],
        "tactic": "Asked for discount before discussing contract length",
        "tactic_worked": True,
        "notes": "Early cycle contract. Microsoft moved on duration but stood firm on liability.",
    },
    {
        "vendor": "Microsoft",
        "logged_by": "Sarah Chen",
        "department": "IT",
        "date": "2025-11-20",
        "discount_pct": None,
        "payment_terms_days": 60,
        "flexible_terms": ["payment_terms"],
        "firm_terms": ["liability_clause"],
        "tactic": None,
        "tactic_worked": None,
        "notes": "Vendor agreed to 60-day payment schedule without significant resistance.",
    },
    {
        "vendor": "Microsoft",
        "logged_by": "Rahul Mehta",
        "department": "Finance",
        "date": "2025-12-14",
        "discount_pct": 10,
        "payment_terms_days": None,
        "flexible_terms": [],
        "firm_terms": ["liability_clause"],
        "tactic": "Opened with an aggressive lowball first offer",
        "tactic_worked": False,
        "notes": "Aggressive first offer backfired; account rep stalled discussions for two weeks.",
    },
    {
        "vendor": "Microsoft",
        "logged_by": "Priya Shah",
        "department": "Sales Ops",
        "date": "2026-01-18",
        "discount_pct": 20,
        "payment_terms_days": 60,
        "flexible_terms": ["payment_terms", "contract_duration"],
        "firm_terms": ["liability_clause"],
        "tactic": "Asked for discount before discussing contract length",
        "tactic_worked": True,
        "notes": "Peak discount achieved (20%) by anchoring on discount prior to multi-year commitment.",
    },
    {
        "vendor": "Microsoft",
        "logged_by": "Aarav Kumar",
        "department": "Procurement",
        "date": "2026-02-05",
        "discount_pct": 16,
        "payment_terms_days": 60,
        "flexible_terms": ["payment_terms"],
        "firm_terms": ["liability_clause"],
        "tactic": "Asked for discount before discussing contract length",
        "tactic_worked": True,
        "notes": "Confirmed 60-day terms and solid double-digit discount.",
    },
    {
        "vendor": "Microsoft",
        "logged_by": "Sarah Chen",
        "department": "IT",
        "date": "2026-02-28",
        "discount_pct": 15,
        "payment_terms_days": None,
        "flexible_terms": ["contract_duration"],
        "firm_terms": ["liability_clause"],
        "tactic": "Opened with an aggressive lowball first offer",
        "tactic_worked": False,
        "notes": "Second instance of aggressive opening offer causing friction.",
    },
    {
        "vendor": "Microsoft",
        "logged_by": "Rahul Mehta",
        "department": "Finance",
        "date": "2026-03-12",
        "discount_pct": 18,
        "payment_terms_days": 60,
        "flexible_terms": ["payment_terms", "contract_duration"],
        "firm_terms": ["liability_clause"],
        "tactic": "Asked for discount before discussing contract length",
        "tactic_worked": True,
        "notes": "Solid agreement. Liability clause remains completely non-negotiable.",
    },
    {
        "vendor": "Microsoft",
        "logged_by": "Priya Shah",
        "department": "Sales Ops",
        "date": "2026-04-01",
        "discount_pct": 17,
        "payment_terms_days": 60,
        "flexible_terms": ["payment_terms"],
        "firm_terms": ["liability_clause"],
        "tactic": "Asked for discount before discussing contract length",
        "tactic_worked": True,
        "notes": "Eighth negotiation. 60-day terms confirmed as standard repeatable benchmark.",
    },
]

APEX_LOGISTICS_NEGOTIATIONS = [
    {
        "vendor": "Apex Logistics",
        "logged_by": "Vikram Sen",
        "department": "Operations",
        "date": "2026-01-10",
        "discount_pct": 8,
        "payment_terms_days": 30,
        "flexible_terms": ["volume_commitments"],
        "firm_terms": ["fuel_surcharge_clause"],
        "tactic": "Offered multi-region consolidation",
        "tactic_worked": True,
        "notes": "Initial engagement for nationwide freight.",
    },
    {
        "vendor": "Apex Logistics",
        "logged_by": "Ananya Joshi",
        "department": "Supply Chain",
        "date": "2026-02-15",
        "discount_pct": 12,
        "payment_terms_days": 45,
        "flexible_terms": ["volume_commitments", "payment_terms"],
        "firm_terms": ["fuel_surcharge_clause"],
        "tactic": "Offered multi-region consolidation",
        "tactic_worked": True,
        "notes": "Consolidation tactic worked again; moved payment terms to 45 days.",
    },
    {
        "vendor": "Apex Logistics",
        "logged_by": "Vikram Sen",
        "department": "Operations",
        "date": "2026-03-20",
        "discount_pct": 10,
        "payment_terms_days": 45,
        "flexible_terms": ["payment_terms"],
        "firm_terms": ["fuel_surcharge_clause"],
        "tactic": "Requested complete waiver of fuel surcharge",
        "tactic_worked": False,
        "notes": "Vendor outright refused to drop the fuel surcharge clause.",
    },
]

NOVACLOUD_NEGOTIATIONS = [
    {
        "vendor": "NovaCloud Hosting",
        "logged_by": "Devika Nair",
        "department": "Engineering",
        "date": "2026-03-05",
        "discount_pct": 5,
        "payment_terms_days": 30,
        "flexible_terms": ["trial_credits"],
        "firm_terms": ["uptime_sla_exclusions"],
        "tactic": "Requested startup discount tier",
        "tactic_worked": True,
        "notes": "First and only negotiation. Got small 5% credit on annual upfront commitment.",
    },
]


def seed_all():
    print("=" * 60)
    print("SEEDING LEVERAGE HINDSIGHT SHARED MEMORY")
    print("=" * 60)

    store.init_db()

    all_vendors = [
        ("Microsoft", MICROSOFT_NEGOTIATIONS, "High"),
        ("Apex Logistics", APEX_LOGISTICS_NEGOTIATIONS, "Medium"),
        ("NovaCloud Hosting", NOVACLOUD_NEGOTIATIONS, "Low"),
    ]

    for vendor_name, negotiations, expected_conf in all_vendors:
        print(f"\n[+] Seeding vendor '{vendor_name}' ({len(negotiations)} deals, Target: {expected_conf} Confidence)...")
        for deal in negotiations:
            bank_id = retain_negotiation(**deal)
            vendor_slug = bank_id.removeprefix("vendor-")
            store.record_negotiation(
                vendor=deal["vendor"],
                vendor_slug=vendor_slug,
                logged_by=deal["logged_by"],
                department=deal["department"],
            )
            pct_str = f"{deal['discount_pct']}%" if deal["discount_pct"] else "N/A"
            terms_str = f"{deal['payment_terms_days']}d" if deal["payment_terms_days"] else "N/A"
            print(f"    - Retained: {deal['logged_by']} ({deal['department']}) | Discount: {pct_str} | Terms: {terms_str}")

    print("\n" + "=" * 60)
    print("SUCCESS: Memory layer seeded across 3 vendors.")
    print("=" * 60)


if __name__ == "__main__":
    seed_all()
