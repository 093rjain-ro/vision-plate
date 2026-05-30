"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SVGRing } from "@/components/ui/SVGRings";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function DailyDiary() {
  const macros = [
    { label: "Protein", value: "72g", color: "bg-primary", valueColor: "text-primary", progress: "w-3/4" },
    { label: "Carbs", value: "110g", color: "bg-white/50", valueColor: "text-white", progress: "w-1/2" },
    { label: "Fat", value: "40g", color: "bg-white/50", valueColor: "text-white", progress: "w-1/2" },
  ];

  const meals = [
    { section: "Breakfast", name: "Oatmeal & Berries", kcal: 320 },
    { section: "Lunch", name: "Chicken Salad", kcal: 450 },
    { section: "Dinner", name: "Salmon & Rice", kcal: 600 },
    { section: "Snacks", name: "Almonds", kcal: 110 },
  ];

  return (
    <div className="relative min-h-full p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white">Today</h1>
        <p className="text-muted text-sm">Friday, May 29</p>
      </header>

      {/* Hero Element: Calorie Ring */}
      <div className="flex justify-center mb-10">
        <SVGRing radius={80} strokeWidth={16} size={200} progress={74}>
          <div className="text-4xl font-bold text-white tracking-tighter">1,480</div>
          <div className="text-muted text-xs mt-1 font-medium">of 2,000 kcal</div>
          <div className="text-primary text-sm font-semibold mt-2">520 left</div>
        </SVGRing>
      </div>

      {/* Macro Mini-Row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {macros.map((macro) => (
          <Card key={macro.label} className="p-3">
            <div className="text-[10px] text-muted mb-1 uppercase tracking-wider font-semibold">
              {macro.label}
            </div>
            <div className={`text-base font-bold mb-2 ${macro.valueColor}`}>
              {macro.value}
            </div>
            <div className="h-[3px] w-full bg-subtle rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${macro.color} ${macro.progress}`}></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Meal List */}
      <div className="space-y-4 mb-20 md:mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Diary</h2>
        {meals.map((meal, index) => (
          <Card key={index} className="flex items-center justify-between p-4 !rounded-xl">
            <div className="flex flex-col">
              <span className="text-[11px] text-muted uppercase tracking-wider font-semibold mb-0.5">
                {meal.section}
              </span>
              <span className="text-sm font-medium text-white">{meal.name}</span>
            </div>
            <div className="bg-[#2A1800] px-3 py-1.5 rounded-lg border border-[#3A2A00]">
              <span className="text-primary font-bold text-sm">{meal.kcal} kcal</span>
            </div>
          </Card>
        ))}
      </div>

      {/* FAB - Floating Action Button */}
      <Link href="/scan">
        <div className="fixed bottom-24 right-6 md:absolute md:bottom-6 md:right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-40 cursor-pointer">
          <Plus size={28} className="text-black" />
        </div>
      </Link>
    </div>
  );
}
