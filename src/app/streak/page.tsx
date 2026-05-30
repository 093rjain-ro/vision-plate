"use client";

import { Card } from "@/components/ui/Card";
import { Flame, Award } from "lucide-react";

export default function StreakPage() {
  // Generate 21 days data (last 21 days ending today)
  const dots = Array.from({ length: 21 }).map((_, i) => {
    if (i < 15) return "completed";
    if (i === 15) return "missed";
    if (i > 15 && i < 20) return "completed";
    if (i === 20) return "today";
    return "future";
  });

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

      {/* Achievement Card */}
      <h2 className="text-lg font-semibold text-white mb-4">Achievements</h2>
      <Card className="bg-[#1A1A00] border-[#3A2A00] flex items-center p-4 gap-4">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(245,166,35,0.4)]">
          <Award size={20} className="text-black fill-black" />
        </div>
        <div className="flex flex-col">
          <span className="text-primary text-sm font-bold mb-0.5">2-Week Warrior</span>
          <span className="text-[#888] text-[11px] font-medium leading-snug">
            Logged every day for 14 days. Amazing consistency!
          </span>
        </div>
      </Card>
    </div>
  );
}
