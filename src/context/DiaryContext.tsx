"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Meal = {
  id: string;
  section: string;
  name: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  date: string;
};

type DiaryContextType = {
  meals: Meal[];
  addMeal: (meal: Omit<Meal, "id" | "date">) => void;
  removeMeal: (id: string) => void;
};

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export function DiaryProvider({ children }: { children: React.ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cal-ai-meals");
    if (saved) {
      try {
        setMeals(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse meals", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when meals change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cal-ai-meals", JSON.stringify(meals));
    }
  }, [meals, isLoaded]);

  const addMeal = (mealData: Omit<Meal, "id" | "date">) => {
    const newMeal: Meal = {
      ...mealData,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split("T")[0],
    };
    setMeals((prev) => [...prev, newMeal]);
  };

  const removeMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <DiaryContext.Provider value={{ meals, addMeal, removeMeal }}>
      {children}
    </DiaryContext.Provider>
  );
}

export function useDiary() {
  const context = useContext(DiaryContext);
  if (context === undefined) {
    throw new Error("useDiary must be used within a DiaryProvider");
  }
  return context;
}
