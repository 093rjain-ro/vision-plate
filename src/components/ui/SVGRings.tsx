import React from "react";
import { cn } from "./Card";

interface SVGRingProps {
  radius?: number;
  strokeWidth?: number;
  progress?: number; // 0 to 100
  size?: number;
  trackColor?: string;
  fillColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SVGRing({
  radius = 50,
  strokeWidth = 12,
  progress = 0,
  size = 140,
  trackColor = "#1E1E1E",
  fillColor = "#F5A623",
  className,
  children,
}: SVGRingProps) {
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  // Cap progress between 0 and 100
  const validProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (validProgress / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
