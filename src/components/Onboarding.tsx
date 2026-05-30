"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types";
import { Card } from "./ui/Card";

export function Onboarding() {
  const profile = useStore((state) => state.profile);
  const setProfile = useStore((state) => state.setProfile);
  const [isOpen, setIsOpen] = useState(!profile);
  
  const [formData, setFormData] = useState<Partial<Profile>>(profile || {
    gender: "male",
    activity_level: "sedentary",
    goal: "maintain"
  });

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!formData.name || !formData.age || !formData.weight_kg || !formData.height_cm) {
      alert("Please fill all fields.");
      return;
    }

    // Mifflin-St Jeor Formula
    let bmr = (10 * formData.weight_kg) + (6.25 * formData.height_cm) - (5 * formData.age);
    bmr += formData.gender === "male" ? 5 : -161;

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    const tdee = Math.round(bmr * activityMultipliers[formData.activity_level as keyof typeof activityMultipliers]);

    let calorie_target = tdee;
    if (formData.goal === "lose") calorie_target -= 500;
    if (formData.goal === "gain") calorie_target += 500;

    const newProfile: Profile = {
      ...formData as Profile,
      tdee,
      calorie_target,
      user_id: "local" // fallback
    };

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        newProfile.user_id = user.id;
        await supabase.from("profiles").upsert([newProfile]);
      }
    } catch (e) {
      console.warn("Could not save to Supabase, persisting locally");
    }

    setProfile(newProfile);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to Vision Plate</h2>
        <p className="text-muted text-sm mb-6">Let's set up your profile to calculate your exact calorie goals.</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-muted text-xs uppercase font-bold tracking-wider">Name</label>
            <input type="text" className="w-full bg-subtle border border-border rounded-lg p-3 text-white mt-1" 
              value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Alex" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-muted text-xs uppercase font-bold tracking-wider">Age</label>
              <input type="number" className="w-full bg-subtle border border-border rounded-lg p-3 text-white mt-1" 
                value={formData.age || ""} onChange={e => setFormData({...formData, age: Number(e.target.value)})} />
            </div>
            <div>
              <label className="text-muted text-xs uppercase font-bold tracking-wider">Gender</label>
              <select className="w-full bg-subtle border border-border rounded-lg p-3 text-white mt-1"
                value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-muted text-xs uppercase font-bold tracking-wider">Weight (kg)</label>
              <input type="number" className="w-full bg-subtle border border-border rounded-lg p-3 text-white mt-1" 
                value={formData.weight_kg || ""} onChange={e => setFormData({...formData, weight_kg: Number(e.target.value)})} />
            </div>
            <div>
              <label className="text-muted text-xs uppercase font-bold tracking-wider">Height (cm)</label>
              <input type="number" className="w-full bg-subtle border border-border rounded-lg p-3 text-white mt-1" 
                value={formData.height_cm || ""} onChange={e => setFormData({...formData, height_cm: Number(e.target.value)})} />
            </div>
          </div>

          <div>
            <label className="text-muted text-xs uppercase font-bold tracking-wider">Activity Level</label>
            <select className="w-full bg-subtle border border-border rounded-lg p-3 text-white mt-1"
              value={formData.activity_level} onChange={e => setFormData({...formData, activity_level: e.target.value as any})}>
              <option value="sedentary">Sedentary (Little/no exercise)</option>
              <option value="light">Light (Exercise 1-3 days/wk)</option>
              <option value="moderate">Moderate (Exercise 3-5 days/wk)</option>
              <option value="active">Active (Exercise 6-7 days/wk)</option>
              <option value="very_active">Very Active (Hard exercise)</option>
            </select>
          </div>

          <div>
            <label className="text-muted text-xs uppercase font-bold tracking-wider">Goal</label>
            <select className="w-full bg-subtle border border-border rounded-lg p-3 text-white mt-1"
              value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value as any})}>
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Muscle</option>
            </select>
          </div>

          <button onClick={handleSave} className="w-full bg-primary text-black font-bold py-3.5 rounded-xl mt-4 hover:bg-primary/90 transition-colors">
            Calculate My Goals
          </button>
        </div>
      </Card>
    </div>
  );
}
