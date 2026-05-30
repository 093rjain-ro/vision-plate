"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Image as ImageIcon, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Basic desktop detection
    if (window.innerWidth > 1024) {
      setIsDesktop(true);
    } else {
      startCamera();
    }
    
    const handleResize = () => setIsDesktop(window.innerWidth > 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const handleSnap = () => {
    // Simulate capturing a photo and routing to results
    router.push("/scan/result");
  };

  return (
    <div className="relative min-h-full h-[100dvh] bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A] flex flex-col p-4 md:p-8">
      {/* Header */}
      <header className="absolute top-6 left-0 right-0 z-10 flex justify-center pt-safe">
        <div className="bg-black/55 backdrop-blur-sm text-primary text-[10px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-full border border-primary/20 shadow-lg">
          Point at your meal
        </div>
      </header>

      {/* Viewfinder Area */}
      <div className="flex-1 flex flex-col items-center justify-center mt-12 mb-28 md:mb-12 relative w-full max-w-2xl mx-auto h-full">
        <div className="relative w-full h-full bg-[#111] overflow-hidden rounded-2xl shadow-2xl">
          {/* Green-tinted scene simulation overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#1C2010]/40 z-10 pointer-events-none mix-blend-overlay"></div>
          
          {isDesktop ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted z-10 border-2 border-dashed border-border rounded-2xl bg-[#1A1A1A]/80 m-4 cursor-pointer hover:bg-[#1E1E1E] transition-colors" onClick={handleSnap}>
              <UploadCloud size={48} className="mb-4 text-primary/60" />
              <p className="font-medium text-white mb-1">Drag & drop your meal photo</p>
              <p className="text-sm">or click to browse</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            ></video>
          )}

          {/* Corner Brackets */}
          <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl-[3px] z-20"></div>
          <div className="absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr-[3px] z-20"></div>
          <div className="absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 border-primary rounded-bl-[3px] z-20"></div>
          <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-primary rounded-br-[3px] z-20"></div>

          {/* Scan Line */}
          <div className="absolute top-[48%] left-0 right-0 h-[1px] bg-primary opacity-60 shadow-[0_0_8px_rgba(245,166,35,0.8)] z-20 animate-pulse"></div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-12 md:bottom-8 left-0 right-0 flex items-center justify-center gap-6 px-6 pb-safe z-30">
        <button className="flex items-center justify-center gap-2 bg-subtle border border-border px-4 py-2.5 rounded-full min-w-[100px] hover:bg-subtle/80 transition-colors">
          <ImageIcon size={18} className="text-primary" />
          <span className="text-primary text-sm font-medium">Gallery</span>
        </button>

        {/* Snap Button */}
        <button 
          onClick={handleSnap}
          className="relative w-[68px] h-[68px] rounded-full border-[3px] border-primary flex items-center justify-center flex-shrink-0 hover:scale-95 transition-transform bg-black/20"
        >
          <div className="w-[50px] h-[50px] bg-primary rounded-full"></div>
        </button>

        <button className="flex items-center justify-center gap-2 bg-subtle border border-border px-4 py-2.5 rounded-full min-w-[100px] hover:bg-subtle/80 transition-colors">
          <Search size={18} className="text-muted" />
          <span className="text-muted text-sm font-medium">Search</span>
        </button>
      </div>
    </div>
  );
}
