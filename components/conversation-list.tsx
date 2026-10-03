"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "assistant" | "system" | "data" | string
  content: string
  createdAt?: Date
}

type Conversation = {
  id: string
  title: string
  messages: Message[]
}

interface ConversationListProps {
  conversations: Conversation[]
  activeConversation: string
  setActiveConversation: (id: string) => void
}

export function ConversationList({ conversations, activeConversation, setActiveConversation }: ConversationListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-12.6rem)]">
      <div className="space-y-2">
        {conversations.map((conversation) => (
          <Button
            key={conversation.id}
            variant="ghost"
            className={cn(
              "w-full justify-start text-left font-normal",
              activeConversation === conversation.id && "bg-muted",
            )}
            onClick={() => setActiveConversation(conversation.id)}
          >
            <MessageSquare size={16} className="mr-2 flex-shrink-0" />
            <span className="truncate">{conversation.title}</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}

