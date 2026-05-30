"use client";

import { useStore } from "@/store/useStore";
import { Card } from "./ui/Card";
import { Droplet, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function WaterTracker() {
  const waterTotalMl = useStore((state) => state.waterTotalMl);
  const addWater = useStore((state) => state.addWater);
  const target = 2500;
  const progressPercent = Math.min((waterTotalMl / target) * 100, 100);

  const handleAdd = async (amount: number) => {
    addWater(amount);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("water_logs").insert([{ user_id: user.id, amount_ml: amount }]);
      }
    } catch (e) {
      console.warn("Failed to sync water to supabase");
    }
  };

  return (
    <Card className="p-4 mb-8">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Droplet size={18} className="text-[#3BA8FF]" />
          <h3 className="text-white font-semibold">Water Tracker</h3>
        </div>
        <span className="text-muted text-sm font-medium">{waterTotalMl} / {target} ml</span>
      </div>

      <div className="h-2 w-full bg-subtle rounded-full overflow-hidden mb-4">
        <div className="h-full bg-[#3BA8FF] transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => handleAdd(250)} className="flex-1 bg-subtle hover:bg-subtle/80 border border-border rounded-lg py-2 flex items-center justify-center gap-1 transition-colors">
          <Plus size={14} className="text-[#3BA8FF]" />
          <span className="text-white text-xs font-semibold">250ml</span>
        </button>
        <button onClick={() => handleAdd(500)} className="flex-1 bg-subtle hover:bg-subtle/80 border border-border rounded-lg py-2 flex items-center justify-center gap-1 transition-colors">
          <Plus size={14} className="text-[#3BA8FF]" />
          <span className="text-white text-xs font-semibold">500ml</span>
        </button>
        <button onClick={() => handleAdd(750)} className="flex-1 bg-subtle hover:bg-subtle/80 border border-border rounded-lg py-2 flex items-center justify-center gap-1 transition-colors">
          <Plus size={14} className="text-[#3BA8FF]" />
          <span className="text-white text-xs font-semibold">750ml</span>
        </button>
      </div>
    </Card>
  );
}
