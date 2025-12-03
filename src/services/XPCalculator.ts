import { Problem } from '../models/types';

export class XPCalculator {
    static calculateProblemXP(
        difficulty: 'easy' | 'medium' | 'hard' | 'EASY' | 'MEDIUM' | 'HARD',
        isCorrect: boolean,
        numAttempts: number,
        hintsUsed: number
    ): number {
        if (!isCorrect) return 0;

        const normalizedDifficulty = difficulty.toLowerCase();
        const baseXPMap: Record<string, number> = {
            'easy': 10,
            'medium': 20,
            'hard': 35
        };

        const baseXP = baseXPMap[normalizedDifficulty] || 10;

        // Modifiers
        if (hintsUsed > 0) {
            return Math.round(baseXP * 0.7);
        }

        if (numAttempts > 1) {
            return Math.round(baseXP * 0.5);
        }

        return baseXP;
    }

    static getAssignmentBonus(size: 'SMALL' | 'MEDIUM' | 'LARGE'): number {
        const bonusMap: Record<string, number> = {
            'SMALL': 10,
            'MEDIUM': 25,
            'LARGE': 40
        };
        return bonusMap[size] || 0;
    }
}
