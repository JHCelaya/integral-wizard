# Advanced XP & Mastery System Walkthrough

## Overview
We have implemented a robust data layer and core logic for the XP and Mastery system. This includes new database tables, a mastery calculation service, an XP calculator with advanced rules, and **dynamic question generators**. We have also refactored the **Practice UI** to support these new features.

## 1. Database Schema Changes (`src/database/DatabaseManager.ts`)
We added the following tables to support the new system:
- **`skills`**: Defines the integral techniques (e.g., `INTEGRATION_BY_PARTS`).
- **`user_skills`**: Tracks mastery state (`learning`, `proficient`, `exam_ready`) and stats per user/skill.
- **`templates`**: Defines question families (for future generation).
- **`assignments`**: Tracks assignment sessions.
- **`attempts`**: A detailed log of every question attempt, replacing `problem_history` for new logic.

**Seeding:**
The `skills` table is automatically seeded with the 6 core techniques on startup.

## 2. Core Logic Services

### `src/services/XPCalculator.ts`
Updated to handle the v1 rules:
- **Base XP:** Easy=10, Medium=20, Hard=35.
- **Modifiers:**
  - Hints: 70% of Base.
  - Multiple Attempts: 50% of Base.
- **Assignment Bonuses:** Small=+10, Medium=+25, Large=+40.

### `src/services/MasteryService.ts`
Implements the `recomputeMastery` logic:
- Fetches the last 20 attempts for a skill.
- Calculates accuracy (last 15 & 20), hard question count, and recency.
- **Transitions:**
  - **Exam-Ready:** >30 attempts, >80% acc (last 20), >4 Hard (last 20) w/ >70% acc, practiced <7 days.
  - **Proficient:** >20 attempts, >75% acc (last 15).
  - **Learning:** Default.
- Updates `user_skills` automatically.

### `src/services/PracticeService.ts`
The main entry point for the UI:
- **`recordAttempt(...)`**: Calculates XP, logs the attempt, updates user profile, and triggers mastery recomputation.
- **`applyAssignmentCompletionBonus(...)`**: Awards bonus XP upon assignment completion.

### `src/services/QuestionGenerator.ts`
Generates infinite practice questions for the "Substitution" skill (Easy difficulty).
- **Templates:** S1 (Monomial), S2 (Polynomial), S3 (Linear Power), S4 (Exponential), S5 (Trig).

## 3. UI Changes (`app/(tabs)/practice.tsx`)
The Practice screen has been completely refactored:
- **Skill Selection:** Users now choose from a list of skills (e.g., Substitution) instead of generic categories.
- **Difficulty & Size:** Users can select Difficulty (Easy/Medium/Hard) and Assignment Size (Small/Medium/Large).
- **Integration:**
  - Selecting "Substitution" triggers the `QuestionGenerator` to create a unique problem set.
  - Attempts are recorded via `PracticeService`, updating XP and Mastery in real-time.
  - Completing an assignment awards a bonus based on size.
- **Controls:** Added a "Quit" button (X icon) to exit an assignment mid-progress.

## How to Verify
1.  **Start Practice:**
    - Go to the Practice tab.
    - Select "Substitution".
    - Select "Easy" and "Small".
    - Tap "Start Practice".
2.  **Solve Problems:**
    - Verify that questions are generated (e.g., integrals of polynomials, trig, etc.).
    - Answer correctly/incorrectly.
    - Check that the timer and progress counter work.
3.  **Quit Mid-Session:**
    - Tap the "X" icon in the top left.
    - Confirm "Quit" to return to setup.
4.  **Complete Assignment:**
    - Finish all questions.
    - Verify the Summary screen shows Accuracy and XP Earned (including bonus).
    - Return Home and check if Total XP has increased.
