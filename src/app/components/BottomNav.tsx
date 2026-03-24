import React from "react";
import { Link } from "react-router";
import {
  Home,
  PieChart,
  Bot,
  BarChart3,
  Plus,
} from "lucide-react";

interface BottomNavProps {
  currentPath: string;
}

export function BottomNav({ currentPath }: BottomNavProps) {
  const navItems = [
    { path: "/", icon: Home, label: "Tổng quan", activeColor: "text-emerald-300" },
    { path: "/budget", icon: PieChart, label: "Ngân sách", activeColor: "text-orange-300" },
    { path: "/reports", icon: BarChart3, label: "Báo cáo", activeColor: "text-violet-300" },
    { path: "/ai-advisor", icon: Bot, label: "AI", activeColor: "text-cyan-300" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <nav className="flex justify-around items-center h-16 max-w-md mx-auto px-2 border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl shadow-[0_-10px_30px_rgba(2,6,23,0.6)]">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? item.activeColor : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}

        <Link
          to="/transactions?add=1"
          className="flex flex-col items-center justify-center flex-1 h-full"
          aria-label="Thêm giao dịch"
        >
          <div className="h-10 w-10 rounded-lg border-2 border-cyan-400/80 bg-cyan-500 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-colors">
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </div>
        </Link>

        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? item.activeColor : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
