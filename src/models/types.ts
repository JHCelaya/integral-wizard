export interface UserProfile {
    id: number;
    current_level: number;
    total_xp: number;
    daily_streak: number;
    last_active_date: string | null;
    created_at: string;
    preferences: string; // JSON string
}

export interface Category {
    id: number;
    name: string;
    display_name: string;
    description: string | null;
    order_index: number | null;
    icon_name: string | null;
}

export interface CategoryProgress {
    id: number;
    category_id: number;
    total_xp: number;
    problems_completed: number;
    problems_attempted: number;
    accuracy_rate: number;
    last_practiced: string | null;
    mastery_level: number;
}

export interface Problem {
    id: number;
    category_id: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'EASY' | 'MEDIUM' | 'HARD';
    problem_text: string;
    problem_latex: string;
    solution_steps: string; // JSON string
    hints: string | null; // JSON string
    base_xp: number;
    expected_time_seconds: number | null;
    required_techniques: string | null; // JSON string
    version: number;
}

export interface ProblemHistory {
    id: number;
    problem_id: number;
    attempted_at: string;
    completed: boolean;
    time_spent_seconds: number | null;
    hints_used: number;
    xp_earned: number;
}

export interface Lesson {
    id: number;
    category_id: number;
    title: string;
    content_html: string;
    content_markdown: string;
    examples: string | null; // JSON string
    order_index: number | null;
    read_status: boolean;
    bookmarked: boolean;
    version: number;
}

export interface Achievement {
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
    xp_reward: number;
    requirement_type: string | null;
    requirement_value: number | null;
    unlocked: boolean;
    unlocked_date: string | null;
}
