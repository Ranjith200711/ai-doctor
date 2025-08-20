import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg",
        message.role === "user" ? "bg-muted/80" : "bg-muted/50"
      )}
    >
      <Avatar
        className={cn(
          "h-10 w-10 border-2",
          message.role === "user" ? "border-primary/50" : "border-blue-500/50"
        )}
      >
        {message.role === "user" ? (
          <AvatarFallback className="bg-primary/20 text-primary-foreground">
            U
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-blue-500/20 text-blue-700 dark:text-blue-300">
            AI
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="font-semibold mb-1">
          {message.role === "user" ? "You" : "AI Doctor"}
        </div>
        <div className="whitespace-pre-wrap">
          <Markdown
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    PreTag="div"
                    language={match[1]}
                    style={atomDark}
                  >
                    {String(children).trim()}
                  </SyntaxHighlighter>
                ) : (
                  <code {...props} className={className}>
                    {children}
                  </code>
                );
              },
            }}
            remarkPlugins={[remarkGfm]}
          >
            {message.content}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
