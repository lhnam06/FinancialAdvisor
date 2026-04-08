import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { mockTransactions, categories } from "../lib/mockData";
import { ChevronLeft, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from "recharts";

export function Reports() {
  const navigate = useNavigate();
  const [transactions] = useState(mockTransactions);
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("month");

  const chartFontFamily =
    "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji";

  const axisTick = {
    fill: "#94a3b8", // slate-400
    fontSize: 12,
    fontFamily: chartFontFamily,
  } as const;

  const tooltipStyle = {
    backgroundColor: "#0b1220", // deep slate/blue
    border: "1px solid rgba(148, 163, 184, 0.25)",
    borderRadius: 10,
    fontFamily: chartFontFamily,
    fontSize: 12,
  } as const;

  const legendStyle = {
    color: "#cbd5e1", // slate-300
    fontFamily: chartFontFamily,
    fontSize: 12,
  } as const;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const shortFormatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}tr`;
    }
    return `${(amount / 1000).toFixed(0)}k`;
  };

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;

  // Expense by category
  const expenseByCategory = categories
    .filter(c => !["Tiền lương", "Đầu tư"].includes(c.name))
    .map(category => {
      const total = transactions
        .filter(t => t.type === "expense" && t.category === category.name)
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        name: category.name,
        value: total,
        color: category.color,
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  // Weekly trend data
  const weeklyData = [
    { week: "T2", income: 0, expense: 150000 },
    { week: "T3", income: 0, expense: 200000 },
    { week: "T4", income: 0, expense: 80000 },
    { week: "T5", income: 15000000, expense: 2500000 },
    { week: "T6", income: 0, expense: 50000 },
    { week: "T7", income: 0, expense: 0 },
    { week: "CN", income: 0, expense: 35000 },
  ];

  // Monthly comparison data
  const monthlyData = [
    { month: "T12", income: 15000000, expense: 8500000 },
    { month: "T1", income: 15000000, expense: 9200000 },
    { month: "T2", income: 15000000, expense: 8800000 },
    { month: "T3", income: 15000000, expense: 3515000 },
  ];

  // Cash flow trend
  const cashFlowData = [
    { date: "19/03", balance: 12000000 },
    { date: "20/03", balance: 24500000 },
    { date: "21/03", balance: 24300000 },
    { date: "22/03", balance: 24250000 },
    { date: "23/03", balance: 24100000 },
    { date: "24/03", balance: 24065000 },
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-slate-100 p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 text-white hover:bg-white/20"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl">Báo cáo & Thống kê</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-slate-900/70 backdrop-blur-sm border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" />
              <p className="text-xs opacity-90">Thu nhập</p>
            </div>
            <p className="text-lg">{shortFormatCurrency(totalIncome)}</p>
          </Card>
          <Card className="bg-slate-900/70 backdrop-blur-sm border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4" />
              <p className="text-xs opacity-90">Chi tiêu</p>
            </div>
            <p className="text-lg">{shortFormatCurrency(totalExpense)}</p>
          </Card>
          <Card className="bg-slate-900/70 backdrop-blur-sm border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4" />
              <p className="text-xs opacity-90">Còn lại</p>
            </div>
            <p className="text-lg">{shortFormatCurrency(balance)}</p>
          </Card>
        </div>
      </div>

      {/* Charts Tabs */}
      <div className="px-4 mt-6">
        <Tabs defaultValue="category">
          <div className="sticky top-0 z-20 -mx-4 px-4 py-3 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 space-y-3">
            <div className="flex gap-2">
              <Button
                variant={period === "week" ? "default" : "outline"}
                onClick={() => setPeriod("week")}
                className={period === "week" ? "h-11 min-w-20 text-sm" : "h-11 min-w-20 text-sm border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"}
              >
                Tuần
              </Button>
              <Button
                variant={period === "month" ? "default" : "outline"}
                onClick={() => setPeriod("month")}
                className={period === "month" ? "h-11 min-w-20 text-sm" : "h-11 min-w-20 text-sm border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"}
              >
                Tháng
              </Button>
              <Button
                variant={period === "quarter" ? "default" : "outline"}
                onClick={() => setPeriod("quarter")}
                className={period === "quarter" ? "h-11 min-w-20 text-sm" : "h-11 min-w-20 text-sm border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"}
              >
                Quý
              </Button>
            </div>

            <TabsList className="grid w-full h-12 grid-cols-3 bg-slate-900 border border-slate-800 p-1">
              <TabsTrigger className="h-10 text-sm" value="category">Chi tiêu</TabsTrigger>
              <TabsTrigger className="h-10 text-sm" value="trend">Xu hướng</TabsTrigger>
              <TabsTrigger className="h-10 text-sm" value="cashflow">Dòng tiền</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="category" className="space-y-4 mt-4">
            <Card className="p-4 bg-slate-900 border-slate-800">
              <h3 className="text-base mb-4 text-slate-100">Cơ cấu chi tiêu theo danh mục</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={expenseByCategory.slice(0, 6)}
                  layout="vertical"
                  margin={{ top: 8, right: 12, bottom: 8, left: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                  <XAxis
                    type="number"
                    tick={axisTick}
                    tickFormatter={(value) => shortFormatCurrency(Number(value))}
                    axisLine={{ stroke: "rgba(148, 163, 184, 0.25)" }}
                    tickLine={{ stroke: "rgba(148, 163, 184, 0.25)" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={90}
                    tick={axisTick}
                    axisLine={{ stroke: "rgba(148, 163, 184, 0.25)" }}
                    tickLine={{ stroke: "rgba(148, 163, 184, 0.25)" }}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    itemStyle={{ color: "#e2e8f0" }}
                    labelStyle={{ color: "#cbd5e1" }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar
                    dataKey="value"
                    name="Chi tiêu"
                    radius={[8, 8, 8, 8]}
                  >
                    {expenseByCategory.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-2 text-sm text-slate-400">
                Hiển thị {Math.min(expenseByCategory.length, 6)} danh mục chi tiêu cao nhất.
              </p>
            </Card>

            <Card className="p-4 bg-slate-900 border-slate-800">
              <h3 className="text-base mb-4 text-slate-100">Chi tiết danh mục</h3>
              <div className="space-y-3">
                {expenseByCategory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-slate-100">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-100">{formatCurrency(item.value)}</p>
                      <p className="text-sm text-slate-400">
                        {((item.value / totalExpense) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Income vs Expense Trend */}
          <TabsContent value="trend" className="space-y-4 mt-4">
            <Card className="p-4 bg-slate-900 border-slate-800">
              <h3 className="text-base mb-4 text-slate-100">Thu chi trong tuần</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                  <XAxis
                    dataKey="week"
                    tick={axisTick}
                    axisLine={{ stroke: "rgba(148, 163, 184, 0.25)" }}
                    tickLine={{ stroke: "rgba(148, 163, 184, 0.25)" }}
                  />
                  <YAxis
                    tick={axisTick}
                    tickFormatter={(value) => shortFormatCurrency(Number(value))}
                    axisLine={{ stroke: "rgba(148, 163, 184, 0.25)" }}
                    tickLine={{ stroke: "rgba(148, 163, 184, 0.25)" }}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    itemStyle={{ color: "#e2e8f0" }}
                    labelStyle={{ color: "#cbd5e1" }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend wrapperStyle={legendStyle} />
                  <Bar dataKey="income" fill="#52C41A" name="Thu nhập" />
                  <Bar dataKey="expense" fill="#FF4D4F" name="Chi tiêu" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4 bg-slate-900 border-slate-800">
              <h3 className="text-base mb-4 text-slate-100">So sánh theo tháng</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                  <XAxis
                    dataKey="month"
                    tick={axisTick}
                    axisLine={{ stroke: "rgba(148, 163, 184, 0.25)" }}
                    tickLine={{ stroke: "rgba(148, 163, 184, 0.25)" }}
                  />
                  <YAxis
                    tick={axisTick}
                    tickFormatter={(value) => shortFormatCurrency(Number(value))}
                    axisLine={{ stroke: "rgba(148, 163, 184, 0.25)" }}
                    tickLine={{ stroke: "rgba(148, 163, 184, 0.25)" }}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    itemStyle={{ color: "#e2e8f0" }}
                    labelStyle={{ color: "#cbd5e1" }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend wrapperStyle={legendStyle} />
                  <Bar dataKey="income" fill="#52C41A" name="Thu nhập" />
                  <Bar dataKey="expense" fill="#FF4D4F" name="Chi tiêu" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Cash Flow */}
          <TabsContent value="cashflow" className="space-y-4 mt-4">
            <Card className="p-4 bg-slate-900 border-slate-800">
              <h3 className="text-base mb-4 text-slate-100">Biến động số dư</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                  <XAxis
                    dataKey="date"
                    tick={axisTick}
                    axisLine={{ stroke: "rgba(148, 163, 184, 0.25)" }}
                    tickLine={{ stroke: "rgba(148, 163, 184, 0.25)" }}
                  />
                  <YAxis
                    tick={axisTick}
                    tickFormatter={(value) => shortFormatCurrency(Number(value))}
                    axisLine={{ stroke: "rgba(148, 163, 184, 0.25)" }}
                    tickLine={{ stroke: "rgba(148, 163, 184, 0.25)" }}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    itemStyle={{ color: "#e2e8f0" }}
                    labelStyle={{ color: "#cbd5e1" }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend wrapperStyle={legendStyle} />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#1890FF" 
                    strokeWidth={2}
                    name="Số dư"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4 bg-slate-900 border-slate-800">
              <h3 className="text-base mb-4 text-slate-100">Phân tích dòng tiền</h3>
              <div className="space-y-4">
                <div className="p-3 bg-emerald-900/20 border border-emerald-700/30 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Tốc độ tăng trưởng</p>
                  <p className="text-lg text-green-600">+100.5%</p>
                  <p className="text-sm text-slate-400 mt-1">So với tháng trước</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">Thu/ngày TB</p>
                    <p className="text-sm text-slate-100">{formatCurrency(totalIncome / 30)}</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">Chi/ngày TB</p>
                    <p className="text-sm text-slate-100">{formatCurrency(totalExpense / 30)}</p>
                  </div>
                </div>

                <div className="p-3 bg-cyan-900/20 border border-cyan-700/30 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Tỷ lệ tiết kiệm</p>
                  <p className="text-lg text-blue-600">
                    {((balance / totalIncome) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Bạn đã tiết kiệm được {formatCurrency(balance)} trong tháng này
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Insights */}
      <div className="px-4 mt-6">
        <h2 className="text-lg mb-3 text-slate-100">💡 Nhận xét</h2>
        <Card className="p-4 space-y-3 bg-slate-900 border-slate-800">
          <div className="p-3 bg-emerald-900/20 border border-emerald-700/30 rounded-lg">
            <p className="text-sm mb-1">✅ Điểm tốt</p>
            <p className="text-sm text-slate-300">
              Tỷ lệ tiết kiệm của bạn rất tốt ({((balance / totalIncome) * 100).toFixed(1)}%), 
              cao hơn mức khuyến nghị 20%
            </p>
          </div>
          
          <div className="p-3 bg-amber-900/20 border border-amber-700/30 rounded-lg">
            <p className="text-sm mb-1">⚠️ Cần lưu ý</p>
            <p className="text-sm text-slate-300">
              Chi phí nhà cửa chiếm {((2500000 / totalExpense) * 100).toFixed(0)}% tổng chi tiêu.
              Nên tìm cách tối ưu hóa chi phí sinh hoạt
            </p>
          </div>

          <div className="p-3 bg-cyan-900/20 border border-cyan-700/30 rounded-lg">
            <p className="text-sm mb-1">💡 Khuyến nghị</p>
            <p className="text-sm text-slate-300">
              Hãy tiếp tục duy trì thói quen tốt này! Bạn có thể cân nhắc đầu tư số tiền
              tiết kiệm vào các kênh sinh lời để tối ưu tài chính
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
