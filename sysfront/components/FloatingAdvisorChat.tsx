import { Card } from "@/components/ui/card";
import { useState, useRef } from "react";
import { Send, Shield, TrendingUp, Binary, Sparkles, Loader2, X, Minus } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import Draggable from 'react-draggable';
import MemeAdvisor from './MemeAdvisor';
import { useMemeMarket } from '@/hooks/useMemeMarket';

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface FloatingAdvisorChatProps {
  advisorType: string;
  assets?: TokenBalance[];
  messages: Message[];
  onMessagesUpdate: (messages: Message[]) => void;
  onClose: () => void;
}

const advisorConfig = {
  "conservative": {
    icon: Shield,
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
  },
  "growth": {
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  "quantitative": {
    icon: Binary,
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
  },
  "meme": {
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
  }
};

export function FloatingAdvisorChat({
  advisorType,
  assets,
  messages,
  onMessagesUpdate,
  onClose
}: FloatingAdvisorChatProps) {
  console.log('FloatingAdvisorChat: Rendering with props:', {
    advisorType,
    hasAssets: !!assets,
    messageCount: messages.length
  });
  
  const nodeRef = useRef(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const Icon = advisorConfig[advisorType as keyof typeof advisorConfig];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const userMessage = { role: "user", content: input };
      const newMessages = [...messages, userMessage];
      onMessagesUpdate(newMessages);
      setInput("");

      let memeContext = '';
      if (advisorType === "meme") {
        const { getMemeMarketContext } = useMemeMarket();
        memeContext = getMemeMarketContext();
      }

      const payload = {
        messages: newMessages,
        advisorType,
        ...(assets && assets.length > 0 ? { assets } : {}),
        ...(memeContext ? { memeContext } : {})
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      onMessagesUpdate([...newMessages, { role: "assistant", content: data.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".handle">
      <Card ref={nodeRef} className="fixed bottom-4 right-4 w-[400px] shadow-lg">
        <div className="handle cursor-move p-4 flex items-center justify-between bg-primary text-primary-foreground">
          <div className="flex items-center space-x-3">
            <img
              src={advisorConfig[advisorType]?.image}
              alt={advisorType}
              className="h-8 w-8 rounded-full object-cover border-2 border-primary-foreground"
            />
            <div className="flex items-center space-x-2">
              {Icon && <Icon className="h-5 w-5" />}
              <h3 className="font-medium">{advisorType}</h3>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setIsMinimized(!isMinimized)} className="p-1">
              <Minus className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="p-1">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="p-4">
            <div className="h-[300px] overflow-y-auto mb-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.role === "user" ? (
                      msg.content
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 rounded-md border p-2"
                placeholder="输入您的问题..."
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                className={`p-2 rounded-md bg-primary text-primary-foreground ${
                  isLoading ? "opacity-50" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        )}
      </Card>
    </Draggable>
  );
} 