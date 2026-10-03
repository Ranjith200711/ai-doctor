"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentList } from "@/components/content-list";
import { Send, ImageIcon, Plus, Menu, X, Sparkles, Check, Copy, MessageSquarePlus, RefreshCw } from "lucide-react";
import { ChatMessage } from "@/components/chat-message";
import { ConversationList } from "@/components/conversation-list";
import { ImageUpload } from "@/components/image-upload";
import { useChat } from "ai/react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { AiLoadingIndicator } from "@/components/ai-loading-indicator";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  id: string;
  role: "user" | "assistant" | "system" | "data" | string;
  content: string;
  createdAt?: Date;
};

export function ChatInterface() {
  const [activeConversation, setActiveConversation] = useState<string>("new");
  const [conversations, setConversations] = useState<
    { id: string; title: string; messages: Message[] }[]
  >([{ id: "new", title: "New Conversation", messages: [] }]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [prescriptionAnalysis, setPrescriptionAnalysis] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } =
    useChat({
      api: "/api/chat",
      initialMessages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hello! I'm your AI doctor assistant. How can I help you today? Feel free to describe your symptoms or upload a prescription for analysis.",
        },
      ],
    });

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    setConversations([
      ...conversations,
      { id: newId, title: "New Conversation", messages: [] },
    ]);
    setActiveConversation(newId);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content:
          "Hello! I'm your AI doctor assistant. How can I help you today?",
      },
    ]);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleImageAnalysis = async (imageData: string) => {
    try {
      const response = await fetch("/api/prescription-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze prescription image");
      }

      const resultText = data.analysis || data.result || "Prescription analysis completed.";
      setPrescriptionAnalysis(resultText);

      // Automatically append to messages so the user can continue the conversation in chat
      const analysisMessage = {
        id: `prescription-${Date.now()}`,
        role: "assistant" as const,
        content: `**📋 Prescription Analysis Report:**\n\n${resultText}`,
        createdAt: new Date(),
      };

      setMessages((prev: any) => [...prev, analysisMessage]);
    } catch (err: any) {
      console.error("Prescription analysis error:", err);
      throw err;
    }
  };

  const copyPrescriptionResult = () => {
    if (prescriptionAnalysis) {
      navigator.clipboard.writeText(prescriptionAnalysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex h-full">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-[4rem] left-[0.28rem] z-10"
            >
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 pt-10 w-80">
            <div className="p-4 h-full flex flex-col">
              <h2 className="text-xl font-bold mb-4">Conversations</h2>
              <Button
                variant="outline"
                className="w-full mb-4 flex items-center gap-2"
                onClick={handleNewConversation}
              >
                <Plus size={16} /> New Conversation
              </Button>
              <ConversationList
                conversations={conversations}
                activeConversation={activeConversation}
                setActiveConversation={(id) => {
                  setActiveConversation(id);
                  if (isMobile) setSidebarOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <div
          className={cn(
            "h-full bg-background transition-all duration-300",
            sidebarOpen ? "w-80" : "w-0 overflow-hidden"
          )}
        >
          <div className="border-r p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Conversations</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full mb-4 flex items-center gap-2"
              onClick={handleNewConversation}
            >
              <Plus size={16} /> New Conversation
            </Button>
            <ConversationList
              conversations={conversations}
              activeConversation={activeConversation}
              setActiveConversation={setActiveConversation}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {!isMobile && !sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-[4rem] left-[0.28rem] z-10"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </Button>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <div className="border-b px-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <TabsList
              className={`w-full max-w-md mx-auto ${
                isMobile || !sidebarOpen ? "ml-8" : ""
              }`}
            >
              <TabsTrigger value="chat" className="flex-1">
                Chat with AI Doctor
              </TabsTrigger>
              <TabsTrigger value="prescription" className="flex-1">
                Prescription Analysis
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="chat"
            className="flex-1 flex flex-col p-0 h-[calc(100vh-8.5rem)]"
          >
            <ContentList className="h-[calc(100vh-12.5rem)] flex-1 px-4 py-4" data={messages}>
              <div className="space-y-4 mb-4 max-w-3xl mx-auto">
                <AnimatePresence>
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                </AnimatePresence>
                {isLoading && <AiLoadingIndicator label="AI Doctor is preparing medical advice..." />}
              </div>
            </ContentList>

            <div className="border-t p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 max-w-3xl mx-auto"
              >
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Describe symptoms, ask medical questions..."
                  className="flex-1 rounded-xl py-6 shadow-inner text-base"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-12 w-12 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white shadow-md transition-all duration-200"
                  disabled={isLoading || !input.trim()}
                >
                  <Send size={20} />
                </Button>
              </form>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 max-w-3xl mx-auto font-medium"
                >
                  Error: {error.message || "Something went wrong. Please try again."}
                </motion.p>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="prescription"
            className="flex-1 p-4 h-[calc(100vh-8.5rem)] overflow-y-auto"
          >
            <div className="max-w-3xl mx-auto h-full flex flex-col">
              {prescriptionAnalysis ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card border border-teal-500/30 rounded-2xl p-6 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-tr from-teal-500 to-blue-600 p-2.5 rounded-xl text-white shadow-md">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Prescription Analysis Result</h3>
                        <p className="text-xs text-muted-foreground">Generated by AI Doctor Vision Model</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyPrescriptionResult}
                        className="flex items-center gap-1.5 rounded-lg"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setActiveTab("chat")}
                        className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg"
                      >
                        <MessageSquarePlus className="h-4 w-4" />
                        View in Chat
                      </Button>
                    </div>
                  </div>

                  <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed p-4 rounded-xl bg-muted/40 border">
                    <Markdown remarkPlugins={[remarkGfm]}>{prescriptionAnalysis}</Markdown>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setPrescriptionAnalysis(null);
                        setShowImageUpload(true);
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Analyze Another Prescription
                    </Button>
                  </div>
                </motion.div>
              ) : showImageUpload ? (
                <ImageUpload onImageAnalysis={handleImageAnalysis} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full my-auto text-center"
                >
                  <div className="bg-gradient-to-tr from-teal-500/20 via-blue-500/20 to-primary/20 p-8 rounded-full mb-6 border border-teal-500/30 shadow-lg shadow-teal-500/10">
                    <ImageIcon size={64} className="text-teal-500" />
                  </div>
                  <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                    AI Prescription Analysis
                  </h3>
                  <p className="text-center text-muted-foreground mb-8 max-w-md leading-relaxed">
                    Upload an image of your prescription or doctor note. Our vision AI will scan the text, extract medication names, dosages, and usage instructions.
                  </p>
                  <Button
                    onClick={() => setShowImageUpload(true)}
                    size="lg"
                    className="px-8 py-6 text-base font-bold shadow-lg bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white rounded-xl"
                  >
                    Upload Prescription Image
                  </Button>
                </motion.div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
