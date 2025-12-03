import random

def generate_S1_easy():
    """
    Template S1: Simple power rule
    Integral of a * x^n dx
    """
    a = random.choice([1, 2, 3, 4, 5])
    # n in 0..5, but n != -1 (already excluded by range)
    n = random.choice([0, 1, 2, 3, 4, 5])
    
    # Integrand
    # If n=0, it's just 'a'
    # If n=1, it's 'ax'
    if n == 0:
        integrand_tex = f"\\int {a} \\, dx"
        integrand_plain = f"{a}"
    elif n == 1:
        integrand_tex = f"\\int {a}x \\, dx"
        integrand_plain = f"{a}*x"
    else:
        integrand_tex = f"\\int {a}x^{{{n}}} \\, dx"
        integrand_plain = f"{a}*x**{n}"
    
    # Solution: a/(n+1) * x^(n+1)
    new_n = n + 1
    denom = new_n
    
    # Simplify fraction a/denom
    # For display, if a/denom is integer, show it. Else show fraction.
    if a % denom == 0:
        coeff = a // denom
        coeff_str = f"{coeff}" if coeff != 1 else ""
    else:
        coeff_str = f"\\frac{{{a}}}{{{denom}}}"
    
    # Plain coeff
    coeff_plain = f"({a}/{denom})"
    
    solution_tex = f"{coeff_str}x^{{{new_n}}} + C"
    solution_plain = f"{coeff_plain} * x**{new_n} + C"
    
    return {
        "skill": "SUBSTITUTION",
        "difficulty": "EASY",
        "integrand_tex": integrand_tex,
        "integrand_plain": integrand_plain,
        "solution_tex": solution_tex,
        "solution_plain": solution_plain,
        "meta": {"type": "S1", "a": a, "n": n}
    }

def generate_S2_easy():
    """
    Template S2: Sum of two powers
    Integral of (ax^m + bx^n) dx
    """
    a = random.choice([1, 2, 3, 4])
    b = random.choice([1, 2, 3, 4])
    
    # m, n in 0..4, distinct
    options = [0, 1, 2, 3, 4]
    m = random.choice(options)
    options.remove(m)
    n = random.choice(options)
    
    # Helper to format term
    def format_term(coeff, power):
        if power == 0: return f"{coeff}"
        if power == 1: return f"{coeff}x"
        return f"{coeff}x^{{{power}}}"
        
    term1 = format_term(a, m)
    term2 = format_term(b, n)
    
    integrand_tex = f"\\int ({term1} + {term2}) \\, dx"
    integrand_plain = f"({a}*x**{m} + {b}*x**{n})"
    
    # Solution
    def solve_term(coeff, power):
        new_p = power + 1
        if coeff % new_p == 0:
            c = coeff // new_p
            c_str = f"{c}" if c != 1 else ""
        else:
            c_str = f"\\frac{{{coeff}}}{{{new_p}}}"
        return f"{c_str}x^{{{new_p}}}"
        
    sol1 = solve_term(a, m)
    sol2 = solve_term(b, n)
    
    solution_tex = f"{sol1} + {sol2} + C"
    solution_plain = f"({a}/{m+1})*x**{m+1} + ({b}/{n+1})*x**{n+1} + C"
    
    return {
        "skill": "SUBSTITUTION",
        "difficulty": "EASY",
        "integrand_tex": integrand_tex,
        "integrand_plain": integrand_plain,
        "solution_tex": solution_tex,
        "solution_plain": solution_plain,
        "meta": {"type": "S2", "a": a, "b": b, "m": m, "n": n}
    }

def generate_S3_easy():
    """
    Template S3: Linear inside power
    Integral of (ax + b)^n dx
    """
    a = random.choice([1, 2, 3])
    b = random.randint(-5, 5)
    if b == 0: b = 1 # Avoid trivial
    n = random.choice([1, 2, 3, 4])
    
    # Integrand
    sign = "+" if b > 0 else "-"
    abs_b = abs(b)
    
    term = f"({a}x {sign} {abs_b})"
    integrand_tex = f"\\int {term}^{{{n}}} \\, dx"
    integrand_plain = f"({a}*x + {b})**{n}"
    
    # Solution: 1/(a(n+1)) * (ax+b)^(n+1)
    denom = a * (n + 1)
    frac = f"\\frac{{1}}{{{denom}}}"
    
    solution_tex = f"{frac}{term}^{{{n+1}}} + C"
    solution_plain = f"(1/{denom}) * ({a}*x + {b})**{n+1} + C"
    
    return {
        "skill": "SUBSTITUTION",
        "difficulty": "EASY",
        "integrand_tex": integrand_tex,
        "integrand_plain": integrand_plain,
        "solution_tex": solution_tex,
        "solution_plain": solution_plain,
        "meta": {"type": "S3", "a": a, "b": b, "n": n}
    }

