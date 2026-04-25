import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Leaf,
  Globe,
  Lightbulb,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Paperclip,
} from "lucide-react";
import { generateGeminiResponse, GEMINI_API_KEY } from "@/lib/gemini";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const EcoBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! I'm EcoBot, your AI-powered environmental learning assistant. I can help you with any questions about the environment, sustainability, climate change, or general topics. How may I help you today? 🌱",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Debug logging - only run once on mount
  useEffect(() => {
    console.log("EcoBot Component Mounted");
    console.log("GEMINI_API_KEY:", GEMINI_API_KEY);
    console.log("GEMINI_API_KEY length:", GEMINI_API_KEY?.length);
    console.log("API Key available:", !!GEMINI_API_KEY);
  }, []); // Empty dependency array means this runs only once

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Store the input value before clearing it
    const messageToSend = inputValue.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setIsLoading(true);

    try {
      const botResponse = await generateGeminiResponse(messageToSend);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error while processing your request. Please try again. 🚫",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Debounced input change handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new timeout for debouncing
      debounceTimeoutRef.current = setTimeout(() => {
        // This will only run after user stops typing for 300ms
        // You can add any debounced logic here if needed
      }, 300);
    },
    []
  );

  const toggleChat = () => {
    if (isOpen) {
      setIsMinimized(!isMinimized);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) {
    return (
      <div className="fixed bottom-9 right-6 z-900">
        <Button
          onClick={toggleChat}
          className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 shadow-eco hover:shadow-glow transition-all duration-300 group"
          size="lg"
        >
          <MessageCircle className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
        </Button>
        <div className="absolute -top-6 -right-1">
          <Badge className="bg-cyan-500 text-white text-xs px-4 py-1 rounded-full animate-bounce">
            EcoBot
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card
        className={`w-80 bg-white border-2 border-cyan-200 shadow-eco transition-all duration-300 ${
          isMinimized ? "h-16" : "h-96"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white p-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <span className="font-semibold text-sm">EcoBot AI Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0 text-white hover:bg-cyan-600"
            >
              {isMinimized ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 text-white hover:bg-cyan-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* API Key Warning */}
            {!GEMINI_API_KEY && (
              <div className="p-3 bg-yellow-50 border-b border-yellow-200">
                <div className="flex items-center gap-2 text-yellow-800 text-xs">
                  <AlertCircle className="h-4 w-4" />
                  <span>Please configure the Gemini API key in gemini.ts</span>
                </div>
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-3 h-64">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-cyan-500 text-white"
                          : "bg-cyan-50 text-cyan-800 border border-cyan-200"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">
                        {message.text}
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-lg p-3">
                      <div className="flex items-center gap-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-xs ml-2">
                          EcoBot is thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Field - Fixed for better user interaction */}
            <div className="p-3 border-t border-cyan-200">
              <div className="flex gap-2 items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-cyan-600 hover:bg-cyan-50"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about the environment or any topic..."
                  className="flex-1 text-sm border-cyan-300 focus:border-cyan-500 focus:ring-cyan-500"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="sm"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default EcoBot;
