import { dbManager } from '../database/DatabaseManager';
import { XPCalculator } from './XPCalculator';
import { MasteryService, MasteryState } from './MasteryService';

export class PracticeService {

    static async recordAttempt(
        userId: number,
        skillId: string,
        difficulty: 'EASY' | 'MEDIUM' | 'HARD',
        isCorrect: boolean,
        numAttempts: number,
        hintsUsed: number,
        templateId?: string,
        assignmentId?: number,
        questionId?: number
    ): Promise<{ xpEarned: number, newMasteryState: MasteryState }> {

        // 1. Calculate XP
        const xpEarned = XPCalculator.calculateProblemXP(difficulty, isCorrect, numAttempts, hintsUsed);

        // 2. Record Attempt
        await dbManager.runQuery(
            `INSERT INTO attempts (
                user_id, skill_id, difficulty, is_correct, num_attempts, hints_used, 
                xp_earned, template_id, assignment_id, question_id, started_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [userId, skillId, difficulty, isCorrect, numAttempts, hintsUsed, xpEarned, templateId || null, assignmentId || null, questionId || null]
        );

        // 3. Update User Profile Total XP
        await dbManager.runQuery(
            `UPDATE user_profile SET total_xp = total_xp + ?, last_active_date = CURRENT_DATE WHERE id = ?`,
            [xpEarned, userId]
        );

        // 4. Recompute Mastery
        const newMasteryState = await MasteryService.recomputeMastery(userId, skillId);

        return { xpEarned, newMasteryState };
    }

    static async applyAssignmentCompletionBonus(
        userId: number,
        skillId: string,
        size: 'SMALL' | 'MEDIUM' | 'LARGE'
    ): Promise<number> {
        const bonusXP = XPCalculator.getAssignmentBonus(size);

        if (bonusXP > 0) {
            // Update User Profile
            await dbManager.runQuery(
                `UPDATE user_profile SET total_xp = total_xp + ? WHERE id = ?`,
                [bonusXP, userId]
            );

            // Update User Skill XP
            await dbManager.runQuery(
                `UPDATE user_skills SET total_xp = total_xp + ? WHERE user_id = ? AND skill_id = ?`,
                [bonusXP, userId, skillId]
            );
        }

        return bonusXP;
    }
}
