import * as SQLite from 'expo-sqlite';

class DatabaseManager {
    private db: SQLite.SQLiteDatabase | null = null;

    async init() {
        this.db = await SQLite.openDatabaseAsync('integral_wizard.db');
        await this.createTables();
        await this.seedInitialData();
    }

    private async createTables() {
        if (!this.db) return;

        await this.db.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY,
        current_level INTEGER DEFAULT 1,
        total_xp INTEGER DEFAULT 0,
        daily_streak INTEGER DEFAULT 0,
        last_active_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        preferences JSON
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        display_name TEXT NOT NULL,
        description TEXT,
        order_index INTEGER,
        icon_name TEXT
      );

      CREATE TABLE IF NOT EXISTS category_progress (
        id INTEGER PRIMARY KEY,
        category_id INTEGER REFERENCES categories(id),
        total_xp INTEGER DEFAULT 0,
        problems_completed INTEGER DEFAULT 0,
        problems_attempted INTEGER DEFAULT 0,
        accuracy_rate REAL DEFAULT 0,
        last_practiced TIMESTAMP,
        mastery_level INTEGER DEFAULT 0,
        UNIQUE(category_id)
      );

      CREATE TABLE IF NOT EXISTS problems (
        id INTEGER PRIMARY KEY,
        category_id INTEGER REFERENCES categories(id),
        difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
        problem_text TEXT NOT NULL,
        problem_latex TEXT NOT NULL,
        solution_steps JSON NOT NULL,
        hints JSON,
        base_xp INTEGER NOT NULL,
        expected_time_seconds INTEGER,
        required_techniques JSON,
        version INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS problem_history (
        id INTEGER PRIMARY KEY,
        problem_id INTEGER REFERENCES problems(id),
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed BOOLEAN DEFAULT FALSE,
        time_spent_seconds INTEGER,
        hints_used INTEGER DEFAULT 0,
        xp_earned INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY,
        category_id INTEGER REFERENCES categories(id),
        title TEXT NOT NULL,
        content_html TEXT NOT NULL,
        content_markdown TEXT NOT NULL,
        examples JSON,
        order_index INTEGER,
        read_status BOOLEAN DEFAULT FALSE,
        bookmarked BOOLEAN DEFAULT FALSE,
        version INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        xp_reward INTEGER DEFAULT 0,
        requirement_type TEXT,
        requirement_value INTEGER,
        unlocked BOOLEAN DEFAULT FALSE,
        unlocked_date TIMESTAMP
      );
    `);
    }

    private async seedInitialData() {
        if (!this.db) return;

        // Check if categories exist
        const result = await this.db.getAllAsync('SELECT count(*) as count FROM categories');
        // @ts-ignore
        if (result[0].count > 0) return;

        const categories = [
            { id: 1, name: "basic_antiderivatives", display: "Basic Antiderivatives", order: 1 },
            { id: 2, name: "u_substitution", display: "U-Substitution", order: 2 },
            { id: 3, name: "integration_by_parts", display: "Integration by Parts", order: 3 },
            { id: 4, name: "trig_integrals", display: "Trigonometric Integrals", order: 4 },
            { id: 5, name: "trig_substitution", display: "Trigonometric Substitution", order: 5 },
            { id: 6, name: "partial_fractions", display: "Partial Fractions", order: 6 },
            { id: 7, name: "improper_integrals", display: "Improper Integrals", order: 7 },
            { id: 8, name: "numerical_integration", display: "Numerical Integration", order: 8 },
            { id: 9, name: "applications", display: "Applications (Area, Volume)", order: 9 }
        ];

        for (const cat of categories) {
            await this.db.runAsync(
                'INSERT INTO categories (id, name, display_name, order_index) VALUES (?, ?, ?, ?)',
                cat.id, cat.name, cat.display, cat.order
            );
            // Initialize progress for each category
            await this.db.runAsync(
                'INSERT INTO category_progress (category_id) VALUES (?)',
                cat.id
            );
        }

        // Initialize user profile
        await this.db.runAsync('INSERT INTO user_profile (current_level) VALUES (1)');
    }

    public getDb() {
        return this.db;
    }

    // Helper for running queries
    public async runQuery(query: string, params: any[] = []) {
        if (!this.db) throw new Error("DB not initialized");
        return await this.db.runAsync(query, ...params);
    }

    public async getAll(query: string, params: any[] = []) {
        if (!this.db) throw new Error("DB not initialized");
        return await this.db.getAllAsync(query, ...params);
    }

    public async getFirst(query: string, params: any[] = []) {
        if (!this.db) throw new Error("DB not initialized");
        return await this.db.getFirstAsync(query, ...params);
    }
}

export const dbManager = new DatabaseManager();
