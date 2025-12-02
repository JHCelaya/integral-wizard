import { Problem } from '../models/types';

export class XPCalculator {
    static calculateProblemXP(
        problem: Problem,
        timeSpentSeconds: number,
        hintsUsed: number,
        isCorrect: boolean
    ): number {
        if (!isCorrect) return 0;

        const difficultyMultiplier: Record<string, number> = {
            'easy': 10,
            'medium': 20,
            'hard': 35
        };

        let baseXP = difficultyMultiplier[problem.difficulty] || 10;

        // Time bonus (if completed faster than expected)
        const expectedTime = problem.expected_time_seconds || 60; // Default 60s if null
        const timeBonus = Math.max(0, (expectedTime - timeSpentSeconds) / expectedTime * 5);

        // Hint penalty (lose 20% per hint used)
        const hintPenalty = hintsUsed * 0.2;
        const xpMultiplier = Math.max(0.2, 1 - hintPenalty);

        return Math.round((baseXP + timeBonus) * xpMultiplier);
    }

    static calculateSetBonus(setSize: number, problemsCompleted: number): number {
        // Simple bonus logic for now, can be expanded
        if (problemsCompleted < setSize) return 0;

        if (setSize >= 30) return 100;
        if (setSize >= 15) return 30;
        if (setSize >= 5) return 10;

        return 0;
    }
}
