# XP & Skill System Design for Calculus 2 App

## 1. Skill Taxonomy & States

### Skill Taxonomy
We will use the following core skills (Techniques) for the initial launch. These map directly to the `categories` in your database but focus on the core integration techniques.

1.  **U-Substitution** (The foundational technique)
2.  **Integration by Parts** (Product rule reverse)
3.  **Trigonometric Integrals** (Powers of sin, cos, tan, sec)
4.  **Trigonometric Substitution** (Radicals like $\sqrt{a^2-x^2}$)
5.  **Partial Fractions** (Rational functions)
6.  **Improper Integrals** (Limits at infinity or discontinuities)

*Note: "Basic Antiderivatives" should be treated as a prerequisite check rather than a main skill bar, or folded into the early levels of U-Substitution.*

### Mastery States
Each skill has a mastery level from 0 to 100%, divided into 4 distinct states.

| State | Range | Description | Visual Indicator |
| :--- | :--- | :--- | :--- |
| **Novice** | 0% - 25% | Just started. Has seen the concept but needs basic practice. | Bronze / Empty Bar |
| **Developing** | 26% - 60% | Can solve standard problems but struggles with tricky cases. | Silver / Half Bar |
| **Proficient** | 61% - 85% | Reliable on standard difficulty. Starting to tackle hard problems. | Gold / High Bar |
| **Exam-Ready** | 86% - 100% | Can handle complex, multi-step problems with high accuracy and speed. | Platinum / Full Bar + Glow |

---

## 2. Difficulty & Question Model

### Difficulty Levels

| Level | Est. Time | Characteristics | XP Value |
| :--- | :--- | :--- | :--- |
| **Easy** | 1–2 mins | **Direct application.** One obvious step. No algebraic tricks needed. <br>_Ex: $\int x e^{x^2} dx$ (simple u-sub)_ | **10 XP** |
| **Medium** | 3–6 mins | **Standard exam problem.** May require 2 steps (e.g., rewrite then integrate) or careful algebra. <br>_Ex: $\int x^2 e^x dx$ (requires parts twice)_ | **25 XP** |
| **Hard** | 8–12 mins | **Complex / Synthesis.** Requires clever manipulation, multiple techniques, or heavy algebra. <br>_Ex: $\int e^{2x} \sin(3x) dx$ (cyclic parts) or tricky trig sub._ | **60 XP** |

### Tagging Strategy
**Primary-Skill-Only (Recommended for V1):**
Tag each question with **one** primary skill (e.g., "Integration by Parts").
*Why?* It simplifies the mastery logic significantly. If a problem uses u-sub inside integration by parts, it counts towards "Integration by Parts" mastery because recognizing *when* to use parts is the main challenge.
*Exception:* "Review" assignments can pull questions from multiple pools, but the XP for a specific question still feeds its primary skill.

---

## 3. Assignment Templates

Assignments are "containers" of questions. Completing them provides structure and a completion bonus.

### Small Assignment ("Quick Practice")
*   **Goal:** Maintenance or quick check.
*   **Time:** ~5–10 mins
*   **Structure:**
    *   2 Easy
    *   1 Medium
*   **Total Questions:** 3

### Medium Assignment ("Standard Workout")
*   **Goal:** Core learning and skill building.
*   **Time:** ~15–20 mins
*   **Structure:**
    *   2 Easy (Warm-up)
    *   2 Medium (Core practice)
    *   1 Hard (Challenge)
*   **Total Questions:** 5

### Large Assignment ("Deep Dive")
*   **Goal:** Exam prep or mastering a new topic.
*   **Time:** ~25–35 mins
*   **Structure:**
    *   2 Easy
    *   3 Medium
    *   2 Hard
*   **Total Questions:** 7

---

## 4. XP System

### Base XP
*   **Easy:** 10 XP
*   **Medium:** 25 XP
*   **Hard:** 60 XP

### Modifiers & Bonuses
*   **Assignment Completion Bonus:**
    *   Small: +20 XP
    *   Medium: +50 XP
    *   Large: +100 XP
*   **First Try Bonus:** +10% XP (Encourages careful thinking).
*   **Hint Penalty:** -25% XP per major hint used (capped at -50%).
*   **Retry Penalty:** If a user fails and retries immediately, they earn max 50% of the base XP.

### Example Scenario
**Student takes a Medium Assignment (2 Easy, 2 Medium, 1 Hard):**
1.  Easy 1: Correct (First try) → 10 + 1 = 11 XP
2.  Easy 2: Correct (First try) → 10 + 1 = 11 XP
3.  Medium 1: Correct (1 hint) → 25 * 0.75 = 18.75 (round to 19) XP
4.  Medium 2: Incorrect, then Correct → 25 * 0.5 = 12.5 (round to 13) XP
5.  Hard 1: Correct (First try) → 60 + 6 = 66 XP
6.  **Completion Bonus:** +50 XP

**Total XP:** 11 + 11 + 19 + 13 + 66 + 50 = **170 XP**

---

## 5. Skill Bars & Mastery Calculation

### Internal vs. Display
*   **Internal Score:** 0 to 1000 "Mastery Points" (MP) per skill.
*   **Display:** Mapped to 0–100%.

### Mastery Logic (The "Bucket" System)
To reach "Exam-Ready", a student must fill three buckets:
1.  **Volume Bucket (Max 400 MP):** Simply doing problems.
    *   +5 MP per problem attempted (capped at 80 problems).
