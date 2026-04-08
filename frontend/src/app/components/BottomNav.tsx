import React, { useState } from "react";
import { Link } from "react-router";
import {
  Home,
  PieChart,
  Bot,
  BarChart3,
  Plus,
  Mic,
  ScanLine,
  Keyboard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface BottomNavProps {
  currentPath: string;
}

export function BottomNav({ currentPath }: BottomNavProps) {
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  const navItems = [
    { path: "/", icon: Home, label: "Tổng quan", activeColor: "text-emerald-300" },
    { path: "/budget", icon: PieChart, label: "Ngân sách", activeColor: "text-orange-300" },
    { path: "/reports", icon: BarChart3, label: "Báo cáo", activeColor: "text-violet-300" },
    { path: "/ai-advisor", icon: Bot, label: "AI", activeColor: "text-cyan-300" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-2">
      <div
        className="pointer-events-none absolute inset-x-2 bottom-2 mx-auto max-w-md rounded-[2rem] border border-white/12 bg-white/[0.008]"
        style={{
          height: "calc(66px + env(safe-area-inset-bottom))",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      />
      <nav
        className="relative z-10 flex justify-around items-center max-w-md mx-auto px-2 rounded-[2rem] border border-white/16 bg-white/[0.025] backdrop-blur-md backdrop-saturate-125 shadow-[0_6px_16px_rgba(2,6,23,0.08)]"
        style={{
          height: "calc(66px + env(safe-area-inset-bottom))",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/7 via-white/2 to-transparent" />
        <div className="pointer-events-none absolute inset-[1px] rounded-[calc(2rem-1px)] border border-white/6" />
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-white/16" />

        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative z-10 flex flex-col items-center justify-center flex-1 h-[54px] mx-1 my-1 rounded-[1.35rem] border transition-all duration-200 ${
                isActive
                  ? "text-white bg-white/10 border-white/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                  : "text-white/85 border-transparent hover:text-white hover:bg-white/4"
              }`}
            >
              <Icon className="w-[18px] h-[18px] mb-1" strokeWidth={2} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        <DropdownMenu modal={false} onOpenChange={setIsQuickMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={`relative z-10 flex flex-col items-center justify-center flex-1 h-[54px] mx-1 my-1 rounded-[1.35rem] border group transition-all ${
                isQuickMenuOpen
                  ? "bg-white/10 border-white/18"
                  : "border-transparent hover:bg-white/4"
              }`}
              aria-label="Thêm nhanh"
            >
              <div
                className={`-mt-6 h-14 w-14 rounded-[1rem] border-2 flex items-center justify-center text-white transition-all duration-200 ${
                  isQuickMenuOpen
                    ? "border-cyan-200 bg-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.52)] ring-2 ring-cyan-200/45"
                    : "border-cyan-300/95 bg-cyan-500 shadow-[0_0_18px_rgba(34,211,238,0.42)] hover:bg-cyan-400"
                }`}
              >
                <Plus
                  className={`w-5 h-5 transition-transform duration-200 ${isQuickMenuOpen ? "rotate-45" : "rotate-0"}`}
                  strokeWidth={2.2}
                />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="center"
            sideOffset={10}
            className="w-60 border border-white/16 bg-white/[0.08] text-slate-100 backdrop-blur-md backdrop-saturate-120 p-2 rounded-2xl shadow-[0_6px_16px_rgba(2,6,23,0.12)]"
          >
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg border border-cyan-500/20 bg-slate-900/80 px-3 py-2.5 mb-2">
              <Link to="/smart-input?mode=voice" className="flex items-center gap-3">
                <Mic className="h-4 w-4 text-cyan-300" />
                <span className="text-sm">Giọng nói</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg border border-emerald-500/20 bg-slate-900/80 px-3 py-2.5 mb-2">
              <Link to="/transactions?add=1" className="flex items-center gap-3">
                <Keyboard className="h-4 w-4 text-emerald-300" />
                <span className="text-sm">Nhập thủ công</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg border border-violet-500/20 bg-slate-900/80 px-3 py-2.5">
              <Link to="/smart-input?mode=scan" className="flex items-center gap-3">
                <ScanLine className="h-4 w-4 text-violet-300" />
                <span className="text-sm">OCR / Quét hóa đơn</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative z-10 flex flex-col items-center justify-center flex-1 h-[54px] mx-1 my-1 rounded-[1.35rem] border transition-all duration-200 ${
                isActive
                  ? "text-white bg-white/10 border-white/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                  : "text-white/85 border-transparent hover:text-white hover:bg-white/4"
              }`}
            >
              <Icon className="w-[18px] h-[18px] mb-1" strokeWidth={2} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
