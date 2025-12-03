# Implementation Plan - Practice UI Refactor

## Goal
Refactor the Practice screen to support the new XP/Mastery system, specifically enabling Skill selection, Difficulty selection, and integration with the new Question Generator.

## Proposed Changes

### 1. Update `app/(tabs)/practice.tsx`

#### State & Types
- Update `difficulty` state to use uppercase `EASY` | `MEDIUM` | `HARD` to match backend.
- Add `SKILLS` constant mapping IDs to codes/names (e.g., `SUBSTITUTION`).

#### Config Stage (UI)
- Replace "Category 1, 2..." buttons with a list of Skills:
  - Substitution
  - Integration by Parts
  - Trig Integrals
  - etc.
- Ensure Difficulty selection sets the uppercase value.

#### Start Practice Logic
- Update `startPractice` to:
  - Check if the selected skill is `SUBSTITUTION`.
  - If so, use `QuestionGenerator.generateEasySubstitutionQuestion()` (looping `setSize` times) to create the problem set.
  - *Note:* The generator currently only does EASY. For MVP, we might just use it regardless of difficulty selected, or warn. The user said "simplest template working", so we'll just use the generator for Substitution.
  - Map the generated question to the `Problem` type expected by the UI.

#### Solving Stage (UI)
- Add a "Quit / Back" button in the header to return to `config` stage.
- Update `handleAnswer` to use `PracticeService.recordAttempt`.

#### Summary Stage
- Update to use `PracticeService.applyAssignmentCompletionBonus`.

## Verification
- Run the app.
- Select "Substitution" -> "Easy".
- Verify questions appear (generated).
- Verify "Quit" button works.
- Verify completion updates XP.
