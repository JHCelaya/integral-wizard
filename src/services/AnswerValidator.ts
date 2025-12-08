import { MathJsValidator, MathValidationResult } from './MathJsValidator';

export interface ValidationResult {
    isCorrect: boolean;
    confidence: 'high' | 'medium' | 'low';
    method: 'exact' | 'structural' | 'numeric' | 'symbolic';
    message?: string;
    details?: {
        normalizedUser?: string;
        normalizedCorrect?: string;
        samplesUsed?: number;
        samplesMatched?: number;
    };
}

export class AnswerValidator {
    /**
     * Validates a user's answer against the correct solution
     * Uses math.js for robust mathematical comparison
     */
    static validateAnswer(
        userAnswer: string,
        correctAnswer: string,
        integrand?: string
    ): ValidationResult {
        console.log('Validating with math.js:', {
            user: userAnswer,
            correct: correctAnswer,
            integrand
        });

        // Use MathJsValidator for robust validation
        const result = MathJsValidator.validateAnswer(userAnswer, correctAnswer, integrand);

        // Convert to our ValidationResult format
        return {
            isCorrect: result.isCorrect,
            confidence: result.confidence,
            method: result.method === 'symbolic' ? 'symbolic' :
                result.method === 'numeric' ? 'numeric' : 'exact',
            message: result.message || this.getDefaultMessage(result.isCorrect),
            details: {
                normalizedUser: result.details?.userParsed,
                normalizedCorrect: result.details?.correctParsed
            }
        };
    }

    /**
     * Get default message based on correctness
     */
    private static getDefaultMessage(isCorrect: boolean): string {
        return isCorrect
            ? 'Correct!'
            : 'Not quite right. Try again or click Concede to see the solution.';
    }

    /**
     * Quick validation for simple cases (backward compatibility)
     */
    static validateAnswerSimple(userAnswer: string, correctAnswer: string): boolean {
        const result = this.validateAnswer(userAnswer, correctAnswer);
        return result.isCorrect;
    }
}
