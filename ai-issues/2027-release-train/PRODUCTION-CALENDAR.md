# 2027 production release calendar

Revised 2026-11-13. These are scheduled decision windows, not automatic deployments. Sundays at **10:00 AM America/Toronto**; local time remains 10:00 across daylight-saving changes. First window: January 3. No contradictory MorseWords calendar was found. No automation created.

W01 rides with W02; W07 rides with W08. The 50 user-facing package windows leave two explicitly unassigned year-end contingency windows; they are not invented W53/W54 features. Unassigned windows are SKIPPED unless an owner selects a separately validated repair. Future proposed packages still require scope approval.

Every row requires a fresh current-main candidate, immutable exact-SHA non-production preview, hosted checks, and explicit owner release decision. Dependency references mean **shipped** or explicitly included and revalidated, not merely present in a review stack. See [procedure](README.md) and [manifest](package-manifest.json).

**S (all rows):** skip a blocked package; no automatic payload doubling, future-code borrowing, or bypassing blocked dependencies. Reschedule explicitly after dependency analysis. Emergency main fixes enter through the fresh base.

| Slot | Date | Local time / zone | Reviewed packages | Prerequisite | Fresh candidate | Preview | Owner decision | Status | Blocked behavior |
|---|---|---|---|---|---|---|---|---|---|
| S01 | 2027-01-03 | 10:00 America/Toronto | W01, W02 | W01 included; fresh production verification | `ship/2027-W02-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S02 | 2027-01-10 | 10:00 America/Toronto | W03 | W02 | `ship/2027-W03-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S03 | 2027-01-17 | 10:00 America/Toronto | W04 | W03 | `ship/2027-W04-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S04 | 2027-01-24 | 10:00 America/Toronto | W05 | W04 | `ship/2027-W05-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S05 | 2027-01-31 | 10:00 America/Toronto | W06 | W05 | `ship/2027-W06-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S06 | 2027-02-07 | 10:00 America/Toronto | W07, W08 | W06 shipped; W07 included | `ship/2027-W08-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S07 | 2027-02-14 | 10:00 America/Toronto | W09 | W08, TRANCHE-A-HARDENING | `ship/2027-W09-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S08 | 2027-02-21 | 10:00 America/Toronto | W10 | W09 | `ship/2027-W10-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S09 | 2027-02-28 | 10:00 America/Toronto | W11 | W10 | `ship/2027-W11-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S10 | 2027-03-07 | 10:00 America/Toronto | W12 | W11 | `ship/2027-W12-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S11 | 2027-03-14 | 10:00 America/Toronto | W13 | W12 | `ship/2027-W13-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S12 | 2027-03-21 | 10:00 America/Toronto | W14 | W12, W13 | `ship/2027-W14-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S13 | 2027-03-28 | 10:00 America/Toronto | W15 | W03, W12, W14 | `ship/2027-W15-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S14 | 2027-04-04 | 10:00 America/Toronto | W16 | W09, W10, W11, W12, W13, W14, W15 | `ship/2027-W16-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S15 | 2027-04-11 | 10:00 America/Toronto | W17 | W16 | `ship/2027-W17-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S16 | 2027-04-18 | 10:00 America/Toronto | W18 | W17 | `ship/2027-W18-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S17 | 2027-04-25 | 10:00 America/Toronto | W19 | W18 | `ship/2027-W19-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S18 | 2027-05-02 | 10:00 America/Toronto | W20 | W19 | `ship/2027-W20-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S19 | 2027-05-09 | 10:00 America/Toronto | W21 | W20 | `ship/2027-W21-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S20 | 2027-05-16 | 10:00 America/Toronto | W22 | W21 | `ship/2027-W22-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S21 | 2027-05-23 | 10:00 America/Toronto | W23 | W19, W22 | `ship/2027-W23-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S22 | 2027-05-30 | 10:00 America/Toronto | W24 | W17, W23 | `ship/2027-W24-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S23 | 2027-06-06 | 10:00 America/Toronto | W25 | W06, W24 | `ship/2027-W25-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S24 | 2027-06-13 | 10:00 America/Toronto | W26 | W25 | `ship/2027-W26-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S25 | 2027-06-20 | 10:00 America/Toronto | W27 | W26 | `ship/2027-W27-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S26 | 2027-06-27 | 10:00 America/Toronto | W28 | W27 | `ship/2027-W28-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S27 | 2027-07-04 | 10:00 America/Toronto | W29 | W28 | `ship/2027-W29-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S28 | 2027-07-11 | 10:00 America/Toronto | W30 | W04, W29 | `ship/2027-W30-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S29 | 2027-07-18 | 10:00 America/Toronto | W31 | W27, W29 | `ship/2027-W31-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S30 | 2027-07-25 | 10:00 America/Toronto | W32 | W25, W31 | `ship/2027-W32-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S31 | 2027-08-01 | 10:00 America/Toronto | W33 | W07, W32 | `ship/2027-W33-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S32 | 2027-08-08 | 10:00 America/Toronto | W34 | W33 | `ship/2027-W34-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S33 | 2027-08-15 | 10:00 America/Toronto | W35 | W34 | `ship/2027-W35-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S34 | 2027-08-22 | 10:00 America/Toronto | W36 | W08, W35 | `ship/2027-W36-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S35 | 2027-08-29 | 10:00 America/Toronto | W37 | W06, W36 | `ship/2027-W37-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S36 | 2027-09-05 | 10:00 America/Toronto | W38 | W07, W37 | `ship/2027-W38-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S37 | 2027-09-12 | 10:00 America/Toronto | W39 | W38 | `ship/2027-W39-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S38 | 2027-09-19 | 10:00 America/Toronto | W40 | W39 | `ship/2027-W40-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S39 | 2027-09-26 | 10:00 America/Toronto | W41 | W24, W32 | `ship/2027-W41-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S40 | 2027-10-03 | 10:00 America/Toronto | W42 | W41 | `ship/2027-W42-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S41 | 2027-10-10 | 10:00 America/Toronto | W43 | W06, W32 | `ship/2027-W43-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S42 | 2027-10-17 | 10:00 America/Toronto | W44 | W43 | `ship/2027-W44-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S43 | 2027-10-24 | 10:00 America/Toronto | W45 | W32, W43 | `ship/2027-W45-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S44 | 2027-10-31 | 10:00 America/Toronto | W46 | W45 | `ship/2027-W46-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S45 | 2027-11-07 | 10:00 America/Toronto | W47 | W11, W46 | `ship/2027-W47-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S46 | 2027-11-14 | 10:00 America/Toronto | W48 | W47 | `ship/2027-W48-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S47 | 2027-11-21 | 10:00 America/Toronto | W49 | W48 | `ship/2027-W49-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S48 | 2027-11-28 | 10:00 America/Toronto | W50 | W09, W16, W49 | `ship/2027-W50-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S49 | 2027-12-05 | 10:00 America/Toronto | W51 | W50 | `ship/2027-W51-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S50 | 2027-12-12 | 10:00 America/Toronto | W52 | W01, W51 | `ship/2027-W52-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S51 | 2027-12-19 | 10:00 America/Toronto | Unassigned contingency | Owner-selected scope + proven dependencies | `ship/2027-S51-approved-repair` | Required, exact SHA | Required | UNASSIGNED / DEFAULT SKIP | S |
| S52 | 2027-12-26 | 10:00 America/Toronto | Unassigned contingency | Owner-selected scope + proven dependencies | `ship/2027-S52-approved-repair` | Required, exact SHA | Required | UNASSIGNED / DEFAULT SKIP | S |

Each completed row must later link the actual candidate/base SHA, selected original/amendment SHAs, preview ID/URL/checks, owner decision, production deploy SHA/ID and live smoke. Empty fields are not permission to release.
