# Implementation Plan - Advanced XP & Mastery System

## Goal
Implement a production-ready data schema and core logic for the Calculus II integral practice app, supporting Skills, Assignments, XP, and Mastery.

## Tech Stack
- **Language:** TypeScript
- **Database:** SQLite (via `expo-sqlite`, existing in project)
- **Architecture:** Service-based (Logic in `src/services`, Data in `src/database`)

## 1. Data Schema Changes (`src/database/DatabaseManager.ts`)

We will create/update the following tables. Note: We will use `IF NOT EXISTS` but for a clean implementation of this major upgrade, we might need to drop existing incompatible tables or migrate them. Given this is dev, we will likely add new tables and deprecate old ones or reset.

### New Tables
1.  **`skills`** (Replaces `categories` eventually, or maps to it)
    - `id` (TEXT/PK) - e.g., 'INTEGRATION_BY_PARTS'
    - `name` (TEXT)
    - `description` (TEXT)

2.  **`user_skills`** (Tracks mastery)
    - `user_id` (INTEGER)
    - `skill_id` (TEXT FK)
    - `total_attempts` (INTEGER)
    - `total_correct` (INTEGER)
    - `total_xp` (INTEGER)
    - `mastery_state` (TEXT) - 'learning', 'proficient', 'exam_ready'
    - `last_practiced_at` (TIMESTAMP)

3.  **`templates`** (Question definitions)
    - `id` (TEXT/PK)
    - `skill_id` (TEXT FK)
    - `base_difficulty` (TEXT) - 'EASY', 'MEDIUM', 'HARD'
    - `param_spec` (JSON)

4.  **`assignments`**
    - `id` (INTEGER PK)
    - `skill_id` (TEXT FK)
    - `size` (TEXT) - 'SMALL', 'MEDIUM', 'LARGE'
    - `status` (TEXT) - 'in_progress', 'completed'
    - `created_at` (TIMESTAMP)
    - `completed_at` (TIMESTAMP)

5.  **`attempts`** (Replaces `problem_history`)
    - `id` (INTEGER PK)
    - `skill_id` (TEXT FK)
    - `difficulty` (TEXT)
    - `is_correct` (BOOLEAN)
    - `num_attempts` (INTEGER)
    - `hints_used` (INTEGER)
    - `xp_earned` (INTEGER)
    - `created_at` (TIMESTAMP)

## 2. Core Logic Implementation

### `src/services/XPCalculator.ts`
- **Update `calculateProblemXP`**:
    - Base: Easy=10, Medium=20, Hard=35
    - Modifiers:
        - Hints used: `0.7 * Base`
        - Multiple attempts (no hints): `0.5 * Base`
        - First try (no hints): `1.0 * Base`
- **Implement `getAssignmentBonus(size)`**:
    - Small: +10, Medium: +25, Large: +40

### `src/services/MasteryService.ts` (New)
- **`recomputeMastery(skillId)`**:
    - Fetch last 20 attempts for skill.
    - Calculate:
        - Total attempts (lifetime)
        - Accuracy (last 15 & last 20)
        - Hard question count (last 20) & accuracy
        - Recency
    - Determine state:
        - **Exam-Ready:** >30 attempts, >80% acc (last 20), >4 Hard (last 20) w/ >70% acc, practiced <7 days.
        - **Proficient:** >20 attempts, >75% acc (last 15).
        - **Learning:** Default.
    - Update `user_skills` table.

## 3. Integration
- Update `ProgressTracker` to use `MasteryService` and new tables.

## Verification
- We will verify by inspecting the schema and running a test flow (simulated in code or via UI if possible).
