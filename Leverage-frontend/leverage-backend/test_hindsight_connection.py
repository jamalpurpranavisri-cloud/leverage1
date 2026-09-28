"""
Run this BEFORE building or testing anything else.

It confirms your Hindsight API key works and that retain -> recall ->
reflect behave as expected, using a throwaway test vendor bank. Only once
this prints a sensible JSON brief at the end should you trust the rest of
the app's Hindsight integration.

Usage:
    python test_hindsight_connection.py
"""
import json
import sys

# Set UTF-8 encoding for standard output on Windows
if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

from app import hindsight_service as hs

TEST_VENDOR = "TestVendorCo"


def main():
    print(f"1) Retaining 3 fake negotiations for '{TEST_VENDOR}'...")
    hs.retain_negotiation(
        vendor=TEST_VENDOR, logged_by="Test Employee A", department="Procurement",
        date="2026-01-10", discount_pct=15, payment_terms_days=None,
        flexible_terms=["contract_duration"], firm_terms=["liability_clause"],
        tactic="Asked for a pilot period before committing", tactic_worked=True,
        notes=None,
    )
    hs.retain_negotiation(
        vendor=TEST_VENDOR, logged_by="Test Employee B", department="IT",
        date="2026-02-14", discount_pct=None, payment_terms_days=45,
        flexible_terms=["payment_terms"], firm_terms=["liability_clause"],
        tactic="Opened with an aggressive lowball offer", tactic_worked=False,
        notes=None,
    )
    hs.retain_negotiation(
        vendor=TEST_VENDOR, logged_by="Test Employee C", department="Finance",
        date="2026-03-02", discount_pct=20, payment_terms_days=45,
        flexible_terms=["payment_terms", "contract_duration"], firm_terms=["liability_clause"],
        tactic="Asked for discount before discussing contract length", tactic_worked=True,
        notes=None,
    )
    print("   done.\n")

    print("2) Calling recall() for raw evidence...")
    memories = hs.recall_vendor_context(TEST_VENDOR, "What discounts has this vendor given?")
    for m in memories:
        print(f"   - {m}")
    print()

    print("3) Calling reflect() for the synthesized brief (this is the real test)...")
    brief = hs.reflect_negotiation_brief(TEST_VENDOR)
    print(json.dumps(brief, indent=2))

    print("\n✅ If the JSON above has sensible max_discount_pct, flexible_on,")
    print("   firm_on, worked_tactics, and failed_tactics values, the core")
    print("   integration works. Build the rest of the app on top of this.")


if __name__ == "__main__":
    main()
