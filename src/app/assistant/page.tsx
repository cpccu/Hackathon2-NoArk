"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Sparkles,
  Send,
  Bot,
  User,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  RefreshCw,
  Phone,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  sources?: string[];
  timestamp: string;
  fallback?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "What is the undergraduate waiver policy for Golden GPA 5.0?",
  "What are the scheduled shuttle times for Gabtoli route (R1)?",
  "ভর্তি হওয়ার জন্য এসএসসি ও এইচএসসিতে নূন্যতম কত জিপিএ প্রয়োজন?",
  "পরীক্ষায় অংশ নিতে কত শতাংশ উপস্থিতি বাধ্যতামূলক?",
];

export default function AssistantPage() {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text:
        language === "bn"
          ? "আসসালামু আলাইকুম! আমি সিটি ইউনিভার্সিটি ক্যাম্পাস সহকারী (CampusOS AI)। ভর্তি, ওয়েভার, ক্লাসের নিয়মকানুন বা বাসের শিডিউল সম্পর্কে আমাকে জিজ্ঞাসা করতে পারেন।"
          : "Hello! I am the CampusOS AI Assistant for City University. Ask me about admission eligibility, fee waivers, campus shuttle routes, or examination rules.",
      sources: ["Official Campus Registry"],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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

      if (res.status === 429) {
        setMessages((prev) => [
          ...prev,
          {
            id: "bot-" + Date.now(),
            sender: "bot",
            text: "Quota protection: rate limit reached. Please wait a minute or consult the helpline at 09643-234234.",
            sources: ["Rate Limit Defense"],
            fallback: true,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Server responded with an error");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: data.reply,
          sources: data.sources,
          fallback: data.fallback,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          sender: "bot",
          text:
            "I could not connect to the campus AI server right now. For urgent help, contact the University Central Desk at 09643-234234.",
          sources: ["Central Hotline"],
          fallback: true,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-4 pb-16">
        <PageHeader
          title={language === "bn" ? "ক্যাম্পাস এআই সহকারী" : "Campus AI Assistant"}
          subtitle={
            language === "bn"
              ? "জেরক্স ও অফিশিয়াল নীতিমালার ভিত্তিতে যাচাইকৃত তথ্যের উত্তর পান (বাংলা ও ইংরেজিতে)।"
              : "Grounded campus intelligence answering queries on admission, waivers, exams, and shuttles."
          }
        />

        {/* AI Disclaimer Guard */}
        <div className="p-3 rounded-lg bg-campus-navy-50/70 dark:bg-campus-navy-950/40 border border-campus-navy-200 dark:border-campus-navy-800 text-xs text-campus-navy-900 dark:text-campus-navy-200 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-campus-gold-600 dark:text-campus-gold-400 shrink-0" />
            <span>
              Powered by Google Gemini 1.5 Flash. Grounded strictly on official City University facts.
              Shuttle & fee amounts include sample hackathon data where indicated.
            </span>
          </div>
          <Badge variant="official" className="shrink-0 hidden sm:inline-flex">
            Zero-Hallucination Policy
          </Badge>
        </div>

        {/* Chat Conversation Box */}
        <Card className="h-[520px] flex flex-col p-0 overflow-hidden border-2 border-slate-200 dark:border-slate-800">
          {/* Scrollable messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isUser
                        ? "bg-campus-navy-800 text-white"
                        : "bg-campus-gold-500 text-campus-navy-950 font-bold"
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[80%] space-y-1.5 ${isUser ? "items-end" : "items-start"}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                        isUser
                          ? "bg-campus-navy-900 text-white rounded-tr-none"
                          : "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Sources citation list */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-slate-500 px-1">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">Sources:</span>
                        {msg.sources.map((src, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 block px-1">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-campus-gold-500 text-campus-navy-950 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-campus-gold-500" />
                  <span>Searching campus knowledge base...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Starter Chips */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Suggestions:
            </span>
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-campus-navy-400 dark:hover:border-campus-gold-400 px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-300 whitespace-nowrap transition shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <Input
              type="text"
              placeholder={
                language === "bn"
                  ? "ক্যাম্পাস সংক্রান্ত যেকোনো প্রশ্ন লিখুন..."
                  : "Ask a question in English or বাংলা..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="text-xs"
              maxLength={500}
            />
            <Button
              type="submit"
              variant="gold"
              disabled={loading || !input.trim()}
              className="shrink-0 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
