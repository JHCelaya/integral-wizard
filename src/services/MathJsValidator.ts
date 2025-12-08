import { create, all, MathNode } from 'mathjs';

const math = create(all);

export interface MathValidationResult {
    isCorrect: boolean;
    confidence: 'high' | 'medium' | 'low';
    method: 'symbolic' | 'numeric' | 'parse_error';
    message?: string;
    details?: {
        userParsed?: string;
        correctParsed?: string;
        difference?: string;
    };
}

export class MathJsValidator {
    /**
     * Validate if user's answer is mathematically equivalent to correct answer
     */
    static validateAnswer(
        userAnswer: string,
        correctAnswer: string,
        integrand?: string
    ): MathValidationResult {
        try {
            // Step 1: Normalize and parse both expressions
            const userNormalized = this.normalizeExpression(userAnswer);
            const correctNormalized = this.normalizeExpression(correctAnswer);

            console.log('Math.js validation:', {
                user: userAnswer,
                userNorm: userNormalized,
                correct: correctAnswer,
                correctNorm: correctNormalized
            });

            // Step 2: Parse expressions
            let userNode: MathNode;
            let correctNode: MathNode;

            try {
                userNode = math.parse(userNormalized);
                correctNode = math.parse(correctNormalized);
            } catch (parseError) {
                console.warn('Parse error:', parseError);
                return {
                    isCorrect: false,
                    confidence: 'low',
                    method: 'parse_error',
                    message: 'Could not parse expression. Check your syntax.',
                };
            }

            // Step 3: Simplify both expressions
            const userSimplified = math.simplify(userNode);
            const correctSimplified = math.simplify(correctNode);

            console.log('Simplified:', {
                user: userSimplified.toString(),
                correct: correctSimplified.toString()
            });

            // Step 4: Check if they're equal symbolically
            try {
                const difference = math.simplify(
                    math.parse(`(${userSimplified.toString()}) - (${correctSimplified.toString()})`)
                );

                console.log('Difference:', difference.toString());

                // If difference simplifies to 0, they're equal
                if (difference.toString() === '0' || difference.equals(math.parse('0'))) {
                    return {
                        isCorrect: true,
                        confidence: 'high',
                        method: 'symbolic',
                        message: 'Correct!',
                        details: {
                            userParsed: userSimplified.toString(),
                            correctParsed: correctSimplified.toString(),
                            difference: '0'
                        }
                    };
                }
            } catch (symbolicError) {
                console.warn('Symbolic comparison failed:', symbolicError);
            }

            // Step 5: Numeric verification fallback
            if (integrand) {
                const numericResult = this.numericVerification(
                    userSimplified.toString(),
                    integrand
                );

                if (numericResult.isMatch) {
                    return {
                        isCorrect: true,
                        confidence: numericResult.confidence >= 0.95 ? 'high' : 'medium',
                        method: 'numeric',
                        message: 'Correct (verified numerically)',
                        details: {
                            userParsed: userSimplified.toString(),
                            correctParsed: correctSimplified.toString()
                        }
                    };
                }
            }

            // Not equal
            return {
                isCorrect: false,
                confidence: 'low',
                method: 'symbolic',
                message: 'Not quite right. Try again!',
                details: {
                    userParsed: userSimplified.toString(),
                    correctParsed: correctSimplified.toString()
                }
            };

        } catch (error) {
            console.error('Validation error:', error);
            return {
                isCorrect: false,
                confidence: 'low',
                method: 'parse_error',
                message: 'Error validating answer. Please check your syntax.'
            };
        }
    }

    /**
     * Normalize expression for math.js parsing
     */
    private static normalizeExpression(expr: string): string {
        let normalized = expr.trim();

        // Remove LaTeX commands first
        normalized = normalized.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
        normalized = normalized.replace(/\\sin/g, 'sin');
        normalized = normalized.replace(/\\cos/g, 'cos');
        normalized = normalized.replace(/\\tan/g, 'tan');
        normalized = normalized.replace(/\\ln/g, 'log'); // math.js uses log for natural log
        normalized = normalized.replace(/\\pi/g, 'pi');
        normalized = normalized.replace(/\\sqrt/g, 'sqrt');
        normalized = normalized.replace(/\\/g, ''); // Remove remaining backslashes

        // Handle exponents
        normalized = normalized.replace(/\^{([^}]+)}/g, '^($1)');
        normalized = normalized.replace(/\*\*/g, '^');

        // CRITICAL: Add explicit multiplication for implicit cases
        // This must happen BEFORE removing spaces

        // Pattern: number/number( → number/number*(
        // Handles: 1/4(x^4) → 1/4*(x^4)
        normalized = normalized.replace(/(\d+\/\d+)\(/g, '($1)*(');

        // Pattern: )( → )*(
        // Handles: (1/4)(x^4) → (1/4)*(x^4)
        normalized = normalized.replace(/\)\(/g, ')*(');

        // Pattern: number( → number*(
        // Handles: 2(x+1) → 2*(x+1)
        normalized = normalized.replace(/(\d)\(/g, '$1*(');

        // Remove spaces
        normalized = normalized.replace(/\s+/g, '');

        // Remove constant of integration for comparison
        normalized = normalized.replace(/\+[Cc]$/, '');
        normalized = normalized.replace(/-[Cc]$/, '');

        // Unicode symbols
        normalized = normalized.replace(/π/g, 'pi');
        normalized = normalized.replace(/×/g, '*');
        normalized = normalized.replace(/÷/g, '/');

        console.log('Normalized expression:', { original: expr, normalized });

        return normalized;
    }

    /**
     * Numeric verification by checking derivative
     */
    private static numericVerification(
        userExpr: string,
        integrand: string
    ): { isMatch: boolean; confidence: number } {
        try {
            // Parse user expression
            const userNode = math.parse(userExpr);

            // Compute derivative with respect to x
            const derivative = math.derivative(userNode, 'x');
            const derivativeSimplified = math.simplify(derivative);

            // Parse and simplify integrand
            const integrandNorm = this.normalizeExpression(integrand);
            const integrandNode = math.parse(integrandNorm);
            const integrandSimplified = math.simplify(integrandNode);

            console.log('Numeric verification:', {
                derivative: derivativeSimplified.toString(),
                integrand: integrandSimplified.toString()
            });

            // Check if derivative equals integrand
            const diff = math.simplify(
                math.parse(`(${derivativeSimplified.toString()}) - (${integrandSimplified.toString()})`)
            );

            if (diff.toString() === '0' || diff.equals(math.parse('0'))) {
                return { isMatch: true, confidence: 1.0 };
            }

            // Numeric sampling fallback
            const samplePoints = [-4, -2, -1, 0.5, 1, 2, 4];
            let matches = 0;

            for (const x of samplePoints) {
                try {
                    const derivValue = derivative.evaluate({ x });
                    const integrandValue = integrandNode.evaluate({ x });

                    if (typeof derivValue === 'number' && typeof integrandValue === 'number') {
                        if (Math.abs(derivValue - integrandValue) < 1e-6) {
                            matches++;
                        }
                    }
                } catch {
                    // Skip points that cause errors
                }
            }

            const confidence = matches / samplePoints.length;
            return {
                isMatch: confidence >= 0.85,
                confidence
            };

        } catch (error) {
            console.warn('Numeric verification error:', error);
            return { isMatch: false, confidence: 0 };
        }
    }
}
