"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/Card";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { Scale, Plus, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function WeightLog() {
  const [isOpen, setIsOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [logs, setLogs] = useState<{ logged_date: string; weight_kg: number }[]>([]);

  const fetchLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("weight_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: true });
          
        if (!error && data) {
          setLogs(data);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSave = async () => {
    if (!weight) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("weight_logs").insert([{
          user_id: user.id,
          weight_kg: Number(weight),
          logged_date: date
        }]);
        fetchLogs();
      }
    } catch (e) {
      console.warn("Failed to save weight log");
    }
    setIsOpen(false);
  };

  const currentWeight = logs.length > 0 ? logs[logs.length - 1].weight_kg : "--";

  return (
    <>
      <Card className="p-4 mb-6 relative overflow-hidden group">
        <div className="flex justify-between items-start z-10 relative">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scale size={16} className="text-[#888]" />
              <span className="text-muted text-[11px] uppercase tracking-wider font-bold">Weight</span>
            </div>
            <div className="text-white text-xl font-bold">{currentWeight} <span className="text-muted text-sm font-normal">kg</span></div>
          </div>
          <button onClick={() => setIsOpen(true)} className="bg-subtle hover:bg-subtle/80 border border-border w-8 h-8 rounded-full flex items-center justify-center transition-colors">
            <Plus size={16} className="text-white" />
          </button>
        </div>

        {/* Sparkline Chart */}
        {logs.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-16 opacity-50 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logs}>
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                <Line type="monotone" dataKey="weight_kg" stroke="#fff" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Log Weight</h3>
              <button onClick={() => setIsOpen(false)}><X size={20} className="text-muted" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-muted text-xs uppercase font-bold tracking-wider">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-subtle border border-border rounded-lg p-3 text-white mt-1" />
              </div>
              <div>
                <label className="text-muted text-xs uppercase font-bold tracking-wider">Weight (kg)</label>
                <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-subtle border border-border rounded-lg p-3 text-white mt-1" placeholder="75.5" autoFocus />
              </div>
              <button onClick={handleSave} className="w-full bg-white text-black font-bold py-3 rounded-xl mt-2 hover:bg-white/90 transition-colors">
                Save
              </button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
