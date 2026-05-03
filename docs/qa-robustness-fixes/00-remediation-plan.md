# QA Robustness Fixes - Remediation Plan

Branch: `qa-robustness-fixes`

## Source material

The expected QA report files under `docs/qa-robustness-review/` were not present. The available review output was the interrupted Playwright/audit artifact set under `test-artifacts/break-the-app/`, plus the QA harness files that had been generated in the working tree.

I used only concrete evidence from those artifacts:

- `test-artifacts/break-the-app/logs/baseline-npm-audit.json`
- `test-artifacts/break-the-app/logs/playwright-full-rerun.log`
- `test-artifacts/break-the-app/logs/warnings-edge-rerun.log`
- `test-artifacts/break-the-app/logs/axe-*.json`
- Playwright traces/screenshots/videos from the failed runs

## Scope

Remediation focused on confirmed issues with direct evidence:

1. Critical dependency vulnerabilities reported by `npm audit`.
2. Critical/serious axe failures caused by unlabeled range/select controls and an invalid ARIA attribute on the visual light indicator.
3. Word-search regeneration not reliably changing the generated board.
4. QA harness path/collision issues that prevented reliable regression verification.

No product bugs were invented beyond those evidenced by artifacts. Missing lint/unit scripts and remaining build warnings are documented as deferred/non-blocking gaps.

## Strategy

- Fix dependency risk at the package layer.
- Fix accessibility at the reusable control/component level where possible.
- Add/keep Playwright and axe regression coverage in the project.
- Preserve existing UI design, route names, and product behavior.
- Avoid broad rewrites.

