import { dbManager } from '../database/DatabaseManager';
import { Problem } from '../models/types';
import { XPCalculator } from './XPCalculator';

export class ProgressTracker {
    static async recordProblemAttempt(
        problem: Problem,
        timeSpentSeconds: number,
        hintsUsed: number,
        isCorrect: boolean
    ): Promise<{ xpEarned: number; newTotalXP: number }> {
        const xpEarned = XPCalculator.calculateProblemXP(
            problem.difficulty,
            isCorrect,
            1, // numAttempts (default 1 for legacy)
            hintsUsed
        );

        // 1. Record history
        await dbManager.runQuery(
            `INSERT INTO problem_history (problem_id, completed, time_spent_seconds, hints_used, xp_earned)
       VALUES (?, ?, ?, ?, ?)`,
            [problem.id, isCorrect, timeSpentSeconds, hintsUsed, xpEarned]
        );

        if (isCorrect) {
            // 2. Update Category Progress
            await dbManager.runQuery(
                `UPDATE category_progress 
         SET total_xp = total_xp + ?,
             problems_completed = problems_completed + 1,
             problems_attempted = problems_attempted + 1,
             last_practiced = CURRENT_TIMESTAMP
         WHERE category_id = ?`,
                [xpEarned, problem.category_id]
            );

            // 3. Update User Profile
            await dbManager.runQuery(
                `UPDATE user_profile 
         SET total_xp = total_xp + ?,
             last_active_date = CURRENT_DATE
         WHERE id = 1`, // Assuming single user for now
                [xpEarned]
            );

            // 4. Update Mastery Score (MVP)
            await this.updateMastery(problem.category_id);

            // Update accuracy (simplified calculation for now, ideally should recount)
            // For MVP we might just increment counts. 
            // To do it right:
            // We need to fetch current stats to update accuracy correctly or use a complex query.
            // Let's stick to simple increments for now and maybe recalculate accuracy periodically.
        } else {
            // Just update attempted count
            await dbManager.runQuery(
                `UPDATE category_progress 
         SET problems_attempted = problems_attempted + 1,
             last_practiced = CURRENT_TIMESTAMP
         WHERE category_id = ?`,
                [problem.category_id]
            );
        }

        // Get new total XP
        const userProfile = await dbManager.getFirst('SELECT total_xp FROM user_profile WHERE id = 1');
        // @ts-ignore
        const newTotalXP = userProfile?.total_xp || 0;

        return { xpEarned, newTotalXP };
    }

    static async getCategoryProgress(categoryId: number) {
        return await dbManager.getFirst('SELECT * FROM category_progress WHERE category_id = ?', [categoryId]);
    }

    static async getUserProfile() {
        return await dbManager.getFirst('SELECT * FROM user_profile WHERE id = 1');
    }

    static async updateMastery(categoryId: number) {
        // 1. Get counts by difficulty for correct answers
        const results = await dbManager.getAll(
            `SELECT p.difficulty, COUNT(*) as count
             FROM problem_history ph
             JOIN problems p ON ph.problem_id = p.id
             WHERE p.category_id = ? AND ph.completed = 1
             GROUP BY p.difficulty`,
            [categoryId]
        );

        // 2. Calculate Score
        let score = 0;
        for (const row of results as any[]) {
            const count = row.count;
            if (row.difficulty === 'easy') score += count * 1;
            if (row.difficulty === 'medium') score += count * 3;
            if (row.difficulty === 'hard') score += count * 5;
        }

        // 3. Update Category Progress
        await dbManager.runQuery(
            `UPDATE category_progress 
             SET mastery_level = ?
             WHERE category_id = ?`,
            [score, categoryId]
        );
    }
}
