/**
 * ExpressionParser - Parse and normalize mathematical expressions
 * Handles multiple input formats and converts to canonical form
 */

export interface ParsedExpression {
    normalized: string;
    tokens: string[];
    hasConstant: boolean;
    variables: Set<string>;
}

export class ExpressionParser {
    /**
     * Parse a mathematical expression into a normalized form
     */
    static parse(expression: string): ParsedExpression {
        let normalized = expression.trim();

        // Step 1: Normalize unicode and special characters
        normalized = this.normalizeUnicode(normalized);

        // Step 2: Handle LaTeX commands
        normalized = this.normalizeLatex(normalized);

        // Step 3: Normalize exponents
        normalized = this.normalizeExponents(normalized);

        // Step 4: Handle implicit multiplication
        normalized = this.handleImplicitMultiplication(normalized);

        // Step 5: Normalize coefficient of 1 (1x -> x, 1* -> empty)
        normalized = normalized.replace(/\b1\*/g, ''); // 1*x -> x
        normalized = normalized.replace(/\(1\*/g, '('); // (1*x -> (x

        // Step 6: Normalize whitespace
        normalized = normalized.replace(/\s+/g, '');

        // Step 7: Extract metadata
        const tokens = this.tokenize(normalized);
        const hasConstant = /[+\-]\s*[Cc]$/.test(normalized);
        const variables = this.extractVariables(normalized);

        return {
            normalized: normalized.toLowerCase(),
            tokens,
            hasConstant,
            variables
        };
    }

    /**
     * Normalize unicode characters to ASCII equivalents
     */
    private static normalizeUnicode(expr: string): string {
        // Unicode superscripts to ^ notation
        const superscripts: Record<string, string> = {
            '⁰': '^0', '¹': '^1', '²': '^2', '³': '^3', '⁴': '^4',
            '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9'
        };

        let result = expr;
        for (const [unicode, ascii] of Object.entries(superscripts)) {
            result = result.replace(new RegExp(unicode, 'g'), ascii);
        }

        // Other unicode symbols
        result = result.replace(/π/g, 'pi');
        result = result.replace(/×/g, '*');
        result = result.replace(/÷/g, '/');
        result = result.replace(/−/g, '-');
        result = result.replace(/√/g, 'sqrt');

        return result;
    }

    /**
     * Normalize LaTeX commands to standard notation
     */
    private static normalizeLatex(expr: string): string {
        let result = expr;

        // \frac{a}{b} -> (a)/(b)
        result = result.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');

        // Common functions
        result = result.replace(/\\sin/g, 'sin');
        result = result.replace(/\\cos/g, 'cos');
        result = result.replace(/\\tan/g, 'tan');
        result = result.replace(/\\ln/g, 'ln');
        result = result.replace(/\\log/g, 'log');
        result = result.replace(/\\sqrt/g, 'sqrt');
        result = result.replace(/\\pi/g, 'pi');

        // Remove remaining backslashes
        result = result.replace(/\\/g, '');

        return result;
    }

    /**
     * Normalize exponent notation
     */
    private static normalizeExponents(expr: string): string {
        let result = expr;

        // x^{n} -> x^n (remove braces)
        result = result.replace(/\^{([^}]+)}/g, '^$1');

        // x**n -> x^n (Python style to standard)
        result = result.replace(/\*\*/g, '^');

        return result;
    }

    /**
     * Handle implicit multiplication (2x -> 2*x)
     */
    private static handleImplicitMultiplication(expr: string): string {
        let result = expr;

        // Number followed by letter: 2x -> 2*x
        result = result.replace(/(\d)([a-zA-Z])/g, '$1*$2');

        // Fraction followed by opening paren: 1/2( -> 1/2*(
        result = result.replace(/(\d+\/\d+)\(/g, '$1*(');

        // Closing paren of fraction followed by opening paren: )(  -> )*(
        // This handles cases like (1/2)(x+1)
        result = result.replace(/\)\(/g, ')*(');

        // Letter followed by opening paren: x( -> x*(
        result = result.replace(/([a-zA-Z])\(/g, '$1*(');

        // Closing paren followed by letter: )x -> )*x
        result = result.replace(/\)([a-zA-Z])/g, ')*$1');

        // Number followed by opening paren: 2( -> 2*(
        result = result.replace(/(\d)\(/g, '$1*(');

        return result;
    }

    /**
     * Tokenize expression into components
     */
    private static tokenize(expr: string): string[] {
        // Split on operators while keeping them
        return expr.split(/([+\-*/^()])/).filter(t => t.length > 0);
    }

    /**
     * Extract variable names from expression
     */
    private static extractVariables(expr: string): Set<string> {
        const variables = new Set<string>();
        const matches = expr.match(/[a-zA-Z]+/g);

        if (matches) {
            for (const match of matches) {
                // Skip function names and constants
                if (!['sin', 'cos', 'tan', 'ln', 'log', 'sqrt', 'pi', 'e', 'c'].includes(match.toLowerCase())) {
                    variables.add(match);
                }
            }
        }

        return variables;
    }

    /**
     * Compare two expressions for structural equality
     */
    static areStructurallyEqual(expr1: string, expr2: string): boolean {
        const parsed1 = this.parse(expr1);
        const parsed2 = this.parse(expr2);

        // Remove constants for comparison
        const norm1 = parsed1.normalized.replace(/[+\-]\s*c$/i, '');
        const norm2 = parsed2.normalized.replace(/[+\-]\s*c$/i, '');

        // Direct match
        if (norm1 === norm2) {
            return true;
        }

        // Try common transformations
        return this.areEquivalentForms(norm1, norm2);
    }

    /**
     * Check if two normalized expressions are equivalent forms
     */
    private static areEquivalentForms(expr1: string, expr2: string): boolean {
        // Generate variations of expr2 and check if any match expr1
        const variations = this.generateVariations(expr2);
        return variations.some(v => v === expr1);
    }

    /**
     * Generate common equivalent forms of an expression
     */
    private static generateVariations(expr: string): string[] {
        const variations = [expr];

        // (a)/(b) <-> a/b
        if (expr.includes('(') && expr.includes('/')) {
            variations.push(expr.replace(/\(([^)]+)\)\/\(([^)]+)\)/g, '$1/$2'));
            variations.push(expr.replace(/([^(]+)\/([^)]+)/g, '($1)/($2)'));
        }

        // Commutative operations: a+b <-> b+a
        // (Simple version - just try swapping around + and *)
        if (expr.includes('+')) {
            const parts = expr.split('+');
            if (parts.length === 2) {
                variations.push(parts[1] + '+' + parts[0]);
            }
        }

        return variations;
    }
}
