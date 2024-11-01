import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Send, Shield, TrendingUp, Binary, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useI18n } from '@/lib/i18n/I18nContext';

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AdvisorChatProps {
  advisorType: string;
  assets?: TokenBalance[];
}

const advisorIcons = {
  "conservative": Shield,
  "growth": TrendingUp,
  "quantitative": Binary,
  "meme": Sparkles
};

export function AdvisorChat({ advisorType, assets }: AdvisorChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const Icon = advisorIcons[advisorType as keyof typeof advisorIcons];
  const { t } = useI18n();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const userMessage = { role: "user", content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput("");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          advisorType,
          assets,
        }),
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 mt-4">
      <div className="flex items-center space-x-2 mb-4">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        <h3 className="font-medium">{advisorType}</h3>
      </div>
      
      <div className="h-[400px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted prose prose-sm dark:prose-invert"
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
            placeholder={t('advisor.chat.inputPlaceholder')}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className={`p-2 rounded-md bg-primary text-primary-foreground ${
              isLoading ? 'opacity-50' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </Card>
  );
}
