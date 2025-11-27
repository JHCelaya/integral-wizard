import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
    theme: 'void' | 'starlit';
    soundEnabled: boolean;
    mathSize: 'small' | 'medium' | 'large';
    toggleSound: () => void;
    setMathSize: (size: 'small' | 'medium' | 'large') => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            theme: 'void',
            soundEnabled: true,
            mathSize: 'medium',
            toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
            setMathSize: (size) => set({ mathSize: size }),
        }),
        {
            name: 'settings-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
