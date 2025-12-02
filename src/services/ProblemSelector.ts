import { dbManager } from '../database/DatabaseManager';
import { Problem } from '../models/types';

export class ProblemSelector {
    static async getProblems(
        categoryId: number,
        difficulty: 'easy' | 'medium' | 'hard',
        limit: number
    ): Promise<Problem[]> {
        // In a real app, we'd have complex logic to avoid repeats, etc.
        // For now, just random selection.

        // Check if we have problems for this category/difficulty
        const query = `
      SELECT * FROM problems 
      WHERE category_id = ? AND difficulty = ?
      ORDER BY RANDOM()
      LIMIT ?
    `;

        const problems = await dbManager.getAll(query, [categoryId, difficulty, limit]);

        // @ts-ignore
        if (problems.length === 0) {
            // Fallback: return dummy problem if DB is empty (for testing)
            return [this.getDummyProblem(categoryId, difficulty)];
        }

        // @ts-ignore
        return problems;
    }

    private static getDummyProblem(categoryId: number, difficulty: string): Problem {
        return {
            id: -1,
            category_id: categoryId,
            // @ts-ignore
            difficulty: difficulty,
            problem_text: "Integrate the following function:",
            problem_latex: "\\int x^2 dx",
            solution_steps: JSON.stringify([
                { step: 1, description: "Power rule", latex: "\\frac{x^3}{3} + C" }
            ]),
            hints: JSON.stringify(["Use the power rule: \\int x^n dx = \\frac{x^{n+1}}{n+1}"]),
            base_xp: 10,
            expected_time_seconds: 30,
            required_techniques: null,
            version: 1
        };
    }
}