2.  **Difficulty Bucket (Max 400 MP):** Proving capability at higher tiers.
    *   Earn MP only for *correct* answers.
    *   Easy: +2 MP (Max 100 MP)
    *   Medium: +10 MP (Max 150 MP)
    *   Hard: +20 MP (Max 150 MP)
3.  **Accuracy/Recency Modifier (Max 200 MP):**
    *   Based on the last 10 attempts in this skill.
    *   Rolling average accuracy * 200.
    *   *Example:* 8/10 correct = 0.8 * 200 = 160 MP.

### "Completion" Criteria (Exam-Ready)
To reach >850 MP (Exam-Ready), a student effectively needs:
*   ~30+ problems attempted.
*   Success on at least ~5 Hard and ~10 Medium problems.
*   Recent accuracy > 80%.

### Pseudo-Algorithm
```typescript
function calculateMastery(skillId: string, history: ProblemAttempt[]): number {
  // 1. Volume Score
  const volumeScore = Math.min(400, history.length * 5);

  // 2. Difficulty Score
  let easyScore = 0, mediumScore = 0, hardScore = 0;
  for (const attempt of history) {
    if (!attempt.isCorrect) continue;
    if (attempt.difficulty === 'easy') easyScore += 2;
    if (attempt.difficulty === 'medium') mediumScore += 10;
    if (attempt.difficulty === 'hard') hardScore += 20;
  }
  const difficultyScore = Math.min(100, easyScore) + 
                          Math.min(150, mediumScore) + 
                          Math.min(150, hardScore);

  // 3. Accuracy Score (Last 10)
  const recent = history.slice(-10);
  const correctCount = recent.filter(a => a.isCorrect).length;
  const accuracyScore = (recent.length > 0) ? (correctCount / recent.length) * 200 : 0;

  return volumeScore + difficultyScore + accuracyScore; // Max 1000
}
```

---

## 6. Data Model / Implementation Sketch

You can extend your existing SQLite schema.

### New/Updated Tables

**1. `assignments`** (Templates for assignments)
```sql
CREATE TABLE assignments (
  id INTEGER PRIMARY KEY,
  name TEXT, -- e.g., "Integration by Parts - Warmup"
  difficulty_tier TEXT, -- 'small', 'medium', 'large'
  skill_id INTEGER, -- Primary skill focus
  structure_json JSON -- { "easy": 2, "medium": 1 }
);
```

**2. `assignment_history`** (Tracking completed assignments)
```sql
CREATE TABLE assignment_history (
  id INTEGER PRIMARY KEY,
  assignment_id INTEGER,
  user_id INTEGER,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  xp_earned INTEGER,
  questions_correct INTEGER,
  questions_total INTEGER
);
```

**3. `user_skill_mastery`** (Snapshot of mastery to avoid re-calculating every time)
```sql
CREATE TABLE user_skill_mastery (
  user_id INTEGER,
  skill_id INTEGER,
  current_mastery_points INTEGER, -- 0-1000
  last_updated TIMESTAMP,
  PRIMARY KEY (user_id, skill_id)
);
```

### Integration Flow
1.  **User starts Assignment:** Create entry in `assignment_history` (status: in-progress).
2.  **User answers Question:**
    *   Record in `problem_history` (existing).
    *   Calculate XP (Base + Bonuses).
    *   Update `user_profile.total_xp`.
    *   *Async/Background:* Recalculate `user_skill_mastery` for that skill using the algorithm above.
3.  **User finishes Assignment:**
    *   Update `assignment_history` with completion time and stats.
    *   Award "Assignment Bonus" XP.

---

## 7. Progression Tuning & Future Extensions

### Tuning Knobs
*   **XP Inflation:** If users level up too fast, increase the XP required per user level (e.g., Level 1 = 1000 XP, Level 2 = 2500 XP).
*   **Mastery Decay:** In V2, introduce a "decay" where the Accuracy Score drops if the student hasn't practiced a skill in >1 week.
*   **Gatekeeping:** Require "Proficient" status in *Substitution* before unlocking *Integration by Parts*.

### Future Hooks
*   **Gamification:** The `assignment_history` table is perfect for "Streaks" (assignments per day) and "Achievements" (e.g., "Perfect Score on Large Assignment").
*   **Adaptive Learning:** Later, replace static `assignments` with a dynamic generator that looks at `user_skill_mastery` and picks questions from the buckets where the user is weak (e.g., "User has low Hard Score, give more Hard problems").

---

## 8. Validation & Open Questions

### Validation Plan
1.  **Learning Check:** Are students reaching "Exam-Ready" but still failing Hard problems? -> *Adjust Difficulty Bucket weights.*
2.  **UX Check:** Do students quit during "Large" assignments? -> *Check average completion time in `assignment_history`. If >40 mins, reduce question count.*

### Questions for You (To refine V2)
1.  **Session Length:** Do you expect students to use this on the bus (5 min) or in the library (1 hour)? *If bus, we prioritize Small assignments.*
2.  **Failure Tolerance:** How punishing should we be? Is getting a question wrong a "learning moment" (high retry XP) or a "test failure" (low retry XP)?
3.  **Content Volume:** Do you have enough "Hard" questions to support the 150 MP cap? (Need at least ~8 unique hard questions per skill).
4.  **Prerequisites:** Should we strictly enforce "Learn A before B"? Or let them explore?
