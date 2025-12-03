# Task: Implement Advanced XP and Mastery System

## Status
- [ ] Design Data Schema and Core Logic <!-- id: 0 -->
    - [ ] Create `implementation_plan.md` with detailed schema and function specs <!-- id: 1 -->
- [x] Implement Data Schema (SQLite) <!-- id: 2 -->
    - [x] Update `DatabaseManager.ts` to include new tables (`skills`, `user_skills`, `templates`, `assignments`, `assignment_questions`, `attempts`) <!-- id: 3 -->
    - [x] Create migration/seed logic for initial skills <!-- id: 4 -->
- [x] Implement Core Logic Services <!-- id: 5 -->
    - [x] Create/Update `XPCalculator.ts` with new rules (hints, attempts, bonuses) <!-- id: 6 -->
    - [x] Create `MasteryService.ts` (or update `ProgressTracker`) for `recompute_mastery` logic <!-- id: 7 -->
    - [x] Implement `apply_assignment_completion_bonus` <!-- id: 8 -->
- [x] Implement Question Generators <!-- id: 13 -->
    - [x] Port Python generators to `src/services/QuestionGenerator.ts` <!-- id: 14 -->
- [x] Refactor Practice UI <!-- id: 15 -->
    - [x] Implement Skill Selection & Difficulty <!-- id: 16 -->
    - [x] Integrate Question Generator <!-- id: 17 -->
    - [x] Add Quit Button <!-- id: 18 -->
- [/] Verification <!-- id: 9 -->
    - [/] Verify schema creation <!-- id: 10 -->
    - [ ] Verify XP calculation logic <!-- id: 11 -->
    - [ ] Verify Mastery state transitions <!-- id: 12 -->
