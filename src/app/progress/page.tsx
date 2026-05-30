"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { SVGRing } from "@/components/ui/SVGRings";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { useStore } from "@/store/useStore";
import { WeightLog } from "@/components/WeightLog";

export default function ProgressPage() {
  const { profile, dailyEntries } = useStore();
  const [activeTab, setActiveTab] = useState<"macros" | "nutrients">("macros");
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  
  const target = profile?.calorie_target || 2000;

  // Aggregate current day's macros
  const todayMacros = dailyEntries.reduce(
    (acc, entry) => ({
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
      fiber: acc.fiber + entry.fiber,
      sugar: acc.sugar + entry.sugar,
      sodium: acc.sodium + entry.sodium,
    }),
    { protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 }
  );

  const targetProtein = Math.round((target * 0.3) / 4);
  const targetCarbs = Math.round((target * 0.4) / 4);
  const targetFat = Math.round((target * 0.3) / 9);

  // Generate last 7 days of data
  const weeklyData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = ["S", "M", "T", "W", "T", "F", "S"][d.getDay()];
    // Mock historical data, use actual today if i == 6
    const kcal = i === 6 ? dailyEntries.reduce((a, b) => a + b.kcal, 0) : Math.floor(Math.random() * 800) + target - 400;
    return {
      day: dayStr,
      kcal: kcal,
      isToday: i === 6
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const isOver = payload[0].value > target;
      return (
        <div className="bg-[#1A1A1A] border-[0.5px] border-border p-2 rounded-lg shadow-lg">
          <p className={`font-bold text-sm ${isOver ? "text-red-400" : "text-green-400"}`}>{payload[0].value} kcal</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-full p-6 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">Progress</h1>
      </header>

      {/* Weight Log */}
      <WeightLog />

      {/* Weekly Bar Chart (Calorie vs Goal) */}
      <h2 className="text-lg font-semibold text-white mb-4">Calories</h2>
      <Card className="p-4 pt-8 mb-8 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={(props: any) => {
                const { x, y, payload } = props;
                const isToday = weeklyData[payload.index].isToday;
                return (
                  <text x={x} y={y + 12} fill={isToday ? "#fff" : "#555"} fontSize={10} textAnchor="middle" fontWeight={isToday ? "bold" : "normal"}>
                    {payload.value}
                  </text>
                );
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1E1E1E', opacity: 0.4 }} />
            <ReferenceLine y={target} stroke="#888" strokeDasharray="3 3" />
            <Bar dataKey="kcal" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {weeklyData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.kcal > target ? "#ef4444" : "#22c55e"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Tabs for Macros / Nutrients */}
      <div className="flex gap-4 mb-4 border-b border-border pb-2">
        <button onClick={() => setActiveTab("macros")} className={`text-sm font-bold ${activeTab === "macros" ? "text-primary" : "text-muted"}`}>Macros</button>
        <button onClick={() => setActiveTab("nutrients")} className={`text-sm font-bold ${activeTab === "nutrients" ? "text-primary" : "text-muted"}`}>Nutrients</button>
      </div>

      {activeTab === "macros" ? (
        <div className="flex gap-4 mb-8">
          <Card className="flex-1 p-5 flex flex-col items-center justify-center">
            <SVGRing radius={36} strokeWidth={10} size={90} progress={Math.min((todayMacros.protein / targetProtein) * 100, 100)} trackColor="#1E1E1E" fillColor="#F5A623">
              <div className="text-white font-bold text-[12px] leading-tight">{todayMacros.protein}g</div>
              <div className="text-muted text-[9px] font-medium border-b border-muted/30 pb-[1px] mb-[1px]">of {targetProtein}g</div>
              <div className="text-primary text-[9px] font-bold mt-1">Protein</div>
            </SVGRing>
          </Card>
          <div className="flex-1 flex flex-col gap-4">
            <Card className="flex-1 p-3 flex items-center gap-3">
              <SVGRing radius={16} strokeWidth={6} size={44} progress={Math.min((todayMacros.carbs / targetCarbs) * 100, 100)} trackColor="#1E1E1E" fillColor="#888">
                <div className="text-white font-bold text-[10px]">{todayMacros.carbs}</div>
              </SVGRing>
              <div className="flex flex-col">
                <span className="text-muted text-[10px] uppercase font-semibold">Carbs</span>
                <span className="text-white text-xs font-bold mt-0.5">{todayMacros.carbs}g <span className="text-muted font-normal">/ {targetCarbs}g</span></span>
              </div>
            </Card>
            <Card className="flex-1 p-3 flex items-center gap-3">
              <SVGRing radius={16} strokeWidth={6} size={44} progress={Math.min((todayMacros.fat / targetFat) * 100, 100)} trackColor="#1E1E1E" fillColor="#666">
                <div className="text-white font-bold text-[10px]">{todayMacros.fat}</div>
              </SVGRing>
              <div className="flex flex-col">
                <span className="text-muted text-[10px] uppercase font-semibold">Fat</span>
                <span className="text-white text-xs font-bold mt-0.5">{todayMacros.fat}g <span className="text-muted font-normal">/ {targetFat}g</span></span>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-4 space-y-4 mb-8">
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted font-bold uppercase">Fiber</span><span className="text-white">{todayMacros.fiber}g / 30g</span></div>
            <div className="h-1.5 bg-subtle rounded-full"><div className="h-full bg-[#8b5cf6] rounded-full" style={{ width: `${Math.min((todayMacros.fiber/30)*100, 100)}%`}}></div></div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted font-bold uppercase">Sugar</span><span className="text-white">{todayMacros.sugar}g / 40g</span></div>
            <div className="h-1.5 bg-subtle rounded-full"><div className="h-full bg-[#f43f5e] rounded-full" style={{ width: `${Math.min((todayMacros.sugar/40)*100, 100)}%`}}></div></div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted font-bold uppercase">Sodium</span><span className="text-white">{todayMacros.sodium}mg / 2300mg</span></div>
            <div className="h-1.5 bg-subtle rounded-full"><div className="h-full bg-[#3b82f6] rounded-full" style={{ width: `${Math.min((todayMacros.sodium/2300)*100, 100)}%`}}></div></div>
          </div>
        </Card>
      )}

    </div>
  );
}
