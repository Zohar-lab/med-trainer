import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Brain, RefreshCw, AlertCircle, HelpCircle } from "lucide-react";
import { sendChatMessage } from "../services/gemini";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "שלום! אני מדריך רפואת החירום הוירטואלי שלכם. 🩺\nאני כאן כדי לעזור לכם לשלוט בכל התרופות, המינונים ומנגנוני הפעולה של עגלת ההחייאה.\n\nשאלו אותי כל שאלה, או בקשו ממני לבחון אתכם בעל פה על חומר הלימוד!"
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setError(null);
    const updatedMessages = [...messages, { role: "user" as const, content: userMsg }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const reply = await sendChatMessage(updatedMessages);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      console.error(err);
      setError("שגיאה בחיבור לעוזר הלימוד. ודאו כי מפתח ה-API מוגדר כראוי או שהרשת זמינה.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "השיחה אותחלה מחדש. 🩺 במה נוכל להתמקד כעת?"
      }
    ]);
    setError(null);
  };

  const SUGGESTIONS = [
    "איך לזכור את ההבדל בין אדרנלין לאטרופין?",
    "בוחן אותי בעל פה על התרופות!",
    "מתי קלינית נשתמש במגנזיום ומתי בביקרבונט?",
    "הסבר לי איך שואבים נכון מפלקון?"
  ];

  return (
    <div className="max-w-4xl mx-auto px-4" id="ai-tutor">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-natural-dark-text flex items-center justify-center gap-2">
          <Brain className="text-natural-secondary animate-pulse" size={28} />
          <span>מדריך למידה אינטראקטיבי (AI Tutor)</span>
        </h2>
        <p className="text-natural-medium-text mt-1 text-sm md:text-base">
          שאלו את מורה ה-AI שאלות חופשיות בעברית על תרופות עגלת החייאה, בקשו עצות קליניות או שאלות בעל פה!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Chat window */}
        <div className="lg:col-span-8 bg-white border border-natural-border rounded-3xl shadow-md flex flex-col h-[520px] overflow-hidden">
          {/* Chat Header */}
          <div className="bg-natural-header text-white px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-natural-accent animate-pulse"></span>
              <span className="font-bold text-sm md:text-base">עוזר הוראה קליני (Gemini 3.5-Flash)</span>
            </div>
            <button
              onClick={clearChat}
              className="text-natural-cream/80 hover:text-white transition-all text-xs flex items-center gap-1"
              id="btn-tutor-clear"
            >
              <RefreshCw size={12} />
              <span>אתחל שיחה</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-natural-bg">
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={i}
                  className={`flex ${isUser ? "justify-start" : "justify-end"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-right whitespace-pre-line text-sm md:text-base leading-relaxed ${
                      isUser
                        ? "bg-natural-header text-white rounded-br-none"
                        : "bg-white border border-natural-border text-natural-dark-text rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-end animate-pulse">
                <div className="bg-white border border-natural-border text-natural-medium-text rounded-2xl rounded-bl-none p-4 max-w-xs text-right text-xs md:text-sm">
                  המורה חושב ומנסח תשובה רפואית...
                </div>
              </div>
            )}
            {error && (
              <div className="p-3 bg-rose-50 border border-natural-secondary text-natural-secondary rounded-xl flex items-center gap-2 text-xs md:text-sm">
                <AlertCircle size={16} className="text-natural-secondary flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="border-t border-natural-border p-4 bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="כתבו את השאלה שלכם בעברית כאן..."
              disabled={loading}
              className="flex-1 p-3 border-2 border-natural-border rounded-xl focus:border-natural-header focus:outline-none text-sm md:text-base bg-natural-bg text-natural-dark-text text-right"
              id="input-tutor-message"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-natural-header border border-natural-header text-white p-3 rounded-xl hover:opacity-95 transition-all disabled:opacity-50 flex items-center justify-center flex-shrink-0"
              id="btn-tutor-send"
            >
              <Send size={18} className="transform rotate-180" />
            </button>
          </form>
        </div>

        {/* Suggestions Column */}
        <div className="lg:col-span-4 bg-natural-cream border border-natural-border rounded-3xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-natural-dark-text text-sm flex items-center gap-1.5 border-b border-natural-border pb-2">
              <HelpCircle size={16} className="text-natural-medium-text" />
              <span>שאלות נפוצות והצעות למידה</span>
            </h3>
            <p className="text-xs text-natural-medium-text leading-relaxed">
              לחצו על אחת מההצעות כדי להעלות אותה לתיבת השיחה ולשאול את מורה ה-AI מיד:
            </p>

            <div className="space-y-2">
              {SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(sug)}
                  className="w-full text-right p-3 bg-white border border-natural-border rounded-xl text-xs md:text-sm font-semibold hover:border-natural-header hover:bg-natural-bg transition-all text-natural-dark-text block"
                  id={`btn-tutor-sug-${i}`}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-natural-bg border border-natural-border p-4 rounded-2xl text-natural-dark-text text-xs mt-6">
            <span className="font-bold text-natural-header block mb-1">💡 טיפ של מדריך:</span>
            שאלו את ה-AI: <strong className="font-bold">"בחן אותי בעל פה"</strong> כדי להתחיל סימולציית בחינה אוראלית מלאה, עם משוב ודירוג תשובות בזמן אמת!
          </div>
        </div>
      </div>
    </div>
  );
}
