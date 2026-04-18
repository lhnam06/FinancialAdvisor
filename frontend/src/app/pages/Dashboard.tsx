import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Wallet,
  TrendingUp,
  Target,
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Film,
  House,
  HeartPulse,
  BookOpen,
  PiggyBank,
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  Minus,
  ArrowLeftRight,
} from "lucide-react";
import { toast } from "sonner";
import { getDashboardSummary } from "../lib/api/dashboard";
import { ApiCategory, ApiTransaction, getCategories } from "../lib/api/transactions";
import { formatLunarLabel } from "../lib/lunar";
import { useLocale } from "../lib/locale";

type UiTransaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
};

type UiGoalPreview = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  progressPercent: number;
  icon: string;
  deadline: string;
  isCompleted: boolean;
};

type ExpenseCalendarDay = {
  date: string;
  expense: number;
  transactionCount: number;
};

function normalizeTransactionType(value: unknown): "income" | "expense" {
  return String(value).toLowerCase() === "income" ? "income" : "expense";
}

function mapApiTransaction(item: ApiTransaction): UiTransaction {
  return {
    id: item.id,
    type: normalizeTransactionType(item.type),
    amount: Number(item.amount_minor ?? 0),
    category: item.category.name,
    description: item.description,
    date: item.transaction_date,
  };
}

