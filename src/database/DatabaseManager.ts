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
      CREATE TABLE IF NOT EXISTS skills (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS user_skills (
        user_id INTEGER,
        skill_id TEXT REFERENCES skills(id),
        total_attempts INTEGER DEFAULT 0,
        total_correct INTEGER DEFAULT 0,
        total_xp INTEGER DEFAULT 0,
        mastery_state TEXT DEFAULT 'learning',
        mastery_state_updated TIMESTAMP,
        last_practiced_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, skill_id)
      );

      CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        skill_id TEXT REFERENCES skills(id),
        name TEXT NOT NULL,
        base_difficulty TEXT CHECK (base_difficulty IN ('EASY', 'MEDIUM', 'HARD')),
        description TEXT,
        param_spec_json JSON,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS assignments (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        skill_id TEXT REFERENCES skills(id),
        size TEXT CHECK (size IN ('SMALL', 'MEDIUM', 'LARGE')),
        status TEXT CHECK (status IN ('in_progress', 'completed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS assignment_questions (
        id INTEGER PRIMARY KEY,
        assignment_id INTEGER REFERENCES assignments(id),
        question_payload JSON,
        position INTEGER
      );

      CREATE TABLE IF NOT EXISTS attempts (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        skill_id TEXT,
        question_id INTEGER, -- Optional if using templates/payloads
        template_id TEXT REFERENCES templates(id),
        assignment_id INTEGER REFERENCES assignments(id),
        difficulty TEXT CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
        is_correct BOOLEAN,
        num_attempts INTEGER,
        hints_used INTEGER,
        xp_earned INTEGER,
        started_at TIMESTAMP,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

    // Seed Skills
    const skills = [
      { id: 'SUBSTITUTION', name: 'Substitution', description: 'U-Substitution technique' },
      { id: 'INTEGRATION_BY_PARTS', name: 'Integration by Parts', description: 'Product rule reverse' },
      { id: 'TRIG_INTEGRALS', name: 'Trigonometric Integrals', description: 'Powers of sin, cos, tan, sec' },
      { id: 'TRIG_SUBSTITUTION', name: 'Trigonometric Substitution', description: 'Radicals like sqrt(a^2-x^2)' },
      { id: 'PARTIAL_FRACTIONS', name: 'Partial Fractions', description: 'Rational functions' },
      { id: 'IMPROPER_INTEGRALS', name: 'Improper Integrals', description: 'Limits at infinity or discontinuities' }
    ];

    for (const skill of skills) {
      await this.db.runAsync(
        'INSERT OR IGNORE INTO skills (id, name, description) VALUES (?, ?, ?)',
        skill.id, skill.name, skill.description
      );
      // Initialize user_skills for default user (id=1)
      await this.db.runAsync(
        'INSERT OR IGNORE INTO user_skills (user_id, skill_id) VALUES (1, ?)',
        skill.id
      );
    }
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
