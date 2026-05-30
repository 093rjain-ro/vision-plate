"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { lookupBarcode } from "@/lib/foodSearch";
import { FoodItem, DiaryEntry } from "@/types";
import { useStore } from "@/store/useStore";
import { Loader2, Camera, X } from "lucide-react";
import { Card } from "./ui/Card";

export function BarcodeScanner({ onCancel }: { onCancel: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [product, setProduct] = useState<FoodItem | null>(null);
  const addDiaryEntry = useStore(state => state.addDiaryEntry);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let controls: any = null;

    if (scanning && videoRef.current) {
      codeReader.decodeFromVideoDevice(undefined, videoRef.current, async (result, err) => {
        if (result) {
          // Found a barcode
          setScanning(false);
          setLoadingProduct(true);
          const item = await lookupBarcode(result.getText());
          setProduct(item || { name: "Product Not Found", kcal_per_100g: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0, source: "manual" });
          setLoadingProduct(false);
        }
        if (err && err.name !== "NotFoundException") {
          console.warn("Barcode err:", err);
        }
      }).then(c => controls = c).catch(e => console.error("Scanner setup failed:", e));
    }

    return () => {
      if (controls) controls.stop();
    };
  }, [scanning]);

  const handleAdd = () => {
    if (!product || product.name === "Product Not Found") return;
    const entry: DiaryEntry = {
      id: Math.random().toString(36).substring(7),
      food_name: product.name,
      meal_type: "Snacks",
      kcal: product.kcal_per_100g,
      protein: product.protein,
      carbs: product.carbs,
      fat: product.fat,
      fiber: product.fiber, sugar: product.sugar, sodium: product.sodium, vitamins: product.vitamins || {},
      serving_g: 100,
    };
    addDiaryEntry(entry);
    onCancel(); // Close scanner
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#0D0D0D] flex flex-col">
      <header className="flex justify-between items-center p-4 z-10 bg-black/50 backdrop-blur-md">
        <h2 className="text-white font-bold text-lg flex items-center gap-2"><Camera size={20} /> Barcode Scan</h2>
        <button onClick={onCancel} className="p-2 bg-subtle rounded-full"><X size={20} className="text-white" /></button>
      </header>

      {scanning ? (
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay muted playsInline></video>
          
          {/* Overlay Box */}
          <div className="absolute inset-0 z-10 border-[60px] border-black/50">
            <div className="w-full h-full border-2 border-primary relative">
              <div className="absolute top-[50%] left-0 right-0 h-[1px] bg-primary shadow-[0_0_8px_#F5A623] animate-pulse"></div>
            </div>
          </div>
          <div className="absolute bottom-10 z-20 bg-black/60 px-4 py-2 rounded-full text-white text-sm font-medium">
            Align barcode within frame
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0D0D0D]">
          {loadingProduct ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={40} className="text-primary animate-spin" />
              <p className="text-white font-medium">Looking up product...</p>
            </div>
          ) : product ? (
            <Card className="w-full max-w-sm p-6 flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
              {product.name !== "Product Not Found" ? (
                <>
                  <p className="text-muted text-sm mb-6">Per 100g • Source: {product.source}</p>
                  <div className="grid grid-cols-4 gap-2 w-full mb-6">
                    <div className="bg-primary/10 rounded-lg p-2"><div className="text-primary font-bold text-lg">{product.kcal_per_100g}</div><div className="text-[9px] uppercase font-bold text-muted">Kcal</div></div>
                    <div className="bg-subtle rounded-lg p-2"><div className="text-white font-bold text-lg">{product.protein}</div><div className="text-[9px] uppercase font-bold text-muted">Prot</div></div>
                    <div className="bg-subtle rounded-lg p-2"><div className="text-white font-bold text-lg">{product.carbs}</div><div className="text-[9px] uppercase font-bold text-muted">Carb</div></div>
                    <div className="bg-subtle rounded-lg p-2"><div className="text-white font-bold text-lg">{product.fat}</div><div className="text-[9px] uppercase font-bold text-muted">Fat</div></div>
                  </div>
                  <button onClick={handleAdd} className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">Add to Diary</button>
                </>
              ) : (
                <p className="text-muted text-sm mt-2 mb-6">We couldn't find this barcode in our database.</p>
              )}
              <button onClick={() => { setProduct(null); setScanning(true); }} className="w-full bg-subtle text-white font-bold py-3 rounded-xl mt-3 hover:bg-subtle/80 transition-colors">Scan Another</button>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}
