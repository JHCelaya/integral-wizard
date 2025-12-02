import { dbManager } from '../database/DatabaseManager';
import { CategoryProgress } from '../models/types';

export class RecommendationEngine {
    static async getDailyRecommendations() {
        // 1. Find weakest category (lowest mastery %)
        const categories = await dbManager.getAll('SELECT * FROM category_progress');

        // @ts-ignore
        let weakestCategory = categories.sort((a, b) => a.mastery_level - b.mastery_level)[0];

        if (!weakestCategory) {
            // If no progress, pick the first category
            const firstCat = await dbManager.getFirst('SELECT * FROM categories ORDER BY order_index ASC LIMIT 1');
            if (firstCat) {
                weakestCategory = {
                    // @ts-ignore
                    category_id: firstCat.id,
                    mastery_level: 0,
                    // @ts-ignore
                    name: firstCat.display_name
                };
            }
        } else {
            // Fetch category name
            // @ts-ignore
            const catDetails = await dbManager.getFirst('SELECT * FROM categories WHERE id = ?', [weakestCategory.category_id]);
            // @ts-ignore
            weakestCategory.name = catDetails?.display_name;
        }

        return {
            focus_area: weakestCategory,
            // Add more recommendations later
        };
    }
}
