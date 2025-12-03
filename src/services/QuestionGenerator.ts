import { Problem } from '../models/types';

export interface GeneratedQuestion {
    skill: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    integrand_tex: string;
    integrand_plain: string;
    solution_tex: string;
    solution_plain: string;
    meta: Record<string, any>;
}

export class QuestionGenerator {

    static generateEasySubstitutionQuestion(): GeneratedQuestion {
        const templates = [
            this.generateS1Easy,
            this.generateS2Easy,
            this.generateS3Easy,
            this.generateS4Easy,
            this.generateS5Easy
        ];
        const generator = templates[Math.floor(Math.random() * templates.length)];
        return generator.call(this);
    }

    private static generateS1Easy(): GeneratedQuestion {
        // Template S1: Simple power rule: int a * x^n dx
        const a = [1, 2, 3, 4, 5][Math.floor(Math.random() * 5)];
        const n = [0, 1, 2, 3, 4, 5][Math.floor(Math.random() * 6)];

        let integrand_tex = '';
        let integrand_plain = '';

        if (n === 0) {
            integrand_tex = `\\int ${a} \\, dx`;
            integrand_plain = `${a}`;
        } else if (n === 1) {
            integrand_tex = `\\int ${a}x \\, dx`;
            integrand_plain = `${a}*x`;
        } else {
            integrand_tex = `\\int ${a}x^{${n}} \\, dx`;
            integrand_plain = `${a}*x**${n}`;
        }

        const new_n = n + 1;
        const denom = new_n;

        let coeff_str = '';
        let coeff_plain = `(${a}/${denom})`;

        if (a % denom === 0) {
            const coeff = a / denom;
            coeff_str = coeff !== 1 ? `${coeff}` : '';
        } else {
            coeff_str = `\\frac{${a}}{${denom}}`;
        }

        const solution_tex = `${coeff_str}x^{${new_n}} + C`;
        const solution_plain = `${coeff_plain} * x**${new_n} + C`;

        return {
            skill: "SUBSTITUTION",
            difficulty: "EASY",
            integrand_tex,
            integrand_plain,
            solution_tex,
            solution_plain,
            meta: { type: "S1", a, n }
        };
    }

    private static generateS2Easy(): GeneratedQuestion {
        // Template S2: Sum of two powers: int (ax^m + bx^n) dx
        const a = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
        const b = [1, 2, 3, 4][Math.floor(Math.random() * 4)];

        const options = [0, 1, 2, 3, 4];
        const m = options[Math.floor(Math.random() * options.length)];
        const remainingOptions = options.filter(opt => opt !== m);
        const n = remainingOptions[Math.floor(Math.random() * remainingOptions.length)];

        const formatTerm = (coeff: number, power: number) => {
            if (power === 0) return `${coeff}`;
            if (power === 1) return `${coeff}x`;
            return `${coeff}x^{${power}}`;
        };

        const term1 = formatTerm(a, m);
        const term2 = formatTerm(b, n);

        const integrand_tex = `\\int (${term1} + ${term2}) \\, dx`;
        const integrand_plain = `(${a}*x**${m} + ${b}*x**${n})`;

        const solveTerm = (coeff: number, power: number) => {
            const new_p = power + 1;
            let c_str = '';
            if (coeff % new_p === 0) {
                const c = coeff / new_p;
                c_str = c !== 1 ? `${c}` : '';
            } else {
                c_str = `\\frac{${coeff}}{${new_p}}`;
            }
            return `${c_str}x^{${new_p}}`;
        };

        const sol1 = solveTerm(a, m);
        const sol2 = solveTerm(b, n);

        const solution_tex = `${sol1} + ${sol2} + C`;
        const solution_plain = `(${a}/${m + 1})*x**${m + 1} + (${b}/${n + 1})*x**${n + 1} + C`;

        return {
            skill: "SUBSTITUTION",
            difficulty: "EASY",
            integrand_tex,
            integrand_plain,
            solution_tex,
            solution_plain,
            meta: { type: "S2", a, b, m, n }
        };
    }

