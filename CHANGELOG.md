# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2025-10-04
### Added
- Auto‑selection of **repeating loops** when they produce higher **q/hr**.
- **3‑cycle preview** for repeat plans when there’s no time budget (better visual of the loop).

### Changed
- **Starting planet enforced** after planning, repeat expansion, and time budgeting (always begins from the selected start).

### Fixed
- Repeat evaluator no longer mutates the provided `start` (no more defaulting to Jago).
- Time‑budget planner now updates the “current” world as legs are added before computing the return.

## [1.2.x] - 2025-09-XX
- Prior UI and planner improvements.

