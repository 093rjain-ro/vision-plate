"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Minus, Plus, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AIResultPage() {
  const router = useRouter();
  const [servingSize, setServingSize] = useState(1);

  const macros = [
    { label: "Protein", value: "32g", fill: "bg-primary", valueColor: "text-primary", width: "w-[65%]" },
    { label: "Carbs", value: "85g", fill: "bg-[#666]", valueColor: "text-white", width: "w-[80%]" },
    { label: "Fat", value: "18g", fill: "bg-[#444]", valueColor: "text-white", width: "w-[40%]" },
    { label: "Fiber", value: "12g", fill: "bg-[#333]", valueColor: "text-white", width: "w-[25%]" },
  ];

  const handleAdd = () => {
    // In a real app, save to localStorage/DB here
    router.push("/");
  };

  return (
    <div className="relative min-h-full p-6 pb-32">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/scan" className="p-2 -ml-2 rounded-full hover:bg-subtle transition-colors">
          <ChevronLeft size={24} className="text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white">Result</h1>
      </header>

      {/* Trust Moment Card */}
      <Card className="h-[90px] relative overflow-hidden mb-8 border-[0.5px] border-border rounded-[14px]">
        {/* Background gradient simulating food photo tint */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] to-[#1C2010] opacity-80 mix-blend-overlay"></div>
        <div className="absolute inset-0 flex items-center justify-between p-4 z-10">
          <div className="flex flex-col justify-center h-full">
            <div className="text-white font-semibold text-base mb-1">Dal rice + salad</div>
            <div className="text-muted text-xs font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              AI identified · {servingSize} serving{servingSize > 1 ? "s" : ""}
            </div>
          </div>
          <Badge variant="amber" className="px-3 py-1.5 rounded-lg border border-[#3A2A00]">
            <span className="text-black font-bold text-lg">{520 * servingSize} kcal</span>
          </Badge>
        </div>
      </Card>

      {/* Macro Breakdown Bars */}
      <div className="space-y-5 mb-8">
        <h3 className="text-white font-semibold mb-4">Macros</h3>
        {macros.map((macro) => (
          <div key={macro.label} className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <span className="text-muted text-sm font-medium">{macro.label}</span>
              <span className={`text-sm font-bold ${macro.valueColor}`}>{macro.value}</span>
            </div>
            <div className="h-1.5 w-full bg-subtle rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${macro.fill} ${macro.width}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Serving Size Adjuster */}
      <Card className="flex items-center justify-between p-4 mb-10 rounded-[10px]">
        <span className="text-muted text-sm font-medium">Serving size</span>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setServingSize(Math.max(0.5, servingSize - 0.5))}
            className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center hover:bg-subtle transition-colors"
          >
            <Minus size={16} className="text-[#888]" />
          </button>
          <span className="text-white font-semibold w-6 text-center">{servingSize}x</span>
          <button 
            onClick={() => setServingSize(servingSize + 0.5)}
            className="w-8 h-8 rounded-full border border-primary flex items-center justify-center hover:bg-primary/20 transition-colors bg-primary/10"
          >
            <Plus size={16} className="text-primary" />
          </button>
        </div>
      </Card>

      {/* Add to Diary CTA */}
      <div className="fixed bottom-24 left-6 right-6 md:absolute md:bottom-8 z-40">
        <button 
          onClick={handleAdd}
          className="w-full bg-primary hover:bg-primary/90 text-black font-medium text-lg py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
        >
          Add to diary
        </button>
      </div>
    </div>
  );
}
