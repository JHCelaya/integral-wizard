/**
 * NumericDerivativeChecker - Verify antiderivatives by numerical differentiation
 * Computes derivative numerically and compares with expected integrand
 */

export interface DerivativeCheckResult {
    isMatch: boolean;
    confidence: number; // 0-1, percentage of sample points that matched
    method: 'numeric';
    samplesUsed: number;
    samplesMatched: number;
}

export class NumericDerivativeChecker {
    private static readonly DEFAULT_SAMPLES = [-4, -3, -2, -1, -0.5, 0.5, 1, 2, 3, 4];
    private static readonly H = 0.0001; // Step size for numerical derivative
    private static readonly TOLERANCE = 1e-4; // Absolute tolerance for comparison

    /**
     * Check if user's answer is a valid antiderivative of the integrand
     * by computing numerical derivative and comparing
     */
    static checkAntiderivative(
        userAnswer: string,
        integrand: string,
        variable: string = 'x',
        samplePoints?: number[]
    ): DerivativeCheckResult {
        const samples = samplePoints || this.DEFAULT_SAMPLES;
        let matchCount = 0;
        let validSampleCount = 0;

        for (const x of samples) {
            try {
                // Compute numerical derivative of user's answer
                const derivative = this.numericalDerivative(userAnswer, variable, x);

                // Evaluate integrand at this point
                const integrandValue = this.evaluate(integrand, variable, x);

                // Check if both are finite
                if (!isFinite(derivative) || !isFinite(integrandValue)) {
                    continue; // Skip invalid points
                }

                validSampleCount++;

                // Compare with tolerance
                const diff = Math.abs(derivative - integrandValue);
                if (diff < this.TOLERANCE) {
                    matchCount++;
                }
            } catch (error) {
                // Skip points that cause evaluation errors
                continue;
            }
        }

        // Need at least 4 valid samples
        if (validSampleCount < 4) {
            return {
                isMatch: false,
                confidence: 0,
                method: 'numeric',
                samplesUsed: validSampleCount,
                samplesMatched: matchCount
            };
        }

        const confidence = matchCount / validSampleCount;

        // Require 85% match rate
        return {
            isMatch: confidence >= 0.85,
            confidence,
            method: 'numeric',
            samplesUsed: validSampleCount,
            samplesMatched: matchCount
        };
    }

    /**
     * Compute numerical derivative using central difference
     * f'(x) ≈ (f(x+h) - f(x-h)) / (2h)
     */
    private static numericalDerivative(
        expression: string,
        variable: string,
        point: number
    ): number {
        const h = this.H;
        const fPlus = this.evaluate(expression, variable, point + h);
        const fMinus = this.evaluate(expression, variable, point - h);

        return (fPlus - fMinus) / (2 * h);
    }

    /**
     * Evaluate a mathematical expression at a given point
     * Uses safe evaluation with limited scope
     */
    private static evaluate(
        expression: string,
        variable: string,
        value: number
    ): number {
        // Normalize expression
        let expr = expression.toLowerCase().trim();

        // Remove constant term (+C or -C)
        expr = expr.replace(/[+\-]\s*c$/i, '');

        // Replace variable with value
        expr = expr.replace(new RegExp(variable, 'g'), `(${value})`);

        // Replace common functions with Math equivalents
        expr = expr.replace(/sin\(/g, 'Math.sin(');
        expr = expr.replace(/cos\(/g, 'Math.cos(');
        expr = expr.replace(/tan\(/g, 'Math.tan(');
        expr = expr.replace(/ln\(/g, 'Math.log(');
        expr = expr.replace(/log\(/g, 'Math.log10(');
        expr = expr.replace(/sqrt\(/g, 'Math.sqrt(');
        expr = expr.replace(/abs\(/g, 'Math.abs(');

        // Replace constants
        expr = expr.replace(/\bpi\b/g, String(Math.PI));
        expr = expr.replace(/\be\b/g, String(Math.E));

        // Replace ^ with **
        expr = expr.replace(/\^/g, '**');

        // Safe evaluation
        try {
            // Use Function constructor (safer than eval)
            const func = new Function('Math', `return ${expr}`);
            const result = func(Math);

            return typeof result === 'number' ? result : NaN;
        } catch (error) {
            console.warn('Evaluation error:', error, 'Expression:', expr);
            return NaN;
        }
    }

    /**
     * Get template-aware sample points
     * Avoids singularities and problematic regions
     */
    static getTemplateSamples(templateType: string): number[] {
        switch (templateType) {
            case 'SUBSTITUTION':
            case 'POWER_RULE':
                return this.DEFAULT_SAMPLES;

            case 'TRIG':
                // Avoid multiples of π/2 where tan has singularities
                return [-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2];

            case 'LOGARITHMIC':
                // Only positive values for ln(x)
                return [0.1, 0.5, 1, 2, 3, 4, 5];

            case 'RATIONAL':
                // Avoid potential poles
                return [-3, -2, -1, -0.5, 0.5, 1, 2, 3];

            default:
                return this.DEFAULT_SAMPLES;
        }
    }

    /**
     * Quick sanity check - verify at a single point
     */
    static quickCheck(
        userAnswer: string,
        integrand: string,
        variable: string = 'x'
    ): boolean {
        try {
            const x = 1; // Simple test point
            const derivative = this.numericalDerivative(userAnswer, variable, x);
            const integrandValue = this.evaluate(integrand, variable, x);

            if (!isFinite(derivative) || !isFinite(integrandValue)) {
                return false;
            }

            return Math.abs(derivative - integrandValue) < this.TOLERANCE;
        } catch {
            return false;
        }
    }
}
