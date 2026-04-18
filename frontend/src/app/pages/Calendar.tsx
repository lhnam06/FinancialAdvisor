import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { mockTransactions, Transaction } from "../lib/mockData";
import {
  ChevronLeft,
  ChevronRight,
  Wallet,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  MinusCircle,
  PlusCircle,
  ArrowLeftRight,
} from "lucide-react";

export function Calendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [selectedDay, setSelectedDay] = useState(24);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const startingDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const shortMoney = (amount: number) => {
    const n = Math.round(amount);
    if (n === 0) return "0";
    const sign = n < 0 ? "−" : "";
    const abs = Math.abs(n);
    if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(1)}B`;
    if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}tr`;
    if (abs >= 1_000) return `${sign}${Math.round(abs / 1_000)}k`;
    return `${sign}${abs}`;
  };

  const getTransactionsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return transactions.filter((t) => t.date === dateStr);
  };

  const getDayTotals = (day: number) => {
    const list = getTransactionsForDate(day);
    const income = list.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = list.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense, net: income - expense, list };
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  const todayRef = new Date(2026, 2, 24);
  const isToday = (day: number) =>
    day === todayRef.getDate() &&
    month === todayRef.getMonth() &&
    year === todayRef.getFullYear();

  const monthStats = useMemo(() => {
    const inMonth = transactions.filter((t) => t.date.startsWith(monthKey));
    const income = inMonth.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = inMonth.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [transactions, monthKey]);

  const selectedTotals = getDayTotals(selectedDay);
  const selectedList = selectedTotals.list;

  type Cell = {
    key: string;
    day: number;
    inMonth: boolean;
  };

  const cells: Cell[] = useMemo(() => {
    const list: Cell[] = [];
    for (let i = startingDayOfWeek - 1; i >= 0; i -= 1) {
      const d = daysInPrevMonth - i;
      list.push({ key: `prev-${d}`, day: d, inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      list.push({ key: `cur-${d}`, day: d, inMonth: true });
    }
    const tailCount = (7 - (list.length % 7)) % 7;
    for (let d = 1; d <= tailCount; d += 1) {
      list.push({ key: `next-${d}`, day: d, inMonth: false });
    }
    return list;
  }, [startingDayOfWeek, daysInPrevMonth, daysInMonth]);

  const monthLabel = `Tháng ${String(month + 1).padStart(2, "0")} ${year}`;

  return (
    <div className="max-w-md mx-auto min-h-screen pb-6">
      {/* Minimal hero */}
      <div className="px-5 pt-5 pb-5">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-foreground/10 h-10 w-10"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold">Lịch tài chính</h1>
        </div>
      </div>

      {/* Summary strip */}
      <div className="px-4 -mt-5">
        <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm px-4 py-3 shadow-sm">
          <div className="flex items-center justify-center gap-5 flex-wrap text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-500" />
              <span className="text-muted-foreground">Số dư:</span>
              <span
                className={`font-semibold tabular-nums ${
                  monthStats.net >= 0 ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {shortMoney(monthStats.net)} đ
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              <span className="text-muted-foreground">Dòng tiền:</span>
              <span
                className={`font-semibold tabular-nums ${
                  monthStats.net >= 0 ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {monthStats.net >= 0 ? "+" : ""}
                {shortMoney(monthStats.net)} đ
              </span>
            </span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-5 flex-wrap text-sm">
            <span className="inline-flex items-center gap-1.5">
              <ArrowUp className="w-4 h-4 text-emerald-500" />
              <span className="text-muted-foreground">Thu:</span>
              <span className="font-semibold tabular-nums text-emerald-500">
                {shortMoney(monthStats.income)} đ
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ArrowDown className="w-4 h-4 text-rose-500" />
              <span className="text-muted-foreground">Chi:</span>
              <span className="font-semibold tabular-nums text-rose-500">
                {shortMoney(monthStats.expense)} đ
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-3 gap-3">
          <ActionTile
            icon={MinusCircle}
            label="Chi"
            tone="rose"
            onClick={() => navigate("/transactions?add=1")}
          />
          <ActionTile
            icon={PlusCircle}
            label="Thu"
            tone="emerald"
            onClick={() => navigate("/transactions?add=1")}
          />
          <ActionTile
            icon={ArrowLeftRight}
            label="Chuyển"
            tone="sky"
            onClick={() => navigate("/transactions?add=1")}
          />
        </div>
      </div>

      {/* Calendar panel */}
      <div className="px-4 mt-5">
        <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 sm:p-5">
          <h2 className="text-base font-semibold mb-4">Lịch giao dịch</h2>

          {/* Month nav */}
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-foreground/[0.04] border border-border/60 hover:bg-foreground/[0.08]"
              onClick={previousMonth}
              aria-label="Tháng trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <p className="text-lg font-semibold capitalize leading-none">
                {monthLabel}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Năm {year}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-foreground/[0.04] border border-border/60 hover:bg-foreground/[0.08]"
              onClick={nextMonth}
              aria-label="Tháng sau"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 text-center mt-2 mb-1">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
              <div
                key={d}
                className="text-[11px] font-medium text-muted-foreground py-1.5"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((cell) => {
              if (!cell.inMonth) {
                return (
                  <div
                    key={cell.key}
                    className="h-14 flex flex-col items-center justify-center text-muted-foreground/50 select-none"
                  >
                    <span className="text-[15px] font-medium">{cell.day}</span>
                  </div>
                );
              }

              const { expense, income } = getDayTotals(cell.day);
              const isSelected = selectedDay === cell.day;
              const today = isToday(cell.day);

              let secondary: { text: string; tone: string } | null = null;
              if (expense > 0) {
                secondary = {
                  text: `−${shortMoney(expense)}`,
                  tone: isSelected ? "text-white/85" : "text-rose-500",
                };
              } else if (income > 0) {
                secondary = {
                  text: `+${shortMoney(income)}`,
                  tone: isSelected ? "text-white/85" : "text-emerald-500",
                };
              }

              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => setSelectedDay(cell.day)}
                  className={`h-14 mx-0.5 flex flex-col items-center justify-center rounded-xl transition-colors ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-[0_6px_18px_rgba(16,185,129,0.35)]"
                      : today
                        ? "bg-emerald-500/10 ring-1 ring-emerald-500/40 text-foreground"
                        : "text-foreground hover:bg-foreground/[0.05]"
                  }`}
                >
                  <span
                    className={`text-[15px] leading-none ${
                      isSelected ? "font-bold" : "font-medium"
                    }`}
                  >
                    {cell.day}
                  </span>
                  {secondary ? (
                    <span
                      className={`mt-1 text-[10px] leading-none tabular-nums ${secondary.tone}`}
                    >
                      {secondary.text}
                    </span>
                  ) : (
                    <span className="mt-1 text-[10px] leading-none text-muted-foreground/40">
                      ·
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected day detail */}
      <div className="px-4 mt-6">
        <h2 className="text-base font-semibold mb-2">
          Giao dịch ngày {selectedDay}/{month + 1}/{year}
        </h2>
        {selectedList.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card/60 p-8 text-center text-muted-foreground">
            <p className="text-sm">Không có giao dịch trong ngày này</p>
            <Button
              variant="outline"
              className="mt-4 h-10 text-sm"
              onClick={() => navigate("/transactions?add=1")}
            >
              Thêm giao dịch
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 bg-card/60 divide-y divide-border/60 overflow-hidden">
            {selectedList.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {transaction.category}
                  </p>
                </div>
                <p
                  className={`text-sm font-semibold tabular-nums ${
                    transaction.type === "income"
                      ? "text-emerald-500"
                      : "text-rose-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "−"}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type Tone = "rose" | "emerald" | "sky";

interface ActionTileProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone: Tone;
  onClick: () => void;
}

function ActionTile({ icon: Icon, label, tone, onClick }: ActionTileProps) {
  const toneClasses: Record<Tone, { border: string; text: string; glow: string; bg: string }> = {
    rose: {
      border: "border-rose-500/35",
      text: "text-rose-500",
      glow: "shadow-[0_0_24px_rgba(244,63,94,0.18)]",
      bg: "bg-rose-500/[0.06]",
    },
    emerald: {
      border: "border-emerald-500/35",
      text: "text-emerald-500",
      glow: "shadow-[0_0_24px_rgba(16,185,129,0.20)]",
      bg: "bg-emerald-500/[0.06]",
    },
    sky: {
      border: "border-sky-500/35",
      text: "text-sky-500",
      glow: "shadow-[0_0_24px_rgba(14,165,233,0.18)]",
      bg: "bg-sky-500/[0.06]",
    },
  };
  const c = toneClasses[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-16 rounded-2xl border ${c.border} ${c.bg} ${c.glow} flex flex-col items-center justify-center gap-1 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
    >
      <Icon className={`w-5 h-5 ${c.text}`} />
      <span className={`text-sm font-semibold ${c.text}`}>{label}</span>
    </button>
  );
}
