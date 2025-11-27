import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    xp: number;
    level: number;
    streak: number;
    unlockedItems: string[];
    completedLessons: string[];
    avatarColor: 'red' | 'blue' | 'green';
    goal: 'ap_calc_bc' | 'calc_2' | 'review';
    addXp: (amount: number) => void;
    completeLesson: (lessonId: string) => void;
    setAvatarColor: (color: 'red' | 'blue' | 'green') => void;
    setGoal: (goal: 'ap_calc_bc' | 'calc_2' | 'review') => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            xp: 0,
            level: 1,
            streak: 0,
            unlockedItems: ['robe_default'],
            completedLessons: [],
            avatarColor: 'blue',
            goal: 'calc_2',
            addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
            completeLesson: (lessonId) =>
                set((state) => ({
                    completedLessons: [...state.completedLessons, lessonId],
                })),
            setAvatarColor: (color) => set({ avatarColor: color }),
            setGoal: (goal) => set({ goal }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
