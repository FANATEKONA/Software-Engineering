# Software Engineering — Assignment #05

Assignment #05 builds on the **Smart Campus Room Availability Checker**, a React and TypeScript application originally developed for Assignment #04.

## Assignment #05 work

- Added [`AGENTS.md`](project/AGENTS.md) with repository instructions, verification commands, operating boundaries, and human approval gates.
- Applied a focused refactoring to derive the demo clock banner from the existing clock value and time formatter.
- Reviewed AI-suggested risks against the source and test evidence, then evaluated and prioritized them in a Risk Register.
- Audited agent readiness and assessed the repository as **Level 2 — Documented**.
- Verified two mitigations. **R01** added regression checks for clearing stale results after changes to End time or Until 24:00. **R05** corrected attendee-count validation to reject values outside the positive safe-integer range.
- Designed safeguards for a hypothetical background agent, including scope limits, human review, and rollback.
- Recorded a **CONDITIONAL** release recommendation for a local educational demonstration, subject to verification and human approval.

**Recorded final verification: 53/53 tests passed.**

## Repository contents

- [`project/`](project/) contains the verified final source code and tests.
- [`baseline/`](baseline/) contains the preserved Assignment #04 export used as the Assignment #05 starting baseline.

[`project/README.md`](project/README.md) is the preserved Assignment #04 documentation. Its 42-test count is the historical documentation discrepancy recorded as **R09**. The final Assignment #05 result is **53/53**.
