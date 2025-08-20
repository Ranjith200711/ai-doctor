"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentList } from "@/components/content-list";
import { Loader2, Send, ImageIcon, Plus, Menu, X } from "lucide-react";
import { ChatMessage } from "@/components/chat-message";
import { ConversationList } from "@/components/conversation-list";
import { ImageUpload } from "@/components/image-upload";
import { useChat } from "ai/react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: Date;
};

export function ChatInterface() {
  const [activeConversation, setActiveConversation] = useState<string>("new");
  const [conversations, setConversations] = useState<
    { id: string; title: string; messages: Message[] }[]
  >([{ id: "new", title: "New Conversation", messages: [] }]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // In a real app, you would use the actual API key from environment variables
  // This is just for demonstration purposes
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/chat",
      initialMessages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hello! I'm your AI doctor assistant. How can I help you today?",
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
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleImageAnalysis = (imageData: string) => {
    // In a real app, you would send the image to the API for analysis
    // This is just for demonstration purposes
    const analysisResult =
      "Based on the prescription image, I can see:\n\n- Amoxicillin 500mg: Take 1 capsule three times daily\n- Ibuprofen 400mg: Take 1 tablet every 6 hours as needed for pain\n\nPlease confirm if this matches your prescription.";

    // Add the analysis result as a message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: analysisResult,
      createdAt: new Date(),
    };

    // Update the current conversation with the new message
    setShowImageUpload(false);
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
      <div className="flex-1 flex flex-col h-full">
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

        <Tabs defaultValue="chat" className="flex flex-col h-full">
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
            <ContentList className=" h-[calc(100vh-12.5rem)] flex-1 px-4 py-4" data={messages}>
              <div className="space-y-4 mb-4 max-w-3xl mx-auto">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex justify-center my-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
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
                  placeholder="Type your medical question here..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                >
                  <Send size={18} />
                </Button>
              </form>

              {error && (
                <p className="text-red-500 text-sm mt-2 max-w-3xl mx-auto">
                  Error:{" "}
                  {error.message || "Something went wrong. Please try again."}
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="prescription"
            className="flex-1 p-4 h-[calc(100vh-8.5rem)]"
          >
            <div className="max-w-3xl mx-auto h-full">
              {showImageUpload ? (
                <ImageUpload onImageAnalysis={handleImageAnalysis} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="bg-primary/10 p-8 rounded-full mb-6">
                    <ImageIcon size={64} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-medium mb-2">
                    Upload Prescription
                  </h3>
                  <p className="text-center text-muted-foreground mb-6 max-w-md">
                    Upload an image of your prescription for AI analysis. Our
                    system will extract medication details and provide
                    information.
                  </p>
                  <Button
                    onClick={() => setShowImageUpload(true)}
                    size="lg"
                    className="px-8"
                  >
                    Upload Image
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
