"""
Seeds the exact "Microsoft" scenario used in the demo script, so the live
brief output matches:

    💰 Previous discount: Up to 20%
    📅 Payment terms: 60 days accepted (3 previous deals)
    📄 Flexible on: Payment terms, contract duration
    🔒 Usually firm on: Liability clause
    ✅ Worked before: Asking for discount before contract length
    ❌ Didn't work: Aggressive first-offer approach
    📊 Confidence: High — based on 8 previous negotiations
    Contributed by: A. Kumar (Procurement), R. Singh (IT),
                    D. Fernandes (Sales-Ops), P. Mehta (Finance)

Run this once before recording the demo or presenting to judges:
    python seed_demo_data.py

Safe to re-run — Hindsight banks accumulate memories, so running this
twice just adds duplicate evidence (won't break the brief, but no need to
run it more than once per environment).
"""
import sys

# Set UTF-8 encoding for standard output on Windows
if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

from app import hindsight_service as hs
from app import store

store.init_db()

MICROSOFT_NEGOTIATIONS = [
    dict(vendor="Microsoft", logged_by="A. Kumar", department="Procurement",
         date="2025-11-03", discount_pct=15, payment_terms_days=None,
         flexible_terms=["contract_duration"], firm_terms=["liability_clause"],
         tactic="Asked for discount before discussing contract length", tactic_worked=True,
         notes="First deal of the cycle, set the pattern others later confirmed."),

    dict(vendor="Microsoft", logged_by="R. Singh", department="IT",
         date="2025-12-11", discount_pct=None, payment_terms_days=60,
         flexible_terms=["payment_terms"], firm_terms=["liability_clause"],
         tactic=None, tactic_worked=None,
         notes="Vendor accepted 60-day payment terms without much pushback."),

    dict(vendor="Microsoft", logged_by="D. Fernandes", department="Sales-Ops",
         date="2026-01-08", discount_pct=20, payment_terms_days=60,
         flexible_terms=["payment_terms", "contract_duration"], firm_terms=["liability_clause"],
         tactic="Asked for discount before discussing contract length", tactic_worked=True,
         notes="Best discount achieved so far, confirms the earlier tactic works."),

    dict(vendor="Microsoft", logged_by="P. Mehta", department="Finance",
         date="2026-01-22", discount_pct=10, payment_terms_days=None,
         flexible_terms=[], firm_terms=["liability_clause"],
         tactic="Opened with an aggressive lowball first offer", tactic_worked=False,
         notes="Vendor pushed back hard and negotiation stalled for a week."),

    dict(vendor="Microsoft", logged_by="A. Kumar", department="Procurement",
         date="2026-02-19", discount_pct=18, payment_terms_days=60,
         flexible_terms=["payment_terms"], firm_terms=["liability_clause"],
         tactic="Asked for discount before discussing contract length", tactic_worked=True,
         notes=None),

    dict(vendor="Microsoft", logged_by="R. Singh", department="IT",
         date="2026-03-05", discount_pct=None, payment_terms_days=60,
         flexible_terms=["payment_terms", "contract_duration"], firm_terms=["liability_clause"],
         tactic=None, tactic_worked=None,
         notes="Third confirmation of 60-day payment terms being standard."),

    dict(vendor="Microsoft", logged_by="D. Fernandes", department="Sales-Ops",
         date="2026-03-21", discount_pct=12, payment_terms_days=None,
         flexible_terms=["contract_duration"], firm_terms=["liability_clause"],
         tactic="Opened with an aggressive lowball first offer", tactic_worked=False,
         notes="Second time this tactic failed with this vendor."),

    dict(vendor="Microsoft", logged_by="P. Mehta", department="Finance",
         date="2026-04-02", discount_pct=17, payment_terms_days=60,
         flexible_terms=["payment_terms", "contract_duration"], firm_terms=["liability_clause"],
         tactic="Asked for discount before discussing contract length", tactic_worked=True,
         notes="Eighth and final negotiation logged for this vendor — high confidence dataset."),
]

# Two smaller vendors to demonstrate Low/Medium confidence states in the
# same demo, proving the confidence label isn't hardcoded to Microsoft.
OTHER_VENDORS = [
    dict(vendor="Zenith Staffing Co", logged_by="N. Rao", department="HR",
         date="2026-02-01", discount_pct=None, payment_terms_days=30,
         flexible_terms=["payment_terms"], firm_terms=["minimum_contract_size"],
         tactic="Requested a shorter trial engagement first", tactic_worked=True,
         notes=None),
    dict(vendor="Zenith Staffing Co", logged_by="S. Bhatt", department="Operations",
         date="2026-03-15", discount_pct=5, payment_terms_days=None,
         flexible_terms=[], firm_terms=["minimum_contract_size"],
         tactic=None, tactic_worked=None, notes=None),

    dict(vendor="CloudCore Systems", logged_by="V. Iyer", department="IT",
         date="2026-01-19", discount_pct=25, payment_terms_days=None,
         flexible_terms=["volume_discount"], firm_terms=["sla_penalty_clause"],
         tactic="Committed to higher usage tier upfront", tactic_worked=True,
         notes=None),
]


def run(clean: bool = True):
    if clean:
        store.clear_db()
        print("  [✓] Reset local index for cold demo state.")
    all_negotiations = MICROSOFT_NEGOTIATIONS + OTHER_VENDORS
    for n in all_negotiations:
        bank_id = hs.retain_negotiation(**n)
        vendor_slug = bank_id.removeprefix("vendor-")
        store.record_negotiation(
            vendor=n["vendor"], vendor_slug=vendor_slug,
            logged_by=n["logged_by"], department=n["department"],
        )
        print(f"  retained: {n['vendor']} — {n['logged_by']} ({n['department']})")

    print(f"\n✅ Seeded {len(all_negotiations)} negotiations across "
          f"{len({n['vendor'] for n in all_negotiations})} vendors.")
    print("   Try: GET /vendors/Microsoft/brief")


if __name__ == "__main__":
    run()