export function Dashboard() {
  const navigate = useNavigate();
  const { locale } = useLocale();

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.toISOString().slice(0, 7));
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10));

  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expense: 0,
  });

  const [budgetSummary, setBudgetSummary] = useState({
    totalLimit: 0,
    totalSpent: 0,
    usagePercent: 0,
    statusText: "",
  });

  const [goalsPreview, setGoalsPreview] = useState<UiGoalPreview[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<UiTransaction[]>([]);
  const [expenseCalendarDays, setExpenseCalendarDays] = useState<ExpenseCalendarDay[]>([]);
  const [selectedDayTransactions, setSelectedDayTransactions] = useState<UiTransaction[]>([]);
  const [selectedDayExpense, setSelectedDayExpense] = useState(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number.isFinite(amount) ? amount : 0);
  };

  const monthLabel = useMemo(() => {
    const [year, month] = currentMonth.split("-").map(Number);
    const loc = locale === "en" ? "en-US" : "vi-VN";
    return new Date(year, month - 1, 1).toLocaleDateString(loc, {
      month: "long",
      year: "numeric",
    });
  }, [currentMonth, locale]);

  const selectedDateLabel = useMemo(() => {
    const loc = locale === "en" ? "en-US" : "vi-VN";
    return new Date(selectedDate).toLocaleDateString(loc, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }, [selectedDate, locale]);

  const loadCategories = async () => {
    try {
      const [expenseRes, incomeRes] = await Promise.all([
        getCategories("expense"),
        getCategories("income"),
      ]);
      setCategories([...expenseRes.items, ...incomeRes.items]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không tải được danh mục");
    }
  };

  const loadDashboard = async (month: string, date: string) => {
    try {
      setIsLoading(true);
      const response = await getDashboardSummary(month, date);

      setSummary({
        balance: Number(response.summary.balance_minor ?? 0),
        income: Number(response.summary.income_minor ?? 0),
        expense: Number(response.summary.expense_minor ?? 0),
      });

      setBudgetSummary({
        totalLimit: Number(response.budget_summary.total_limit_minor ?? 0),
        totalSpent: Number(response.budget_summary.total_spent_minor ?? 0),
        usagePercent: Number(response.budget_summary.usage_percent ?? 0),
        statusText: response.budget_summary.status_text ?? "",
      });

      setGoalsPreview(
        response.goals_preview.map((goal) => ({
          id: goal.id,
          name: goal.name,
          targetAmount: Number(goal.target_minor ?? 0),
          currentAmount: Number(goal.current_minor ?? 0),
          progressPercent: Number(goal.progress_percent ?? 0),
          icon: goal.icon_key,
          deadline: goal.deadline,
          isCompleted: Boolean(goal.is_completed),
        })),
      );

      setRecentTransactions(response.recent_transactions.map(mapApiTransaction));

      setExpenseCalendarDays(
        response.expense_calendar.days.map((day) => ({
          date: day.date,
          expense: Number(day.expense_minor ?? 0),
          transactionCount: Number(day.transaction_count ?? 0),
        })),
      );

      const mappedSelectedDayTransactions = (response.selected_day?.items ?? []).map(mapApiTransaction);

      const selectedDayExpenseFromItems = mappedSelectedDayTransactions.reduce((sum, item) => {
        return item.type === "expense" ? sum + item.amount : sum;
      }, 0);

      const selectedDayExpenseFromResponse = Number(response.selected_day?.total_expense_minor ?? 0);

      const selectedDayExpenseValue =
        selectedDayExpenseFromItems > 0 ? selectedDayExpenseFromItems : selectedDayExpenseFromResponse;

      setSelectedDayTransactions(mappedSelectedDayTransactions);
      setSelectedDayExpense(selectedDayExpenseValue);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không tải được dữ liệu dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadDashboard(currentMonth, selectedDate);
  }, [currentMonth, selectedDate]);

  const getCategoryIcon = (categoryName: string) => {
    const iconName = categories.find((c) => c.name === categoryName)?.icon_key;

    switch (iconName) {
      case "utensils":
        return <UtensilsCrossed className="w-4 h-4 text-amber-300" />;
      case "shopping-bag":
        return <ShoppingBag className="w-4 h-4 text-violet-300" />;
      case "car":
        return <Car className="w-4 h-4 text-cyan-300" />;
      case "film":
        return <Film className="w-4 h-4 text-pink-300" />;
      case "home":
        return <House className="w-4 h-4 text-emerald-300" />;
      case "heart":
        return <HeartPulse className="w-4 h-4 text-rose-300" />;
      case "book":
        return <BookOpen className="w-4 h-4 text-indigo-300" />;
      default:
        return <Wallet className="w-4 h-4 text-slate-300" />;
    }
  };

  const getGoalIcon = (iconKey: string) => {
    switch (iconKey) {
      case "piggy-bank":
        return <PiggyBank className="w-4 h-4 text-cyan-300" />;
      case "target":
        return <Target className="w-4 h-4 text-emerald-300" />;
      default:
        return <Target className="w-4 h-4 text-cyan-300" />;
    }
  };

  const shortCurrency = (amount: number) => {
    const value = Number.isFinite(amount) ? amount : 0;
    const sign = value > 0 ? "+" : "";
    return `${sign}${new Intl.NumberFormat("vi-VN").format(value)} đ`;
  };

  const netFlow = summary.income - summary.expense;

  const goToPreviousMonth = () => {
    const [year, month] = currentMonth.split("-").map(Number);
    const previous = new Date(year, month - 2, 1);
    const next = previous.toISOString().slice(0, 7);
    setCurrentMonth(next);
    setSelectedDate(`${next}-01`);
  };

  const goToNextMonth = () => {
    const [year, month] = currentMonth.split("-").map(Number);
    const next = new Date(year, month, 1);
    const value = next.toISOString().slice(0, 7);
    setCurrentMonth(value);
    setSelectedDate(`${value}-01`);
  };

  const yearLabel = useMemo(() => {
    const [year] = currentMonth.split("-").map(Number);
    return `Năm ${year}`;
  }, [currentMonth]);

  type CalendarCell = {
    date: string;
    day: number;
    solarLabel: string;
    lunarLabel: string;
    inCurrentMonth: boolean;
    expense: number;
  };

  const expenseByDate = useMemo(() => {
    const map = new Map<string, number>();
    expenseCalendarDays.forEach((day) => map.set(day.date, day.expense));
    return map;
  }, [expenseCalendarDays]);

  const calendarCells = useMemo<CalendarCell[]>(() => {
    const [year, month] = currentMonth.split("-").map(Number);
    const firstOfMonth = new Date(year, month - 1, 1);
    const jsDay = firstOfMonth.getDay();
    const leading = jsDay === 0 ? 6 : jsDay - 1;

    const cells: CalendarCell[] = [];
    const start = new Date(year, month - 1, 1 - leading);

    for (let i = 0; i < 42; i += 1) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);
      const iso = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;

      cells.push({
        date: iso,
        day: current.getDate(),
        solarLabel: String(current.getDate()),
        lunarLabel: formatLunarLabel(current),
        inCurrentMonth: current.getMonth() === month - 1,
        expense: expenseByDate.get(iso) ?? 0,
      });
    }

    const lastInMonth = cells.findIndex(
      (cell, idx) => idx >= 35 && cell.inCurrentMonth,
    );
    if (lastInMonth === -1 && cells.slice(35).every((cell) => !cell.inCurrentMonth)) {
      return cells.slice(0, 35);
    }

    return cells;
  }, [currentMonth, expenseByDate]);

  const handleQuickAdd = (type: "income" | "expense") => {
    navigate(`/transactions?add=1&type=${type}`);
  };

  const handleTransfer = () => {
    toast.info("Tính năng chuyển khoản đang được phát triển");
  };

  return (
    <div className="max-w-md mx-auto min-h-screen pb-6">
      <div className="px-4 pt-3 space-y-3">
        <p className="text-center text-xs text-muted-foreground capitalize">{monthLabel}</p>
        <Card className="px-4 py-3 bg-card border border-border text-card-foreground">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-muted-foreground">Số dư:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {isLoading ? "…" : shortCurrency(summary.balance)}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-muted-foreground">Dòng tiền:</span>
              <span
                className={`font-semibold ${
                  netFlow >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
                }`}
              >
                {isLoading ? "…" : shortCurrency(netFlow)}
              </span>
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-sm">
            <span className="flex items-center gap-1.5">
              <ArrowUpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-muted-foreground">Thu:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {isLoading ? "…" : shortCurrency(summary.income)}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <ArrowDownCircle className="w-4 h-4 text-destructive shrink-0" />
              <span className="text-muted-foreground">Chi:</span>
              <span className="font-semibold text-destructive">
                {isLoading ? "…" : shortCurrency(summary.expense)}
              </span>
            </span>
          </div>
        </Card>
      </div>

      <div className="px-4 mt-6 space-y-6">
        <Card className="p-5 bg-slate-900 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-base font-semibold text-slate-100">Ngân sách tháng</p>
              <p className="text-sm text-slate-400 mt-1">
                {budgetSummary.statusText || "Chưa có dữ liệu"}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate("/budget")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-300">{formatCurrency(budgetSummary.totalSpent)}</span>
              <span className="text-slate-400">{formatCurrency(budgetSummary.totalLimit)}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all"
                style={{ width: `${Math.min(budgetSummary.usagePercent, 100)}%` }}
              />
            </div>
          </div>

          <p className="text-sm text-slate-300">
            Đã dùng {budgetSummary.usagePercent.toFixed(0)}%
          </p>
        </Card>

        <Card className="p-5 bg-slate-900 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-semibold text-slate-100">Mục tiêu gần nhất</p>
            <Button variant="ghost" size="icon" onClick={() => navigate("/goals")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {isLoading && <p className="text-sm text-slate-400">Đang tải mục tiêu...</p>}

            {!isLoading && goalsPreview.length === 0 && (
              <p className="text-sm text-slate-400">Chưa có mục tiêu nào</p>
            )}

            {!isLoading &&
              goalsPreview.map((goal) => (
                <div key={goal.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                      {getGoalIcon(goal.icon)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-100">{goal.name}</p>
                      <p className="text-xs text-slate-400">
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all ${goal.isCompleted ? "bg-emerald-500" : "bg-cyan-500"}`}
                      style={{ width: `${Math.min(goal.progressPercent, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleQuickAdd("expense")}
            className="rounded-2xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 transition-colors py-5 flex flex-col items-center justify-center gap-2 text-rose-300"
          >
            <span className="w-9 h-9 rounded-full border border-rose-400/60 flex items-center justify-center">
              <Minus className="w-5 h-5" strokeWidth={2.2} />
            </span>
            <span className="text-base font-semibold">Chi</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd("income")}
            className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors py-5 flex flex-col items-center justify-center gap-2 text-emerald-300"
          >
            <span className="w-9 h-9 rounded-full border border-emerald-400/60 flex items-center justify-center">
              <Plus className="w-5 h-5" strokeWidth={2.2} />
            </span>
            <span className="text-base font-semibold">Thu</span>
          </button>
          <button
            type="button"
            onClick={handleTransfer}
            className="rounded-2xl border border-primary/40 bg-primary/10 hover:bg-primary/20 transition-colors py-5 flex flex-col items-center justify-center gap-2 text-primary"
          >
            <span className="w-9 h-9 rounded-full border border-primary/50 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5" strokeWidth={2.2} />
            </span>
            <span className="text-base font-semibold">Chuyển</span>
          </button>
        </div>

        <Card className="p-5 bg-slate-900 border-slate-800">
          <p className="text-base font-semibold text-slate-100 mb-4">Lịch giao dịch</p>

          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="w-10 h-10 rounded-full border border-slate-700 bg-slate-950/60 flex items-center justify-center text-slate-200 hover:bg-slate-900"
              aria-label="Tháng trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <p className="text-base font-semibold capitalize">{monthLabel}</p>
              <p className="text-xs text-slate-400 mt-0.5">{yearLabel}</p>
            </div>
            <button
              type="button"
              onClick={goToNextMonth}
              className="w-10 h-10 rounded-full border border-slate-700 bg-slate-950/60 flex items-center justify-center text-slate-200 hover:bg-slate-900"
              aria-label="Tháng sau"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((label) => (
              <div key={label} className="text-center text-xs text-slate-400 py-2">
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {calendarCells.map((cell) => {
              const isSelected = cell.date === selectedDate;
              const isDim = !cell.inCurrentMonth;
              const lunarIsMonthMark = cell.lunarLabel.startsWith("T");

              return (
                <button
                  key={cell.date}
                  type="button"
                  onClick={() => setSelectedDate(cell.date)}
                  className={`flex flex-col items-center justify-center py-2 rounded-xl transition-colors ${
                    isSelected
                      ? "bg-emerald-500/20 border border-emerald-400 text-emerald-100"
                      : "border border-transparent hover:bg-slate-800/60"
                  }`}
                >
                  <span
                    className={`text-lg leading-none ${
                      isSelected
                        ? "font-semibold text-emerald-100"
                        : isDim
                          ? "text-slate-600"
                          : "text-slate-100"
                    }`}
                  >
                    {cell.solarLabel}
                  </span>
                  <span
                    className={`mt-1 text-[10px] leading-none ${
                      isDim
                        ? "text-slate-700"
                        : lunarIsMonthMark
                          ? "text-emerald-300 font-medium"
                          : "text-slate-500"
                    }`}
                  >
                    {cell.lunarLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 bg-slate-900 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-base font-semibold text-slate-100">Chi tiêu ngày đã chọn</p>
              <p className="text-sm text-slate-400 mt-1 capitalize">{selectedDateLabel}</p>
            </div>
            <p className="text-sm text-rose-300">{formatCurrency(selectedDayExpense)}</p>
          </div>

          <div className="space-y-3">
            {isLoading && <p className="text-sm text-slate-400">Đang tải giao dịch...</p>}

            {!isLoading && selectedDayTransactions.length === 0 && (
              <p className="text-sm text-slate-400">Không có giao dịch trong ngày này</p>
            )}

            {!isLoading &&
              selectedDayTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                        transaction.type === "income"
                          ? "bg-emerald-500/15 border-emerald-500/30"
                          : "bg-slate-800 border-slate-700"
                      }`}
                    >
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div>
                      <p className="text-sm text-slate-100">{transaction.description}</p>
                      <p className="text-xs text-slate-400">{transaction.category}</p>
                    </div>
                  </div>

                  <p className={`text-sm ${transaction.type === "income" ? "text-emerald-300" : "text-rose-300"}`}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-5 bg-slate-900 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-semibold text-slate-100">Giao dịch gần đây</p>
            <Button variant="ghost" size="icon" onClick={() => navigate("/transactions")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {isLoading && <p className="text-sm text-slate-400">Đang tải giao dịch...</p>}

            {!isLoading && recentTransactions.length === 0 && (
              <p className="text-sm text-slate-400">Chưa có giao dịch nào</p>
            )}

            {!isLoading &&
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                        transaction.type === "income"
                          ? "bg-emerald-500/15 border-emerald-500/30"
                          : "bg-slate-800 border-slate-700"
                      }`}
                    >
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div>
                      <p className="text-sm text-slate-100">{transaction.description}</p>
                      <p className="text-xs text-slate-400">{transaction.category}</p>
                    </div>
                  </div>

                  <p className={`text-sm ${transaction.type === "income" ? "text-emerald-300" : "text-rose-300"}`}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}