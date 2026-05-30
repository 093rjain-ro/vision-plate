"use client";

import { Card } from "@/components/ui/Card";
import { SVGRing } from "@/components/ui/SVGRings";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function ProgressPage() {
  const weeklyData = [
    { day: "M", kcal: 1800, isToday: false, isFuture: false },
    { day: "T", kcal: 2100, isToday: false, isFuture: false },
    { day: "W", kcal: 1950, isToday: false, isFuture: false },
    { day: "T", kcal: 1850, isToday: false, isFuture: false },
    { day: "F", kcal: 1480, isToday: true, isFuture: false },
    { day: "S", kcal: 0, isToday: false, isFuture: true },
    { day: "S", kcal: 0, isToday: false, isFuture: true },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1A1A] border-[0.5px] border-border p-2 rounded-lg shadow-lg">
          <p className="text-primary font-bold text-sm">{payload[0].value} kcal</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-full p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white">Progress</h1>
      </header>

      {/* Weekly Bar Chart */}
      <Card className="p-4 pt-6 mb-8 h-[220px]">
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
                  <text x={x} y={y + 12} fill={isToday ? "#F5A623" : "#555"} fontSize={10} textAnchor="middle" fontWeight={isToday ? "bold" : "normal"}>
                    {payload.value}
                  </text>
                );
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1E1E1E', opacity: 0.4 }} />
            <Bar dataKey="kcal" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {weeklyData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isToday ? "#F5A623" : "#1E1E1E"} 
                  opacity={entry.isFuture ? 0.4 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Macro Rings (Size Contrast Layout) */}
      <h2 className="text-lg font-semibold text-white mb-4">Today's Macros</h2>
      <div className="flex gap-4 mb-8">
        {/* Large Ring - Protein */}
        <Card className="flex-1 p-5 flex flex-col items-center justify-center">
          <SVGRing radius={36} strokeWidth={10} size={90} progress={72} trackColor="#1E1E1E" fillColor="#F5A623">
            <div className="text-white font-bold text-[12px] leading-tight">72g</div>
            <div className="text-muted text-[9px] font-medium border-b border-muted/30 pb-[1px] mb-[1px]">of 100g</div>
            <div className="text-primary text-[9px] font-bold mt-1">Protein</div>
          </SVGRing>
        </Card>

        {/* Small Rings - Carbs & Fat */}
        <div className="flex-1 flex flex-col gap-4">
          <Card className="flex-1 p-3 flex items-center gap-3">
            <SVGRing radius={16} strokeWidth={6} size={44} progress={55} trackColor="#1E1E1E" fillColor="#888">
              <div className="text-white font-bold text-[10px]">110</div>
            </SVGRing>
            <div className="flex flex-col">
              <span className="text-muted text-[10px] uppercase font-semibold">Carbs</span>
              <span className="text-white text-xs font-bold mt-0.5">110g <span className="text-muted font-normal">/ 200g</span></span>
            </div>
          </Card>
          
          <Card className="flex-1 p-3 flex items-center gap-3">
            <SVGRing radius={16} strokeWidth={6} size={44} progress={65} trackColor="#1E1E1E" fillColor="#666">
              <div className="text-white font-bold text-[10px]">40</div>
            </SVGRing>
            <div className="flex flex-col">
              <span className="text-muted text-[10px] uppercase font-semibold">Fat</span>
              <span className="text-white text-xs font-bold mt-0.5">40g <span className="text-muted font-normal">/ 60g</span></span>
            </div>
          </Card>
        </div>
      </div>

      {/* Summary Stats Row */}
      <h2 className="text-lg font-semibold text-white mb-4">Summary</h2>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="p-3">
          <div className="text-muted text-[10px] mb-1 font-medium">Avg kcal</div>
          <div className="text-primary text-sm font-bold">1,820</div>
        </Card>
        <Card className="p-3">
          <div className="text-muted text-[10px] mb-1 font-medium">Best day</div>
          <div className="text-white text-sm font-bold">Tue (2.1k)</div>
        </Card>
        <Card className="p-3">
          <div className="text-muted text-[10px] mb-1 font-medium">Deficit</div>
          <div className="text-white text-sm font-bold">-180 /d</div>
        </Card>
      </div>

    </div>
  );
}
