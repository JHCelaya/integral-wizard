import { dbManager } from '../database/DatabaseManager';

export type MasteryState = 'learning' | 'proficient' | 'exam_ready';

export class MasteryService {
    static async recomputeMastery(userId: number, skillId: string): Promise<MasteryState> {
        // 1. Fetch stats
        const totalAttemptsResult = await dbManager.getFirst(
            `SELECT COUNT(*) as count FROM attempts WHERE user_id = ? AND skill_id = ?`,
            [userId, skillId]
        );
        // @ts-ignore
        const totalAttempts = totalAttemptsResult?.count || 0;

        // Fetch last 20 attempts ordered by date desc
        const last20Attempts = await dbManager.getAll(
            `SELECT * FROM attempts 
             WHERE user_id = ? AND skill_id = ? 
             ORDER BY completed_at DESC 
             LIMIT 20`,
            [userId, skillId]
        );

        // 2. Calculate Metrics
        const attempts = last20Attempts as any[];
        const last15 = attempts.slice(0, 15);

        const calcAccuracy = (atts: any[]) => {
            if (atts.length === 0) return 0;
            const correct = atts.filter(a => a.is_correct).length;
            return correct / atts.length;
        };

        const accLast20 = calcAccuracy(attempts);
        const accLast15 = calcAccuracy(last15);

        const hardAttemptsLast20 = attempts.filter(a => a.difficulty === 'HARD');
        const accHardLast20 = calcAccuracy(hardAttemptsLast20);

        const lastPracticed = attempts.length > 0 ? new Date(attempts[0].completed_at) : null;
        const daysSincePractice = lastPracticed
            ? (Date.now() - lastPracticed.getTime()) / (1000 * 60 * 60 * 24)
            : 999;

        // 3. Determine State
        let newState: MasteryState = 'learning';

        // Check Exam-Ready
        if (
            totalAttempts >= 30 &&
            accLast20 >= 0.80 &&
            hardAttemptsLast20.length >= 4 &&
            accHardLast20 >= 0.70 &&
            daysSincePractice <= 7
        ) {
            newState = 'exam_ready';
        }
        // Check Proficient
        else if (
            totalAttempts >= 20 &&
            accLast15 >= 0.75
        ) {
            newState = 'proficient';
        }

        // 4. Update DB
        // Calculate total correct/xp for cache
        const totalsResult = await dbManager.getFirst(
            `SELECT 
                COUNT(CASE WHEN is_correct THEN 1 END) as total_correct,
                SUM(xp_earned) as total_xp
             FROM attempts WHERE user_id = ? AND skill_id = ?`,
            [userId, skillId]
        );
        // @ts-ignore
        const totalCorrect = totalsResult?.total_correct || 0;
        // @ts-ignore
        const totalXP = totalsResult?.total_xp || 0;

        await dbManager.runQuery(
            `INSERT INTO user_skills (user_id, skill_id, total_attempts, total_correct, total_xp, mastery_state, mastery_state_updated, last_practiced_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(user_id, skill_id) DO UPDATE SET
                total_attempts = excluded.total_attempts,
                total_correct = excluded.total_correct,
                total_xp = excluded.total_xp,
                mastery_state = excluded.mastery_state,
                mastery_state_updated = CASE WHEN user_skills.mastery_state != excluded.mastery_state THEN CURRENT_TIMESTAMP ELSE user_skills.mastery_state_updated END,
                last_practiced_at = excluded.last_practiced_at,
                updated_at = CURRENT_TIMESTAMP`,
            [userId, skillId, totalAttempts, totalCorrect, totalXP, newState, lastPracticed ? lastPracticed.toISOString() : null]
        );

        return newState;
    }
}
