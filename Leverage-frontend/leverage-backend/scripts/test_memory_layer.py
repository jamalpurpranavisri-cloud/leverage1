"""
Comprehensive Memory Layer Test Suite — Person A (Memory Engine).

Tests:
1. Retain Verification
2. Recall Verification (Semantic Evidence Search)
3. Reflect Verification (Structured Synthesis & Anti-Hallucination)
4. Cross-User Memory Test (Simulating new Employee E benefiting from A, B, C, D)
5. Repeatability Test (5 successive reflections testing semantic stability)
6. Empty Vendor Test (Controlled fallback for unnegotiated vendor)
7. Sparse Vendor Test (Evidence-based Low confidence for 1-deal vendor)

Usage:
    python scripts/test_memory_layer.py
"""
import json
import os
import sys

# UTF-8 stdout configuration for Windows
if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

# Ensure app package is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.memory import retain_negotiation, recall_vendor_context, reflect_negotiation_brief


def run_cross_user_test() -> bool:
    print("\n" + "=" * 70)
    print("TEST 1: CROSS-USER ORGANIZATIONAL MEMORY TEST")
    print("=" * 70)
    test_vendor = "CrossUserTestCorp"

    print(f"Scenario: Four distinct employees from different departments log separate observations for '{test_vendor}':")
    deals = [
        ("Employee A", "Procurement", "2026-01-10", 18, None, ["contract_duration"], [], "Asked for volume tier", True, "Procured core software."),
        ("Employee B", "IT", "2026-01-25", None, 60, ["payment_terms"], [], None, None, "Approved 60-day billing terms."),
        ("Employee C", "Legal", "2026-02-05", None, None, [], ["liability_clause"], None, None, "Vendor adamantly rejected any liability cap changes."),
        ("Employee D", "Sales-Ops", "2026-02-20", 15, None, [], [], "Leveraged competitor pricing", True, "Brought competitor quote to get concession."),
    ]

    for emp, dept, date, disc, terms, flex, firm, tactic, worked, notes in deals:
        retain_negotiation(
            vendor=test_vendor,
            logged_by=emp,
            department=dept,
            date=date,
            discount_pct=disc,
            payment_terms_days=terms,
            flexible_terms=flex,
            firm_terms=firm,
            tactic=tactic,
            tactic_worked=worked,
            notes=notes,
        )
        print(f"  [+] Logged by {emp} ({dept}): discount={disc}%, terms={terms}d, firm={firm}")

    print("\nSimulating Employee E (Brand new hire, 0 prior negotiations):")
    print("Employee E queries: 'Prepare me for negotiating pricing and payment terms with this vendor.'")
    memories = recall_vendor_context(test_vendor, "pricing and payment terms discount history")
    print(f"\nRecall returned {len(memories)} historical memories from shared bank:")
    for m in memories[:3]:
        print(f"  - {m}")

    print("\nEmployee E generates synthesized Negotiation Brief...")
    brief = reflect_negotiation_brief(test_vendor)
    print(json.dumps(brief, indent=2))

    # Verification: Did Employee E benefit from all disparate colleagues?
    has_discount = brief.get("max_discount_pct") is not None
    has_payment = brief.get("payment_terms_note") is not None
    has_firm = "liability" in str(brief.get("firm_on")).lower()

    success = has_discount and has_payment and has_firm
    if success:
        print("\n[PASS] Cross-user memory verified: Disparate inputs from 4 employees were successfully synthesized for a new employee.")
    else:
        print("\n[FAIL] Cross-user memory synthesis was incomplete.")
    return success


def run_recall_test() -> bool:
    print("\n" + "=" * 70)
    print("TEST 2: RECALL SEMANTIC RETRIEVAL TEST (Microsoft)")
    print("=" * 70)

    query = "What tactics have worked or failed when negotiating with Microsoft?"
    print(f"Query: '{query}'")
    results = recall_vendor_context("Microsoft", query, limit=5)

    print(f"Retrieved {len(results)} relevant memories:")
    for idx, memory in enumerate(results, 1):
        print(f"  {idx}. {memory}")

    success = len(results) > 0
    print(f"\n[{'PASS' if success else 'FAIL'}] Recall returned historical evidence across previous deals.")
    return success


