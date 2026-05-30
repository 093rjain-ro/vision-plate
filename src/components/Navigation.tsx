"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Camera, BarChart2, Flame } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const TABS = [
  { name: "Diary", href: "/", icon: Book },
  { name: "Scan", href: "/scan", icon: Camera },
  { name: "Progress", href: "/progress", icon: BarChart2 },
  { name: "Streak", href: "/streak", icon: Flame },
];

export default function Navigation({ className, isMobile }: { className?: string; isMobile?: boolean }) {
  const pathname = usePathname();

  if (isMobile) {
    return (
      <nav className={cn("bg-[#141414] border-t border-border flex justify-around items-center h-[72px] pb-safe", className)}>
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1"
            >
              <tab.icon size={24} className={isActive ? "text-primary" : "text-muted"} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn("text-[10px] font-medium", isActive ? "text-primary" : "text-muted")}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className={cn("bg-[#141414] border-r border-border h-[100dvh] flex flex-col py-6 transition-all duration-300", className)}>
      <div className="flex items-center justify-center lg:justify-start lg:px-6 mb-10">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Flame size={18} className="text-black" />
        </div>
        <span className="ml-3 font-bold text-lg hidden lg:block text-white">Vision Plate</span>
      </div>

      <div className="flex flex-col gap-2 px-2 lg:px-4">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex items-center justify-center lg:justify-start p-3 rounded-xl transition-colors group",
                isActive ? "bg-primary/10 text-primary" : "hover:bg-subtle text-muted hover:text-white"
              )}
            >
              <tab.icon size={22} className={isActive ? "text-primary" : "group-hover:text-white"} />
              <span className="ml-3 font-medium hidden lg:block">
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
