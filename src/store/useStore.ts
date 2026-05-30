import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, DiaryEntry, WaterLog, UserPreferences } from "../types";

interface AppState {
  // User Data
  profile: Profile | null;
  preferences: UserPreferences | null;
  
  // Daily Data
  dailyEntries: DiaryEntry[];
  waterTotalMl: number;
  
  // Temporary State
  currentScanResult: any | null;
  
  // Actions
  setProfile: (profile: Profile) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  addDiaryEntry: (entry: DiaryEntry) => void;
  removeDiaryEntry: (id: string) => void;
  setDailyEntries: (entries: DiaryEntry[]) => void;
  addWater: (amount_ml: number) => void;
  setWaterTotal: (total: number) => void;
  setCurrentScanResult: (result: any) => void;
  
  // Calculated state getters
  getRemainingMacros: () => { kcal: number; protein: number; carbs: number; fat: number };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      preferences: null,
      dailyEntries: [],
      waterTotalMl: 0,
      currentScanResult: null,

      setProfile: (profile) => set({ profile }),
      
      updatePreferences: (prefs) => set((state) => ({
        preferences: state.preferences ? { ...state.preferences, ...prefs } : { user_id: state.profile?.user_id || "", cuisine_prefs: [], category_prefs: [], ...prefs }
      })),

      addDiaryEntry: (entry) => set((state) => ({
        dailyEntries: [...state.dailyEntries, entry]
      })),

      removeDiaryEntry: (id) => set((state) => ({
        dailyEntries: state.dailyEntries.filter((e) => e.id !== id)
      })),

      setDailyEntries: (entries) => set({ dailyEntries: entries }),

      addWater: (amount_ml) => set((state) => ({
        waterTotalMl: state.waterTotalMl + amount_ml
      })),

      setWaterTotal: (total) => set({ waterTotalMl: total }),
      
      setCurrentScanResult: (result) => set({ currentScanResult: result }),

      getRemainingMacros: () => {
        const state = get();
        const tdee = state.profile?.calorie_target || 2000;
        
        // Rough macro split: 30% Protein, 40% Carbs, 30% Fat based on TDEE
        const targetProtein = Math.round((tdee * 0.3) / 4);
        const targetCarbs = Math.round((tdee * 0.4) / 4);
        const targetFat = Math.round((tdee * 0.3) / 9);

        const consumed = state.dailyEntries.reduce(
          (acc, entry) => ({
            kcal: acc.kcal + entry.kcal,
            protein: acc.protein + entry.protein,
            carbs: acc.carbs + entry.carbs,
            fat: acc.fat + entry.fat,
          }),
          { kcal: 0, protein: 0, carbs: 0, fat: 0 }
        );

        return {
          kcal: Math.max(0, tdee - consumed.kcal),
          protein: Math.max(0, targetProtein - consumed.protein),
          carbs: Math.max(0, targetCarbs - consumed.carbs),
          fat: Math.max(0, targetFat - consumed.fat),
        };
      }
    }),
    {
      name: "vision-plate-storage",
    }
  )
);
