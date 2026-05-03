# Deferred Issues

## ISSUE-QA-005: No `lint` script exists

Reason deferred:
- This is a project quality gate gap, not a product defect. Adding ESLint or equivalent would require choosing lint rules and possibly creating a larger style cleanup outside this remediation scope.

Risk:
- Common formatting, accessibility, and import mistakes can land without CI feedback.

Recommended next step:
- Add a repo-standard lint setup and run it in CI after agreeing on rules.

Blocking dependency:
- Team decision on lint rules and formatter integration.

Testing requirements:
- `npm run lint` should become a required CI command.

## ISSUE-QA-006: No default `test` script exists

Reason deferred:
- The repo did not have a pre-existing unit test runner. I added Playwright and fuzz scripts for this review, but did not redefine the conventional `npm test` script to avoid changing developer workflow unexpectedly.

Risk:
- Developers may run `npm test` and assume the repo has no tests or that tests are broken.

Recommended next step:
- Decide whether `npm test` should call `npm run test:e2e`, a future unit suite, or both.

Blocking dependency:
- Project-level CI/test strategy.

Testing requirements:
- Once defined, `npm test` should be included in CI and documented.

## ISSUE-QA-007: Build still reports unused default React import warnings

Reason deferred:
- The warning is non-blocking and outside the confirmed security/accessibility/reliability fixes. Removing unused imports across the app is a safe follow-up cleanup but was not needed for the critical remediation.

Risk:
- Build warnings can hide more important future warnings.

Recommended next step:
- Remove unused default React imports reported during `npm run build`.

Blocking dependency:
- None.

Testing requirements:
- `npm run build` should complete with no warning output after cleanup.

