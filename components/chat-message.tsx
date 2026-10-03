"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User, Sparkles } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant" | "system" | "data" | string;
  content: string;
};

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl transition-all duration-200 border shadow-sm backdrop-blur-sm",
        isUser
          ? "bg-primary/5 border-primary/20 text-foreground ml-6 md:ml-12"
          : "bg-gradient-to-br from-card to-muted/40 border-blue-500/20 text-foreground mr-4 md:mr-8 shadow-blue-500/5"
      )}
    >
      <div className="relative">
        <Avatar
          className={cn(
            "h-10 w-10 border-2 transition-transform duration-200 hover:scale-105",
            isUser
              ? "border-primary/50 shadow-sm"
              : "border-teal-500/60 shadow-md shadow-teal-500/20 ring-2 ring-teal-500/10"
          )}
        >
          {isUser ? (
            <AvatarFallback className="bg-primary/20 text-primary font-bold flex items-center justify-center">
              <User className="h-5 w-5" />
            </AvatarFallback>
          ) : (
            <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-teal-500 text-white font-bold flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          )}
        </Avatar>
        {!isUser && (
          <motion.div
            className="absolute -top-1 -right-1 text-teal-400"
            animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles className="h-3.5 w-3.5 fill-teal-400" />
          </motion.div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <span className={cn("font-bold text-sm", isUser ? "text-primary" : "text-teal-600 dark:text-teal-400")}>
            {isUser ? "You" : "AI Doctor"}
          </span>
          {!isUser && (
            <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Verified Medical AI
            </span>
          )}
        </div>

        <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
          <Markdown
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    PreTag="div"
                    language={match[1]}
                    style={atomDark}
                    className="rounded-lg shadow-inner my-2"
                  >
                    {String(children).trim()}
                  </SyntaxHighlighter>
                ) : (
                  <code {...props} className={cn("bg-muted px-1.5 py-0.5 rounded text-xs font-mono", className)}>
                    {children}
                  </code>
                );
              },
              p({ children }) {
                return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
              },
              ul({ children }) {
                return <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>;
              },
              ol({ children }) {
                return <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>;
              },
              strong({ children }) {
                return <strong className="font-semibold text-foreground">{children}</strong>;
              }
            }}
            remarkPlugins={[remarkGfm]}
          >
            {message.content}
          </Markdown>
        </div>
      </div>
    </motion.div>
  );
}
