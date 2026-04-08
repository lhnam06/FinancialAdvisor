import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import {
  ChevronLeft,
  Ellipsis,
  MessageSquare,
  PanelLeft,
  Pencil,
  Send,
  Settings,
  Sparkles,
  TrendingUp,
  Lightbulb,
  DollarSign,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export function AIAdvisor() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Xin chào! Tôi là trợ lý tài chính AI của bạn. Tôi có thể giúp bạn:\n\n• Tư vấn chiến lược đầu tư\n• Đưa ra khuyến nghị tiết kiệm\n• Giải đáp kiến thức tài chính\n• Phân tích chi tiêu của bạn\n\nBạn cần tư vấn gì hôm nay?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const quickQuestions = [
    { icon: TrendingUp, text: "Nên đầu tư vào đâu?" },
    { icon: Lightbulb, text: "Mẹo tiết kiệm hiệu quả" },
    { icon: DollarSign, text: "Lãi suất ngân hàng nào cao?" },
  ];

  const todayChats = [
    "Lập kế hoạch tiết kiệm tháng 4",
    "Nên chia quỹ khẩn cấp thế nào?",
    "So sánh gửi tiết kiệm 6 và 12 tháng",
  ];

  const previousChats = [
    "Đầu tư chứng chỉ quỹ cho người mới",
    "Tối ưu chi tiêu ăn uống",
    "Các bước cân bằng ngân sách 50/30/20",
    "Theo dõi nợ thẻ tín dụng",
  ];

  const mockResponses: Record<string, string> = {
    "đầu tư": `Dựa trên dữ liệu thị trường mới nhất (24/03/2026), đây là một số kênh đầu tư bạn có thể cân nhắc:

**1. Tiết kiệm ngân hàng:**
• Vietcombank: 4.9%/năm (kỳ hạn 12 tháng)
• BIDV: 5.0%/năm (kỳ hạn 12 tháng)
• Agribank: 4.8%/năm (kỳ hạn 12 tháng)

**2. Vàng:**
• Giá vàng SJC hiện tại: 73.5 triệu VNĐ/lượng
• Xu hướng: Tăng nhẹ trong 3 tháng qua

**3. Chứng chỉ quỹ:**
• Phù hợp cho đầu tư dài hạn
• Lợi nhuận trung bình: 8-12%/năm
• Rủi ro: Trung bình

💡 Khuyến nghị: Với mục tiêu tiết kiệm an toàn, nên ưu tiên tiết kiệm ngân hàng. Với mục tiêu sinh lời cao hơn, có thể cân nhắc chứng chỉ quỹ.`,

    "tiết kiệm": `Dưới đây là những mẹo tiết kiệm hiệu quả:

**1. Quy tắc 50/30/20:**
• 50% thu nhập cho nhu cầu thiết yếu
• 30% cho mong muốn cá nhân
• 20% cho tiết kiệm và đầu tư

**2. Tự động hóa tiết kiệm:**
• Chuyển tiền vào tài khoản tiết kiệm ngay khi nhận lương
• Tránh cám dỗ chi tiêu

**3. Cắt giảm chi phí không cần thiết:**
• Hạn chế ăn uống ngoài
• Sử dụng phương tiện công cộng
• Tắt điện, nước khi không sử dụng

**4. Theo dõi chi tiêu:**
• Ghi chép mọi khoản chi tiêu
• Xem lại và điều chỉnh hàng tháng

💡 Bạn có thể tiết kiệm 15-20% thu nhập mỗi tháng nếu áp dụng đúng!`,

    "lãi suất": `**Lãi suất tiết kiệm ngân hàng cập nhật (24/03/2026):**

📈 **Cao nhất (kỳ hạn 12 tháng):**
1. BIDV: 5.0%/năm
2. Vietcombank: 4.9%/năm
3. VietinBank: 4.85%/năm
4. Agribank: 4.8%/năm
5. Techcombank: 4.7%/năm

💰 **Ví dụ tính lãi:**
Gửi 100 triệu VNĐ x 12 tháng tại BIDV (5%):
• Lãi nhận được: 5 triệu VNĐ

⚠️ **Lưu ý:**
• Lãi suất có thể thay đổi theo chính sách ngân hàng
• Rút tiền trước hạn sẽ bị phạt
• Nên so sánh nhiều ngân hàng trước khi gửi`,

    "chi tiêu": `Phân tích chi tiêu của bạn trong tháng này:

**Tổng quan:**
• Tổng chi tiêu: 3.515.000 VNĐ
• Danh mục chi nhiều nhất: Nhà cửa (2.500.000 VNĐ)

**Phân tích:**
✅ **Tốt:**
• Chi tiêu ăn uống kiểm soát tốt
• Không có chi tiêu lãng phí

⚠️ **Cần cải thiện:**
• Ngân sách ăn uống đã dùng 42%
• Có thể tiết kiệm thêm bằng cách nấu ăn tại nhà

💡 **Khuyến nghị:**
• Đặt giới hạn chi tiêu hàng tuần
• Chuẩn bị bữa ăn trước để tiết kiệm
• Theo dõi ngân sách thường xuyên hơn`,

    "default": `Tôi hiểu bạn đang quan tâm về vấn đề tài chính này. 

Bạn có thể hỏi tôi về:
• Chiến lược đầu tư (vàng, tiết kiệm, chứng chỉ quỹ...)
• Các mẹo và quy tắc tiết kiệm
• Lãi suất ngân hàng mới nhất
• Phân tích chi tiêu của bạn
• Các khái niệm tài chính cơ bản

Hãy đặt câu hỏi cụ thể hơn để tôi có thể tư vấn chính xác nhất!`,
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("đầu tư") || lowerMessage.includes("dau tu")) {
      return mockResponses["đầu tư"];
    } else if (lowerMessage.includes("tiết kiệm") || lowerMessage.includes("tiet kiem") || 
               lowerMessage.includes("mẹo") || lowerMessage.includes("meo")) {
      return mockResponses["tiết kiệm"];
    } else if (lowerMessage.includes("lãi suất") || lowerMessage.includes("lai suat") || 
               lowerMessage.includes("ngân hàng") || lowerMessage.includes("ngan hang")) {
      return mockResponses["lãi suất"];
    } else if (lowerMessage.includes("chi tiêu") || lowerMessage.includes("chi tieu") || 
               lowerMessage.includes("phân tích") || lowerMessage.includes("phan tich")) {
      return mockResponses["chi tiêu"];
    }
    
    return mockResponses["default"];
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: getAIResponse(inputMessage),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="max-w-md mx-auto h-[100dvh] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-slate-100 p-6 flex-shrink-0 border-b border-slate-800">
        <div className="flex items-center justify-between gap-3 mb-2">
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                aria-label="Mở menu hội thoại AI"
              >
                <PanelLeft className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[85%] max-w-[360px] bg-slate-950 text-slate-100 border-slate-800 p-0"
            >
              <SheetHeader className="border-b border-slate-800 p-4">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-slate-100">Lịch sử chat</SheetTitle>
                  <Button
                    size="sm"
                    className="h-8 px-3 bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1.5" />
                    Chat mới
                  </Button>
                </div>
                <SheetDescription className="text-slate-400">
                  Điều hướng hội thoại kiểu ChatGPT mobile.
                </SheetDescription>
              </SheetHeader>

              <div className="flex min-h-0 flex-1 flex-col">
                <ScrollArea className="flex-1 px-3 py-3">
                  <div className="space-y-5">
                    <div>
                      <p className="px-2 text-[11px] uppercase tracking-wide text-slate-500 mb-2">Hôm nay</p>
                      <div className="space-y-1">
                        {todayChats.map((chat) => (
                          <button
                            key={chat}
                            type="button"
                            className="w-full text-left rounded-lg px-2.5 py-2 hover:bg-slate-900 transition-colors"
                            onClick={() => setIsDrawerOpen(false)}
                          >
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
                              <span className="text-sm text-slate-200 truncate">{chat}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="px-2 text-[11px] uppercase tracking-wide text-slate-500 mb-2">7 ngày trước</p>
                      <div className="space-y-1">
                        {previousChats.map((chat) => (
                          <button
                            key={chat}
                            type="button"
                            className="w-full text-left rounded-lg px-2.5 py-2 hover:bg-slate-900 transition-colors"
                            onClick={() => setIsDrawerOpen(false)}
                          >
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
                              <span className="text-sm text-slate-300 truncate">{chat}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <div className="border-t border-slate-800 p-3 space-y-1.5">
                  <button
                    type="button"
                    className="w-full rounded-lg px-2.5 py-2 text-left hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-200">Tùy chỉnh AI</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-lg px-2.5 py-2 text-left hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Ellipsis className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-200">Xem thêm</span>
                    </div>
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 flex-1">
            <Sparkles className="w-6 h-6" />
            <h1 className="text-2xl">Cố vấn AI</h1>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>
        <p className="text-sm opacity-90 ml-12">
          Tư vấn tài chính thông minh với AI
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0 px-4 py-6">
        <div className="space-y-4 pb-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.type === "user"
                    ? "bg-cyan-600 text-slate-950 rounded-br-sm"
                    : "bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-sm"
                }`}
              >
                {message.type === "ai" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span className="text-xs text-cyan-300">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.type === "user" ? "text-cyan-100" : "text-slate-500"
                }`}>
                  {message.timestamp.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          <Card className="p-3 bg-slate-900 border-slate-800">
            <p className="text-xs text-slate-300">
              💡 <strong>Lưu ý:</strong> Thông tin được cung cấp chỉ mang tính chất tham khảo.
              Hãy tự nghiên cứu kỹ trước khi đưa ra quyết định tài chính.
            </p>
          </Card>
        </div>
      </ScrollArea>

      {/* Quick Questions */}
      <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/70 flex-shrink-0">
        <p className="text-xs text-slate-400 mb-2">Câu hỏi gợi ý:</p>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max gap-2 pr-4 pb-1">
            {quickQuestions.map((q, index) => {
              const Icon = q.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="shrink-0 whitespace-nowrap border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                  onClick={() => handleQuickQuestion(q.text)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {q.text}
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            placeholder="Đặt câu hỏi..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
