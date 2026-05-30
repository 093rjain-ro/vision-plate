"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Image as ImageIcon, Camera as CameraIcon, ScanBarcode, Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { searchFood } from "@/lib/foodSearch";
import { FoodItem, DiaryEntry } from "@/types";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const CUISINES = ["All", "Indian", "Chinese", "Italian", "Mexican", "Japanese", "Mediterranean", "American", "Middle Eastern", "Thai", "Korean", "French", "Brazilian"];
const CATEGORIES = ["All", "Raw", "Cooked", "Packaged", "Restaurant", "Homemade", "Beverage", "Supplement", "Snack", "Dessert"];

export default function ScanPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"camera" | "search" | "barcode">("camera");
  
  // Search state
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [category, setCategory] = useState("All");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { dailyEntries, addDiaryEntry, setCurrentScanResult } = useStore();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await fetch("/api/analyze-food", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: reader.result })
        });
        const data = await res.json();
        setCurrentScanResult(data);
        router.push("/scan/result");
      } catch (error) {
        console.error(error);
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Unique recent foods from local entries (in a real app, from Supabase)
  const recentFoods = Array.from(new Set(dailyEntries.map(e => e.food_name)))
    .map(name => dailyEntries.find(e => e.food_name === name)!)
    .slice(0, 10);

  // Debounced search
  useEffect(() => {
    if (activeTab !== "search") return;
    if (query.length < 2) {
      setResults([]);
      return;
    }
    
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      const items = await searchFood(query, cuisine === "All" ? undefined : cuisine, category === "All" ? undefined : category);
      setResults(items);
      setLoading(false);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, cuisine, category, activeTab]);

  const handleAdd = (item: FoodItem | DiaryEntry) => {
    const entry: DiaryEntry = {
      id: Math.random().toString(36).substring(7),
      food_name: "food_name" in item ? item.food_name : item.name,
      meal_type: "Snacks",
      kcal: "kcal" in item ? item.kcal : item.kcal_per_100g,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      fiber: item.fiber || 0,
      sugar: item.sugar || 0,
      sodium: item.sodium || 0,
      vitamins: item.vitamins || {},
      serving_g: 100,
    };
    addDiaryEntry(entry);
    router.push("/");
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-full h-[100dvh] bg-[#0D0D0D] flex flex-col pt-safe">
      
      {/* Top Navigation Tabs */}
      <div className="flex justify-center gap-4 p-4 z-20">
        <button onClick={() => setActiveTab("camera")} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${activeTab === "camera" ? "bg-primary text-black" : "text-muted hover:text-white"}`}>Camera</button>
        <button onClick={() => setActiveTab("barcode")} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${activeTab === "barcode" ? "bg-primary text-black" : "text-muted hover:text-white"}`}>Barcode</button>
        <button onClick={() => setActiveTab("search")} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${activeTab === "search" ? "bg-primary text-black" : "text-muted hover:text-white"}`}>Search</button>
      </div>

      {activeTab === "barcode" && <BarcodeScanner onCancel={() => setActiveTab("camera")} />}

      {activeTab === "camera" && (
        <div className="flex-1 relative flex flex-col p-4 md:p-8 pt-0">
          <header className="absolute top-2 left-0 right-0 z-10 flex justify-center">
            <div className="bg-black/55 backdrop-blur-sm text-primary text-[10px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-full border border-primary/20 shadow-lg">
              Point at your meal
            </div>
          </header>

          <div className="flex-1 flex flex-col items-center justify-center mt-12 mb-28 md:mb-12 relative w-full max-w-2xl mx-auto h-full">
            <div className="relative w-full h-full bg-[#111] overflow-hidden rounded-2xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#1C2010]/40 z-10 pointer-events-none mix-blend-overlay"></div>
              
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted z-10 border-2 border-dashed border-border rounded-2xl bg-[#1A1A1A]/80 m-4 cursor-pointer hover:bg-[#1E1E1E] transition-colors" onClick={() => fileInputRef.current?.click()}>
                {analyzing ? (
                  <>
                    <Loader2 size={48} className="mb-4 text-primary animate-spin" />
                    <p className="font-medium text-white mb-1">Analyzing food with AI...</p>
                  </>
                ) : (
                  <>
                    <CameraIcon size={48} className="mb-4 text-primary/60" />
                    <p className="font-medium text-white mb-1">Take photo or upload</p>
                  </>
                )}
              </div>

              {/* Corner Brackets */}
              <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl-[3px] z-20"></div>
              <div className="absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr-[3px] z-20"></div>
              <div className="absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 border-primary rounded-bl-[3px] z-20"></div>
              <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-primary rounded-br-[3px] z-20"></div>
              <div className="absolute top-[48%] left-0 right-0 h-[1px] bg-primary opacity-60 shadow-[0_0_8px_rgba(245,166,35,0.8)] z-20 animate-pulse"></div>
            </div>
          </div>

          <div className="absolute bottom-12 md:bottom-8 left-0 right-0 flex items-center justify-center gap-6 px-6 pb-safe z-30">
            <button className="flex items-center justify-center gap-2 bg-subtle border border-border px-4 py-2.5 rounded-full min-w-[100px] hover:bg-subtle/80 transition-colors">
              <ImageIcon size={18} className="text-primary" />
              <span className="text-primary text-sm font-medium">Gallery</span>
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="relative w-[68px] h-[68px] rounded-full border-[3px] border-primary flex items-center justify-center flex-shrink-0 hover:scale-95 transition-transform bg-black/20">
              <div className="w-[50px] h-[50px] bg-primary rounded-full"></div>
            </button>
            <button onClick={() => setActiveTab("search")} className="flex items-center justify-center gap-2 bg-subtle border border-border px-4 py-2.5 rounded-full min-w-[100px] hover:bg-subtle/80 transition-colors">
              <Search size={18} className="text-muted" />
              <span className="text-muted text-sm font-medium">Search</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === "search" && (
        <div className="flex-1 flex flex-col p-4 pb-24 overflow-hidden">
          {/* Search Bar */}
          <div className="relative mb-4 shrink-0">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Search food database..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-subtle border border-border rounded-xl py-3.5 pl-10 pr-4 text-white placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
            />
            {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={16} className="text-muted" /></button>}
          </div>

          {/* Filters */}
          <div className="shrink-0 mb-6 space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CUISINES.map(c => (
                <button key={c} onClick={() => setCuisine(c)} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${cuisine === c ? "bg-primary text-black" : "bg-subtle text-muted hover:text-white"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${category === c ? "bg-white text-black" : "bg-subtle text-muted hover:text-white"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pb-8">
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
            ) : query.length > 1 ? (
              results.length > 0 ? results.map((item, i) => (
                <Card key={i} className="p-4 flex justify-between items-center group hover:border-primary/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold">{item.name}</h3>
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${item.source === 'USDA' ? 'text-green-400 border-green-400/30 bg-green-400/10' : 'text-blue-400 border-blue-400/30 bg-blue-400/10'}`}>
                        {item.source}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted flex gap-2">
                      <span className="text-primary font-bold">{item.kcal_per_100g} kcal</span>
                      <span>P: {item.protein}g</span>
                      <span>C: {item.carbs}g</span>
                      <span>F: {item.fat}g</span>
                    </div>
                  </div>
                  <button onClick={() => handleAdd(item)} className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-black flex items-center justify-center transition-colors">
                    <Plus size={18} />
                  </button>
                </Card>
              )) : (
                <p className="text-muted text-center py-10">No foods found. Try a different search.</p>
              )
            ) : (
              <>
                <h3 className="text-white font-bold mb-3">Recent Foods</h3>
                {recentFoods.length > 0 ? recentFoods.map((meal, i) => (
                  <Card key={i} className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-bold mb-1">{meal.food_name}</h3>
                      <div className="text-xs text-muted flex gap-2">
                        <span className="text-primary font-bold">{meal.kcal} kcal</span>
                        <span>P: {meal.protein}g</span>
                        <span>C: {meal.carbs}g</span>
                        <span>F: {meal.fat}g</span>
                      </div>
                    </div>
                    <button onClick={() => handleAdd(meal)} className="w-8 h-8 rounded-full bg-subtle hover:bg-primary/20 text-white flex items-center justify-center transition-colors">
                      <Plus size={18} />
                    </button>
                  </Card>
                )) : (
                  <p className="text-muted text-sm text-center py-6">You haven't logged any foods recently.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
