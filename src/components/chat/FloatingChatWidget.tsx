"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  sources?: string[];
}

export const FloatingChatWidget: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "bot",
      text:
        language === "bn"
          ? "আসসালামু আলাইকুম! ক্যাম্পাস বিষয়ে আপনার কোনো প্রশ্ন আছে?"
          : "Hello! Have a question about City University? Ask me here.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      let idToken: string | undefined;
      if (user) {
        try {
          idToken = await user.getIdToken();
        } catch {
          // ignore
        }
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, token: idToken }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: data.reply || "No response received.",
          sources: data.sources,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: "Campus Assistant unavailable. Call central desk: 09643-234234.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-campus-navy-950 text-white hover:bg-campus-navy-900 border border-campus-gold-400/40 p-3.5 rounded-full shadow-2xl transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-campus-gold-400"
          aria-label="Open Campus AI Assistant"
        >
          <Sparkles className="w-5 h-5 text-campus-gold-400 animate-pulse" />
          <span className="text-xs font-bold pr-1 hidden sm:inline">Ask Campus AI</span>
        </button>
      )}

      {/* Floating Dialog */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[480px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-campus-navy-950 text-white p-3.5 flex items-center justify-between border-b border-campus-navy-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-campus-gold-500 text-campus-navy-950 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold">Campus AI Assistant</h4>
                <span className="text-[10px] text-campus-gold-400 block leading-tight">
                  Grounded on CU Official Registry
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md"
              aria-label="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                      isUser
                        ? "bg-campus-navy-800 text-white"
                        : "bg-campus-gold-500 text-campus-navy-950"
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
                    <div
                      className={`p-2.5 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? "bg-campus-navy-900 text-white rounded-tr-none"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/40 dark:border-slate-700/40"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <RefreshCw className="w-3 h-3 animate-spin text-campus-gold-500" />
                <span>Assistant is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <Input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="text-xs py-1.5 h-8"
              disabled={loading}
              maxLength={500}
            />
            <Button
              type="submit"
              variant="gold"
              size="sm"
              disabled={loading || !input.trim()}
              className="h-8 px-2.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