    private static generateS3Easy(): GeneratedQuestion {
        // Template S3: Linear inside power: int (ax + b)^n dx
        const a = [1, 2, 3][Math.floor(Math.random() * 3)];
        let b = Math.floor(Math.random() * 11) - 5; // -5 to 5
        if (b === 0) b = 1;
        const n = [1, 2, 3, 4][Math.floor(Math.random() * 4)];

        const sign = b > 0 ? "+" : "-";
        const abs_b = Math.abs(b);

        const term = `(${a}x ${sign} ${abs_b})`;
        const integrand_tex = `\\int ${term}^{${n}} \\, dx`;
        const integrand_plain = `(${a}*x + ${b})**${n}`;

        const denom = a * (n + 1);
        const frac = `\\frac{1}{${denom}}`;

        const solution_tex = `${frac}${term}^{${n + 1}} + C`;
        const solution_plain = `(1/${denom}) * (${a}*x + ${b})**${n + 1} + C`;

        return {
            skill: "SUBSTITUTION",
            difficulty: "EASY",
            integrand_tex,
            integrand_plain,
            solution_tex,
            solution_plain,
            meta: { type: "S3", a, b, n }
        };
    }

    private static generateS4Easy(): GeneratedQuestion {
        // Template S4: Exponential: int e^(ax + b) dx
        const a = [1, 2, 3][Math.floor(Math.random() * 3)];
        const b = [-3, -2, -1, 0, 1, 2, 3][Math.floor(Math.random() * 7)];

        let exponent = '';
        if (b === 0) {
            exponent = a !== 1 ? `${a}x` : `x`;
        } else if (b > 0) {
            exponent = a !== 1 ? `${a}x + ${b}` : `x + ${b}`;
        } else {
            exponent = a !== 1 ? `${a}x - ${Math.abs(b)}` : `x - ${Math.abs(b)}`;
        }

        const integrand_tex = `\\int e^{${exponent}} \\, dx`;
        const integrand_plain = `exp(${a}*x + ${b})`;

        const frac = a === 1 ? '' : `\\frac{1}{${a}}`;
        const solution_tex = `${frac}e^{${exponent}} + C`;
        const solution_plain = `(1/${a}) * exp(${a}*x + ${b}) + C`;

        return {
            skill: "SUBSTITUTION",
            difficulty: "EASY",
            integrand_tex,
            integrand_plain,
            solution_tex,
            solution_plain,
            meta: { type: "S4", a, b }
        };
    }

    private static generateS5Easy(): GeneratedQuestion {
        // Template S5: Trig: int sin(ax+b) or cos(ax+b)
        const func = Math.random() < 0.5 ? 'sin' : 'cos';
        const a = [1, 2, 3][Math.floor(Math.random() * 3)];

        const b_opts = [
            { val: 0, tex: "0" },
            { val: 1, tex: "\\pi" },
            { val: -1, tex: "-\\pi" },
            { val: 0.5, tex: "\\frac{\\pi}{2}" },
            { val: -0.5, tex: "-\\frac{\\pi}{2}" }
        ];
        const b_opt = b_opts[Math.floor(Math.random() * b_opts.length)];
        const b_val = b_opt.val;
        const b_tex = b_opt.tex;

        let arg_tex = '';
        let arg_plain = '';

        if (b_val === 0) {
            arg_tex = a !== 1 ? `${a}x` : `x`;
            arg_plain = `${a}*x`;
        } else {
            if (b_val > 0) {
                arg_tex = a !== 1 ? `${a}x + ${b_tex}` : `x + ${b_tex}`;
            } else {
                arg_tex = a !== 1 ? `${a}x ${b_tex}` : `x ${b_tex}`;
            }
            arg_plain = `${a}*x + ${b_val}*pi`;
        }

        const integrand_tex = `\\int \\${func}(${arg_tex}) \\, dx`;
        const integrand_plain = `${func}(${arg_plain})`;

        let res_func = '';
        let res_func_plain = '';
        let sign_prefix = '';

        if (func === 'sin') {
            res_func = "\\cos";
            res_func_plain = "cos";
            sign_prefix = "-";
        } else {
            res_func = "\\sin";
            res_func_plain = "sin";
            sign_prefix = "";
        }

        const frac = a === 1 ? '' : `\\frac{1}{${a}}`;

        let prefix = '';
        if (sign_prefix === "-") {
            prefix = frac ? `-${frac}` : `-`;
        } else {
            prefix = frac;
        }

        const solution_tex = `${prefix}${res_func}(${arg_tex}) + C`;
        const solution_plain = `${sign_prefix}(1/${a}) * ${res_func_plain}(${arg_plain}) + C`;

        return {
            skill: "SUBSTITUTION",
            difficulty: "EASY",
            integrand_tex,
            integrand_plain,
            solution_tex,
            solution_plain,
            meta: { type: "S5", func, a, b_val }
        };
    }
}
