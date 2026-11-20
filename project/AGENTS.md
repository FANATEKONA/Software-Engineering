# AGENTS.md

## A. Project overview

Smart Campus Room Availability Checker is a React, TypeScript and Vite demo for checking whether a selected room is free. It uses four fictional rooms, static bookings and a fixed demo clock of 09:00. Availability checks do not create bookings. The app has no backend, database, authentication or live room API. Work in the Assignment #05 copy that contains this file and `package.json`.

## B. Architecture

| Path | Responsibility |
| --- | --- |
| `index.html`, `src/main.tsx` | Load the app, mount React and import global styles. |
| `src/App.tsx` | Own filter, selected room, time form and result state. Coordinate validation and clear stale results. |
| `src/components/` | `RoomFilters` and `RoomList` handle filters and selection. `RoomInfo` and `BookingList` show room details and bookings. `TimeForm` collects times. `ResultCard` presents the outcome. |
| `src/types/` | Domain types `Room` and `Booking` in `room.ts`. |
| `src/data/` | Fictional catalog, per-room bookings and `DEMO_NOW` in `demoData.ts`. |
| `src/lib/` | `roomFilter.ts` validates attendees and matches rooms. `time.ts` parses and formats time. `availability.ts` checks intervals, duration, blocked rooms and overlap. `availabilityMessage.ts` formats result reason codes. |
| `src/test/` | Vitest unit tests and React Testing Library checks that render the real `App` in jsdom. `setup.ts` configures matchers and cleanup. |
| `package.json`, `package-lock.json` | npm scripts, dependency declarations and locked resolutions. |
| `vite.config.ts` | React plugin, `@/` alias to `src/`, and Vitest environment, setup and test discovery. |

`App` builds the matching room list with `matchRooms` and resolves the selected room from that list. On a check, `resolveTimeRequest` converts the form to minutes. `checkAvailability` uses the selected room's bookings and blocked flag. `ResultCard` renders the outcome through `describeAvailability`.

## C. Environment and setup

Run from this project root in an isolated working copy. Task #01 verified Node **24.13.1** and npm **11.10.0**. These are observed versions, with no minimum version established.

| Purpose | Command |
| --- | --- |
| Setup from the existing lockfile | `npm ci` |
| Test suite | `npm test` |
| Type check `src/` through `tsconfig.app.json` | `npm run typecheck` |
| Lint | `npm run lint` |
| Build local `dist/` output | `npm run build` |
| Start the local Vite development server | `npm run dev` |

Inspect scripts before running them. `npm ci` creates `node_modules/` and may access the package registry. Use the development server for local browser checks and keep it bound to loopback. Server startup alone does not verify behavior.

## D. Coding conventions

- Keep domain entities typed in TypeScript. Use the existing domain types and `@/` import alias.
- Prefer pure business logic. Keep validation in `src/lib/`, fixtures in `src/data/` and rendering in UI components. Pass room names and bookings from the selected room.
- Preserve the React and Vite architecture. Keep diffs targeted and avoid unrelated refactoring, hardcoded room names and unnecessary dependencies.

## E. Approved acceptance criteria

| ID | Behavior to preserve |
| --- | --- |
| A5-AC1 | Accept only integer-minute intervals with `0 <= start < end <= 1440` and `start > DEMO_NOW`. Accept 120 minutes when otherwise valid, reject 121, and resolve Until 24:00 to end minute 1440. Give clear invalid-input feedback. |
| A5-AC2 | A blocked room never returns Available and returns Unavailable for an otherwise valid request. Reject overlaps under half-open interval rules and allow touching endpoints. |
| A5-AC3 | Match valid positive whole-number attendee counts by capacity and require all selected equipment. An empty equipment selection adds no restriction. Invalid attendee counts return no matches. |
| A5-AC4 | Use the selected room's bookings and details. Clear stale results on room, filter or time changes, including Until 24:00. Clear incompatible selections without automatically choosing another room. |
| A5-AC5 | Checking, filtering and switching rooms leave bookings unchanged. Show the no-match message for valid filters with no matches and validation feedback for invalid input. Neither state retains a stale selection or result. |

The student approved these criteria on 19 November 2026. Detailed test cases are in Task #01's [Proposed_Acceptance_Criteria.md](../../Proposed_Acceptance_Criteria.md) when the companion evidence is available.

## F. Mandatory verification

Before proposing a code change, inspect the relevant production code and tests, identify affected acceptance criteria and explain the expected behavior. After an approved code change, run targeted checks and then `npm test`, `npm run typecheck`, `npm run lint` and `npm run build`. Record exact commands, exit codes, test pass/fail totals, warnings and any skipped or blocked checks. Claim a pass only after actual execution.

## G. Permission boundaries

- **Allowed without extra approval:** Read non-sensitive source, docs, configuration and package metadata. Analyze code and run the relevant safe local commands above in the isolated copy. Store reports and logs outside protected baseline directories.
- **Requires student approval:** Change application logic, dependencies, lockfiles or acceptance criteria. Apply dependency fixes, perform structural refactoring, delete in-scope project files, create releases or publish code. Approval applies only to the reviewed scope and does not override the prohibitions below.
- **Forbidden:** Read, print or upload real credentials or secrets. Publish private personal information. Deploy to production. Run destructive commands against user files. Force-push or destructively rewrite Git history. Apply unreviewed dependency upgrades or automatically accept AI-generated diffs. Edit historical baseline snapshots, including `baseline/assignment-03/` and `baseline/task-02/`, or alter the preserved Assignment #05 starting export. Invent tests, logs or verification results.

## H. Review gates

1. Investigate the problem.
2. Present evidence and affected criteria.
3. Propose a minimal diff for review.
4. Wait for explicit student approval.
5. Apply only the approved change.
6. Run relevant checks and the required verification suite.
7. Record outcomes and remaining risks.

## I. Read-only risk review

Keep project files unchanged. Propose candidate findings and classify each as **CONFIRMED**, **PLAUSIBLE/UNVERIFIED** or **UNSUPPORTED**. Cite file paths, relevant code and actual command results. Keep logs and reports outside the project being audited. Treat `npm audit` output as advisory matches. Require separate evidence for applicability and exposure. Never invent or run exploits.

## J. Completion reporting

List files inspected and changed, commands actually run, results, limitations and decisions that still require human approval.
