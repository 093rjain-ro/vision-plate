"use client";

import { useState } from "react";
import { Card } from "./ui/Card";
import { Sparkles, Loader2, Plus } from "lucide-react";
import { useStore } from "@/store/useStore";
import { DiaryEntry } from "@/types";

export function AISuggest() {
  const { getRemainingMacros, preferences, addDiaryEntry } = useStore();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const macros = getRemainingMacros();
      const prefs = preferences?.cuisine_prefs.slice(0, 2).join(", ") || "any";
      
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ macros, prefs })
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setSuggestions(data);
      }
    } catch (e) {
      console.error("Failed to fetch AI suggestions", e);
    }
    setLoading(false);
  };

  const handleAdd = (s: any) => {
    const entry: DiaryEntry = {
      id: Math.random().toString(36).substring(7),
      food_name: s.name,
      meal_type: "Snacks",
      kcal: s.kcal,
      protein: s.protein,
      carbs: s.carbs,
      fat: s.fat,
      fiber: 0, sugar: 0, sodium: 0, vitamins: {}, serving_g: 100,
    };
    addDiaryEntry(entry);
    setSuggestions(prev => prev.filter(item => item.name !== s.name));
  };

  return (
    <div className="mt-8 mb-4">
      {!suggestions.length && !loading && (
        <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#2A1800] border-primary/20 p-4 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors" onClick={fetchSuggestions}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-white font-bold">AI Meal Ideas</h3>
              <p className="text-primary/80 text-xs font-medium">Find meals that fit your remaining macros</p>
            </div>
          </div>
        </Card>
      )}

      {loading && (
        <Card className="p-6 flex flex-col items-center justify-center gap-3 border-primary/20">
          <Loader2 size={24} className="text-primary animate-spin" />
          <p className="text-muted text-sm">Claude is generating tailored recipes...</p>
        </Card>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Sparkles size={16} className="text-primary" /> AI Suggestions
          </h3>
          {suggestions.map((s, i) => (
            <Card key={i} className="p-4 border-border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-white font-bold text-sm">{s.name}</h4>
                  <p className="text-muted text-xs mt-0.5 leading-snug pr-4">{s.reason}</p>
                </div>
                <button onClick={() => handleAdd(s)} className="bg-primary hover:bg-primary/90 text-black w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105">
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex gap-3 text-[10px] font-semibold mt-3">
                <span className="text-primary bg-primary/10 px-2 py-1 rounded">{s.kcal} kcal</span>
                <span className="text-white bg-subtle px-2 py-1 rounded">P: {s.protein}g</span>
                <span className="text-white bg-subtle px-2 py-1 rounded">C: {s.carbs}g</span>
                <span className="text-white bg-subtle px-2 py-1 rounded">F: {s.fat}g</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
