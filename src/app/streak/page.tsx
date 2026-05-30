"use client";

import { useState, useEffect } from "react";

import { Card } from "@/components/ui/Card";
import { Flame, Award, Lock } from "lucide-react";

export default function StreakPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Generate 21 days data (last 21 days ending today)
  const dots = Array.from({ length: 21 }).map((_, i) => {
    if (i < 15) return "completed";
    if (i === 15) return "missed";
    if (i > 15 && i < 20) return "completed";
    if (i === 20) return "today";
    return "future";
  });

  const achievements = [
    { key: "Protein King", desc: "Hit protein goal 7 days in a row", progress: 4, total: 7, unlocked: false },
    { key: "Hydration Hero", desc: "Hit water goal 5 days", progress: 5, total: 5, unlocked: true },
    { key: "Scanner Pro", desc: "Scan 50 meals via camera", progress: 12, total: 50, unlocked: false },
    { key: "Perfect Day", desc: "Hit calorie goal within ±50 kcal", progress: 1, total: 1, unlocked: true },
    { key: "Month Warrior", desc: "30-day streak", progress: 14, total: 30, unlocked: false },
    { key: "Early Bird", desc: "Log breakfast before 9am for 7 days", progress: 2, total: 7, unlocked: false },
    { key: "Deficit Destroyer", desc: "Maintain calorie deficit for 14 days", progress: 14, total: 14, unlocked: true },
    { key: "Macro Master", desc: "Hit all 3 macro goals in one day, 5 times", progress: 3, total: 5, unlocked: false },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-full p-6 pb-24">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Streak</h1>
      </header>

      {/* Streak Hero */}
      <div className="flex flex-col items-center justify-center py-8 mb-4">
        <div className="text-[52px] leading-none font-medium text-primary tracking-tight">
          14
        </div>
        <div className="text-muted text-[11px] uppercase tracking-wider font-semibold mt-2 mb-4">
          Day Streak
        </div>
        <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
          <Flame size={14} className="text-primary fill-primary" />
          <span className="text-primary text-[11px] font-bold">Keep it going!</span>
        </div>
      </div>

      {/* 21-Day Dot Calendar */}
      <Card className="p-4 mb-8">
        <h3 className="text-[#555] text-[11px] uppercase tracking-[0.05em] font-bold mb-4">
          Last 21 days
        </h3>
        <div className="grid grid-cols-7 gap-[5px] place-items-center">
          {dots.map((status, idx) => {
            let dotClass = "w-[22px] h-[22px] rounded-full flex-shrink-0 transition-all ";
            if (status === "completed") {
              dotClass += "bg-primary";
            } else if (status === "missed") {
              dotClass += "bg-subtle border-[0.5px] border-border";
            } else if (status === "today") {
              dotClass += "bg-primary ring-2 ring-white ring-inset shadow-[0_0_8px_rgba(245,166,35,0.6)]";
            } else {
              dotClass += "bg-subtle opacity-40";
            }
            return <div key={idx} className={dotClass} />;
          })}
        </div>
      </Card>

      {/* Goal Progress Bars */}
      <div className="space-y-5 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Goals</h2>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <span className="text-muted text-sm font-medium">Calorie Goal</span>
            <span className="text-primary text-sm font-bold">85%</span>
          </div>
          <div className="h-1.5 w-full bg-subtle rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-primary w-[85%]"></div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <span className="text-muted text-sm font-medium">Weight Goal</span>
            <span className="text-white text-sm font-bold">60%</span>
          </div>
          <div className="h-1.5 w-full bg-subtle rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-[#444] w-[60%]"></div>
          </div>
        </div>
      </div>

      {/* Expansion: 8 New Achievements */}
      <h2 className="text-lg font-semibold text-white mb-4">Achievements</h2>
      <div className="space-y-3">
        {achievements.map((ach) => (
          <Card key={ach.key} className={`border flex items-center p-4 gap-4 ${ach.unlocked ? "bg-[#1A1A00] border-[#3A2A00]" : "bg-card border-border opacity-60 grayscale-[50%]"}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${ach.unlocked ? "bg-primary shadow-[0_0_12px_rgba(245,166,35,0.4)]" : "bg-subtle"}`}>
              {ach.unlocked ? <Award size={20} className="text-black fill-black" /> : <Lock size={16} className="text-muted" />}
            </div>
            <div className="flex flex-col flex-1">
              <span className={`text-sm font-bold mb-0.5 ${ach.unlocked ? "text-primary" : "text-white"}`}>{ach.key}</span>
              <span className="text-[#888] text-[11px] font-medium leading-snug">
                {ach.desc}
              </span>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1 bg-subtle rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${Math.min((ach.progress / ach.total) * 100, 100)}%` }}></div>
                </div>
                <span className="text-[9px] text-muted font-bold">{ach.progress}/{ach.total}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