def generate_S4_easy():
    """
    Template S4: Simple exponential with linear argument
    Integral of e^(ax + b) dx
    """
    a = random.choice([1, 2, 3, -1, -2, -3]) # Added negatives for variety, though spec said {1,2,3}
    # Spec said a in {1,2,3}, let's stick to spec strictly first? 
    # Spec: a in {1,2,3} \ {0}. 
    a = random.choice([1, 2, 3])
    
    b = random.choice([-3, -2, -1, 0, 1, 2, 3])
    
    # Exponent formatting
    if b == 0:
        exponent = f"{a}x" if a != 1 else "x"
    elif b > 0:
        exponent = f"{a}x + {b}" if a != 1 else f"x + {b}"
    else:
        exponent = f"{a}x - {abs(b)}" if a != 1 else f"x - {abs(b)}"
        
    integrand_tex = f"\\int e^{{{exponent}}} \\, dx"
    integrand_plain = f"exp({a}*x + {b})"
    
    # Solution: 1/a * e^(...)
    if a == 1:
        frac = ""
    else:
        frac = f"\\frac{{1}}{{{a}}}"
        
    solution_tex = f"{frac}e^{{{exponent}}} + C"
    solution_plain = f"(1/{a}) * exp({a}*x + {b}) + C"
    
    return {
        "skill": "SUBSTITUTION",
        "difficulty": "EASY",
        "integrand_tex": integrand_tex,
        "integrand_plain": integrand_plain,
        "solution_tex": solution_tex,
        "solution_plain": solution_plain,
        "meta": {"type": "S4", "a": a, "b": b}
    }

def generate_S5_easy():
    """
    Template S5: Simple sine / cosine with linear argument
    """
    func = random.choice(['sin', 'cos'])
    a = random.choice([1, 2, 3])
    # b in {-pi, -pi/2, 0, pi/2, pi}
    # We'll use string representations for TeX
    b_opts = [
        (0, "0"),
        (1, "\\pi"),
        (-1, "-\\pi"),
        (0.5, "\\frac{\\pi}{2}"),
        (-0.5, "-\\frac{\\pi}{2}")
    ]
    b_val, b_tex = random.choice(b_opts)
    
    # Argument formatting
    if b_val == 0:
        arg_tex = f"{a}x" if a != 1 else "x"
        arg_plain = f"{a}*x"
    else:
        sign = "+" if b_val > 0 else "" # b_tex includes sign for negatives usually, but let's handle carefully
        # Actually b_tex has the sign if negative.
        if b_val > 0:
            arg_tex = f"{a}x + {b_tex}" if a != 1 else f"x + {b_tex}"
        else:
            arg_tex = f"{a}x {b_tex}" if a != 1 else f"x {b_tex}"
        arg_plain = f"{a}*x + {b_val}*pi"

    integrand_tex = f"\\int \\{func}({arg_tex}) \\, dx"
    integrand_plain = f"{func}({arg_plain})"
    
    # Solution
    # int sin(u) -> -cos(u)/a
    # int cos(u) -> sin(u)/a
    
    if func == 'sin':
        res_func = "\\cos"
        res_func_plain = "cos"
        sign_prefix = "-"
    else:
        res_func = "\\sin"
        res_func_plain = "sin"
        sign_prefix = ""
        
    if a == 1:
        frac = ""
    else:
        frac = f"\\frac{{1}}{{{a}}}"
        
    # Combine sign and frac
    if sign_prefix == "-":
        prefix = f"-{frac}" if frac else "-"
    else:
        prefix = frac
        
    solution_tex = f"{prefix}{res_func}({arg_tex}) + C"
    solution_plain = f"{sign_prefix}(1/{a}) * {res_func_plain}({arg_plain}) + C"
    
    return {
        "skill": "SUBSTITUTION",
        "difficulty": "EASY",
        "integrand_tex": integrand_tex,
        "integrand_plain": integrand_plain,
        "solution_tex": solution_tex,
        "solution_plain": solution_plain,
        "meta": {"type": "S5", "func": func, "a": a, "b_val": b_val}
    }

def generate_easy_substitution_question():
    templates = [
        generate_S1_easy,
        generate_S2_easy,
        generate_S3_easy,
        generate_S4_easy,
        generate_S5_easy
    ]
    generator = random.choice(templates)
    return generator()

if __name__ == "__main__":
    print("--- Example Questions ---")
    for i in range(5):
        q = generate_easy_substitution_question()
        print(f"\nQuestion {i+1} ({q['meta']['type']}):")
        print(f"TeX: {q['integrand_tex']}")
        print(f"Sol: {q['solution_tex']}")
