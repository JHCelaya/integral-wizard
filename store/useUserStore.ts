import { create } from 'zustand';
import { ProgressTracker } from '../src/services/ProgressTracker';
import { dbManager } from '../src/database/DatabaseManager';

interface UserState {
    xp: number;
    level: number;
    streak: number;
    xpToNextLevel: number;
    isLoading: boolean;
    goal: string | null;
    setGoal: (goal: string) => void;
    refreshStats: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    xp: 0,
    level: 1,
    streak: 0,
    xpToNextLevel: 100,
    isLoading: true,
    goal: null,
    setGoal: (goal: string) => set({ goal }),
    refreshStats: async () => {
        try {
            const profile = await ProgressTracker.getUserProfile();
            if (profile) {
                // @ts-ignore
                const xp = profile.total_xp;
                // @ts-ignore
                const level = profile.current_level;
                // @ts-ignore
                const streak = profile.daily_streak;

                set({
                    xp,
                    level,
                    streak,
                    xpToNextLevel: (level + 1) * 1000, // Example formula
                    isLoading: false
                });
            }
        } catch (e) {
            console.error("Failed to refresh stats", e);
            set({ isLoading: false });
        }
    }
}));
