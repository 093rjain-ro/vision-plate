"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { SVGRing } from "@/components/ui/SVGRings";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Onboarding } from "@/components/Onboarding";
import { WaterTracker } from "@/components/WaterTracker";
import { AISuggest } from "@/components/AISuggest";
import { ShareToday } from "@/components/ShareToday";

export default function DailyDiary() {
  const { profile, dailyEntries, getRemainingMacros } = useStore();
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  
  const remaining = getRemainingMacros();
  const tdee = profile?.calorie_target || 2000;
  const consumed = tdee - remaining.kcal;
  const progressPercent = Math.min((consumed / tdee) * 100, 100);

  // Group meals by type
  const mealGroups = {
    Breakfast: dailyEntries.filter(e => e.meal_type === "Breakfast"),
    Lunch: dailyEntries.filter(e => e.meal_type === "Lunch"),
    Dinner: dailyEntries.filter(e => e.meal_type === "Dinner"),
    Snacks: dailyEntries.filter(e => e.meal_type === "Snacks"),
  };

  const macros = [
    { label: "Protein", left: remaining.protein, total: Math.round((tdee * 0.3)/4), color: "bg-primary", valueColor: "text-primary" },
    { label: "Carbs", left: remaining.carbs, total: Math.round((tdee * 0.4)/4), color: "bg-white/50", valueColor: "text-white" },
    { label: "Fat", left: remaining.fat, total: Math.round((tdee * 0.3)/9), color: "bg-white/50", valueColor: "text-white" },
  ];

  return (
    <>
      <Onboarding />
      <div className="relative min-h-full p-6 pb-24" id="diary-summary">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white">Today</h1>
            <p className="text-muted text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <ShareToday elementId="diary-summary" />
        </header>

        {/* Hero Element: Calorie Ring */}
        <div className="flex justify-center mb-10">
          <SVGRing radius={80} strokeWidth={16} size={200} progress={progressPercent}>
            <div className="text-4xl font-bold text-white tracking-tighter">{consumed}</div>
            <div className="text-muted text-xs mt-1 font-medium">of {tdee} kcal</div>
            <div className="text-primary text-sm font-semibold mt-2">{remaining.kcal} left</div>
          </SVGRing>
        </div>

        {/* Macro Mini-Row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {macros.map((macro) => {
            const consumedM = macro.total - macro.left;
            const pct = Math.min((consumedM / macro.total) * 100, 100);
            return (
              <Card key={macro.label} className="p-3">
                <div className="text-[10px] text-muted mb-1 uppercase tracking-wider font-semibold">
                  {macro.label}
                </div>
                <div className={`text-base font-bold mb-2 ${macro.valueColor}`}>
                  {consumedM}g <span className="text-xs text-muted font-normal">/ {macro.total}g</span>
                </div>
                <div className="h-[3px] w-full bg-subtle rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${macro.color}`} style={{ width: `${pct}%` }}></div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Water Tracker */}
        <WaterTracker />

        {/* Meal List */}
        <div className="space-y-6 mb-8">
          {Object.entries(mealGroups).map(([section, meals]) => (
            <div key={section}>
              <h2 className="text-lg font-semibold text-white mb-2">{section}</h2>
              {meals.length === 0 ? (
                <p className="text-muted text-sm italic mb-2">No meals logged yet.</p>
              ) : (
                <div className="space-y-3">
                  {meals.map((meal) => (
                    <Card key={meal.id} className="p-0 overflow-hidden !rounded-xl transition-all">
                      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpandedEntry(expandedEntry === meal.id ? null : meal.id)}>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white">{meal.food_name}</span>
                          <span className="text-xs text-muted mt-0.5">{meal.serving_g}g</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-[#2A1800] px-3 py-1.5 rounded-lg border border-[#3A2A00]">
                            <span className="text-primary font-bold text-sm">{meal.kcal} kcal</span>
                          </div>
                          {expandedEntry === meal.id ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                        </div>
                      </div>
                      
                      {/* Expandable Micronutrients */}
                      {expandedEntry === meal.id && (
                        <div className="bg-subtle/50 px-4 py-3 border-t border-border grid grid-cols-4 gap-2 text-center animate-in slide-in-from-top-2">
                          <div><div className="text-white font-bold">{meal.fiber}g</div><div className="text-[10px] text-muted uppercase font-bold">Fiber</div></div>
                          <div><div className="text-white font-bold">{meal.sugar}g</div><div className="text-[10px] text-muted uppercase font-bold">Sugar</div></div>
                          <div><div className="text-white font-bold">{meal.sodium}mg</div><div className="text-[10px] text-muted uppercase font-bold">Sodium</div></div>
                          <div><div className="text-white font-bold">{meal.protein}g</div><div className="text-[10px] text-muted uppercase font-bold">Protein</div></div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Suggest Card */}
        <AISuggest />

        {/* FAB - Floating Action Button */}
        <Link href="/scan">
          <div className="fixed bottom-24 right-6 md:absolute md:bottom-6 md:right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-40 cursor-pointer">
            <Plus size={28} className="text-black" />
          </div>
        </Link>
      </div>
    </>
  );
}
