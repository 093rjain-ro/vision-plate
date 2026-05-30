"use client";

import { useRef, useState } from "react";
import { toBlob } from "html-to-image";
import { Share, Download, Check } from "lucide-react";
import { useStore } from "@/store/useStore";

export function ShareToday({ elementId }: { elementId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const profile = useStore(state => state.profile);
  const dailyEntries = useStore(state => state.dailyEntries);
  
  const handleShare = async () => {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    setLoading(true);
    try {
      // Temporarily adjust styling for canvas capture if needed
      el.classList.add("exporting");
      
      const blob = await toBlob(el, {
        backgroundColor: "#0D0D0D",
        pixelRatio: 2,
        style: {
          margin: "0",
        }
      });
      
      el.classList.remove("exporting");
      
      if (!blob) throw new Error("Canvas to Blob failed");
      
      const file = new File([blob], `vision-plate-summary.png`, { type: "image/png" });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Vision Plate Summary",
          text: `I tracked ${dailyEntries.reduce((a, b) => a + b.kcal, 0)} kcal today on Vision Plate!`,
          files: [file]
        });
      } else {
        // Fallback to download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `vision-plate-${new Date().toISOString().split('T')[0]}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      console.error("Share failed", e);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleShare} 
      disabled={loading}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-subtle border border-border text-white text-xs font-bold uppercase tracking-wider hover:bg-subtle/80 transition-colors disabled:opacity-50"
    >
      {loading ? <span className="animate-pulse">Capturing...</span> : success ? <><Check size={14} className="text-green-400" /> Saved</> : <><Share size={14} className="text-primary" /> Share Today</>}
    </button>
  );
}
