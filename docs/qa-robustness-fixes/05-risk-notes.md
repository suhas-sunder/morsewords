# Risk Notes

## Dependency update risk

React Router and supporting build dependencies were updated to clear critical/high audit findings. Typecheck, build, and the full browser suite pass, but dependency updates should still receive normal release verification in staging.

## Test runtime

The full Playwright suite is intentionally broad and currently takes about 8 minutes locally. For CI, consider splitting smoke, accessibility, edge, and fuzz checks into separate jobs.

## Missing original issue log

The expected `docs/qa-robustness-review/02-issue-log.md` and `issue-log.json` files were not present. This remediation therefore used the available logs/artifacts instead of a completed formal issue report.

## Deferred quality gates

`npm run lint` and `npm test` are missing. The new scripts are `test:e2e` and `test:fuzz`; adopt or alias them in CI intentionally.