def run_reflection_test() -> bool:
    print("\n" + "=" * 70)
    print("TEST 3: STRUCTURED REFLECTION & ANTI-HALLUCINATION TEST (Microsoft)")
    print("=" * 70)

    brief = reflect_negotiation_brief("Microsoft")
    print(json.dumps(brief, indent=2))

    max_disc = brief.get("max_discount_pct")
    terms_note = brief.get("payment_terms_note") or ""
    worked = str(brief.get("worked_tactics", []))
    failed = str(brief.get("failed_tactics", []))
    firm = str(brief.get("firm_on", []))
    conf = brief.get("confidence")

    print("\nValidating against empirical seed ground truth:")
    print(f"  - Max Discount <= 20%: {max_disc} ({max_disc == 20})")
    print(f"  - Payment Terms Note includes '60': {'60' in terms_note}")
    print(f"  - Firm includes liability: {'liability' in firm.lower()}")
    print(f"  - Confidence: {conf} ({conf in ('High', 'Medium')})")

    # Anti-hallucination check: max discount should not be greater than 20%
    no_hallucination = max_disc is not None and max_disc <= 20

    success = (max_disc == 20) and ("60" in terms_note) and ("liability" in firm.lower()) and no_hallucination
    print(f"\n[{'PASS' if success else 'FAIL'}] Reflection correctly synthesized empirical patterns without hallucinations.")
    return success


def run_repeatability_test(runs: int = 5) -> bool:
    print("\n" + "=" * 70)
    print(f"TEST 4: REPEATABILITY & SEMANTIC STABILITY TEST ({runs} Iterations)")
    print("=" * 70)

    discounts = []
    confidences = []
    firm_clauses = []

    for i in range(1, runs + 1):
        print(f"  Running reflection {i}/{runs}...")
        brief = reflect_negotiation_brief("Microsoft")
        discounts.append(brief.get("max_discount_pct"))
        confidences.append(brief.get("confidence"))
        firm_clauses.append("liability" in str(brief.get("firm_on")).lower())

    print("\nStability Summary across iterations:")
    print(f"  - Max Discounts: {discounts}")
    print(f"  - Confidences:   {confidences}")
    print(f"  - Firm Clause Detected: {firm_clauses}")

    # Semantic stability checks
    stable_discount = all(d == 20 for d in discounts)
    stable_confidence = all(c in ("High", "Medium") for c in confidences)
    stable_firm = all(firm_clauses)

    success = stable_discount and stable_confidence and stable_firm
    print(f"\n[{'PASS' if success else 'FAIL'}] Reflection output remained semantically stable across {runs} consecutive runs.")
    return success


def run_empty_and_sparse_tests() -> bool:
    print("\n" + "=" * 70)
    print("TEST 5: EMPTY & SPARSE VENDOR TESTS")
    print("=" * 70)

    # Empty vendor
    print("\n[A] Empty Vendor Test: 'NonExistentVendorXYZ' (0 historical deals)")
    empty_brief = reflect_negotiation_brief("NonExistentVendorXYZ")
    print("Empty brief result:")
    print(json.dumps(empty_brief, indent=2))
    empty_passed = (
        empty_brief.get("max_discount_pct") is None
        and empty_brief.get("confidence") == "Low"
    )
    print(f"  Empty Vendor Test: {'[PASS]' if empty_passed else '[FAIL]'}")

    # Sparse vendor
    print("\n[B] Sparse Vendor Test: 'NovaCloud Hosting' (1 historical deal)")
    sparse_brief = reflect_negotiation_brief("NovaCloud Hosting")
    print("Sparse brief result:")
    print(json.dumps(sparse_brief, indent=2))
    sparse_passed = (
        sparse_brief.get("confidence") == "Low"
        and sparse_brief.get("max_discount_pct") == 5
    )
    print(f"  Sparse Vendor Test (Confidence=Low expected): {'[PASS]' if sparse_passed else '[FAIL]'}")

    return empty_passed and sparse_passed


def main():
    print("*" * 70)
    print("LEVERAGE MEMORY ENGINE (HINDSIGHT) TEST SUITE")
    print("*" * 70)

    results = {}
    results["cross_user"] = run_cross_user_test()
    results["recall"] = run_recall_test()
    results["reflect"] = run_reflection_test()
    results["repeatability"] = run_repeatability_test(runs=5)
    results["empty_and_sparse"] = run_empty_and_sparse_tests()

    print("\n" + "=" * 70)
    print("FINAL TEST RESULTS SUMMARY")
    print("=" * 70)
    all_passed = True
    for test_name, passed in results.items():
        status = "PASSED" if passed else "FAILED"
        print(f"  {test_name.upper():<25}: {status}")
        if not passed:
            all_passed = False

    print("=" * 70)
    if all_passed:
        print("ALL 5 TESTS PASSED SUCCESSFULLY.")
    else:
        print("SOME TESTS FAILED.")
    print("=" * 70)
    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    main()
