"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useOperatorStore } from "@/lib/store";

export function GlobalNavigation() {
  const pathname = usePathname();
  const { isRegistered, telemetry } = useOperatorStore();

  const links = [
    { href: "/", label: "Radar", icon: "❖" },
    { href: "/identities", label: "Identities", icon: "☥" },
    { href: "/forecast", label: "Forecast", icon: "◷" },
    { href: "/connections", label: "Connections", icon: "⎈" },
    { href: "/story", label: "Story", icon: "⚔️" },
  ];
  if (!isRegistered || !telemetry) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto w-[95%] md:w-auto">
      <div className="flex items-center justify-center gap-1 md:gap-2 p-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-x-auto scrollbar-hide">
        {links.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 group ${
                isActive ? "text-white" : "text-foreground/50 hover:text-white"
              }`}
            >
              <span className={`text-lg transition-transform duration-300 ${isActive ? 'rotate-90 scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'group-hover:rotate-45 group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]'}`}>
                  {icon}
              </span>
              <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.1em] md:tracking-[0.2em] hidden md:block whitespace-nowrap">
                {label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="globalNavActive"
                  className="absolute inset-0 bg-white/5 border border-white/20 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
