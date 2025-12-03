# XP & Mastery System Critique

## 1. Analysis: Potential Problems & Edge Cases

### A. The "Volume" Loophole (Grinding Easy)
**Issue:** In the current design, the "Volume Bucket" (400 MP) and "Accuracy Bucket" (200 MP) can be largely filled using only Easy questions.
*   *Scenario:* A student does 80 Easy questions correctly.
    *   Volume: 400 MP (Maxed)
    *   Difficulty: 100 MP (Max for Easy)
    *   Accuracy: 200 MP (100%)
    *   **Total:** 700 MP -> **"Proficient"** status.
*   *Problem:* A student is labeled "Proficient" without ever attempting a Medium or Hard problem. This is misleading for Calculus 2.

### B. Time Estimation Optimism
**Issue:** The "Large" assignment (7 questions: 2 Easy, 3 Medium, 2 Hard) is estimated at 25–35 minutes.
*   *Reality:* A "Hard" Trig Substitution or Integration by Parts problem often takes 8–12 minutes *alone* for a learner.
*   *Math:* 2*(2m) + 3*(5m) + 2*(10m) = 4 + 15 + 20 = **39 minutes** of *perfect* execution. With thinking time and mistakes, this is easily a 50-60 minute session.
*   *Risk:* Students will feel exhausted or quit mid-assignment, leading to low completion rates.

### C. The "Exam-Ready" Cliff
**Issue:** To jump from "Proficient" (61-85%) to "Exam-Ready" (>85%), the student needs significant points in the "Difficulty Bucket".
*   *Problem:* If the Difficulty Bucket is the *only* way to bridge that gap, students who are slow but accurate on Medium problems will hit a hard ceiling at ~75-80%. They might feel stuck despite putting in work.

---

## 2. Adjusted System

### A. Adjusted XP Values
Increase the reward for Hard problems to better match the time investment.
*   **Easy:** 10 XP (Unchanged)
*   **Medium:** 25 XP -> **30 XP**
*   **Hard:** 60 XP -> **80 XP** (High reward for the 10-15 min effort)

### B. Adjusted Assignment Templates
Shrink the "Large" assignment to keep it within a manageable session (30-40 mins).

*   **Small (Quick Check):** 3 Questions (2 Easy, 1 Medium). ~8 mins.
*   **Medium (Standard):** 4 Questions (1 Easy, 2 Medium, 1 Hard). ~20 mins.
*   **Large (Deep Dive):** **5 Questions** (1 Easy, 3 Medium, 1 Hard). ~35 mins.
    *   *Note:* We removed one Hard and one Easy question to make it realistic.

### C. Refined Mastery Logic ("Tiered Buckets")
Fix the "Volume Loophole" by capping how much volume can come from low-tier questions.

**New Mastery Formula (Max 1000 MP):**

1.  **Tiered Volume (Max 400 MP):**
    *   Points from Easy Qs: Capped at **100 MP**.
    *   Points from Medium Qs: Capped at **200 MP**.
    *   Points from Hard Qs: Capped at **100 MP**.
    *   *Result:* You cannot max out Volume with just Easy questions. You *must* do Medium/Hard to fill this bucket.

2.  **Difficulty Capability (Max 400 MP):** (Unchanged, requires correct answers)
    *   Easy Mastery: Max 50 MP
    *   Medium Mastery: Max 150 MP
    *   Hard Mastery: Max 200 MP

3.  **Recent Accuracy (Max 200 MP):** (Unchanged)

---

## 3. Implementation Stages

### Stage 1: Minimal Viable Version (MVP)
*Goal: Get it running next week. No complex buckets.*

*   **Data:** Store `xp_total` and `counts_by_difficulty` (e.g., `{ easy: 10, medium: 5, hard: 0 }`).
*   **Mastery Score (0-100):** A simple weighted count.
    *   `Score = (Easy_Count * 1) + (Med_Count * 3) + (Hard_Count * 5)`
    *   *Thresholds:*
        *   Novice: 0-15 pts
        *   Developing: 16-50 pts
        *   Proficient: 51-100 pts
        *   Exam-Ready: >100 pts AND at least 3 Hard problems correct.
*   **XP:** Flat values (10/30/80). No bonuses/penalties yet.

### Stage 2: Full Version (The "Adjusted System")
*Goal: Nuanced tracking after 1 month of data.*

*   Implement the **Tiered Bucket** logic.
*   Add **Assignment Completion Bonuses**.
*   Add **Hint Penalties**.
*   Add **Decay** (optional): If `last_practiced > 2 weeks`, reduce Accuracy bucket by 50%.

---

## 4. Metrics to Track (Day 1 Analytics)

1.  **Average Time per Difficulty:**
    *   *Why:* Validate our "Medium = 5 mins" assumption. If Medium takes 10 mins, we need to adjust assignment sizes immediately.
2.  **Assignment Abandonment Rate:**
    *   *Why:* If >20% of users quit "Large" assignments, they are too long.
3.  **"Hard" Success Rate:**
    *   *Why:* If <10%, our "Hard" questions might be unfair/confusing. If >60%, they aren't hard enough.
4.  **XP Velocity:**
    *   *Why:* Track how much XP an active user earns per hour. Helps tune the "Level Up" curve later.
