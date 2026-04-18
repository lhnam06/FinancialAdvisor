import { Moon, Sun } from "lucide-react";
import { useTheme } from "../lib/theme";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      title={isDark ? "Chế độ sáng" : "Chế độ tối"}
      className={
        "group relative inline-flex h-10 w-10 items-center justify-center touch-manipulation " +
        "rounded-full border border-foreground/15 bg-foreground/[0.06] text-foreground " +
        "backdrop-blur-md shadow-[0_6px_18px_rgba(0,0,0,0.15)] " +
        "transition-all duration-300 hover:bg-foreground/[0.12] hover:scale-[1.04] " +
        "active:scale-95 motion-reduce:hover:scale-100 motion-reduce:active:scale-100 " +
        className
      }
    >
      <Sun
        className={
          "absolute h-5 w-5 text-amber-400 transition-all duration-300 " +
          (isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-50 opacity-0")
        }
      />
      <Moon
        className={
          "absolute h-5 w-5 text-indigo-400 transition-all duration-300 " +
          (isDark
            ? "rotate-90 scale-50 opacity-0"
            : "rotate-0 scale-100 opacity-100")
        }
      />
    </button>
  );
}
