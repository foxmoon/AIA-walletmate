"use client";

import { WalletOverview } from '@/components/WalletOverview';
import { PortfolioChart } from '@/components/PortfolioChart';
import { AssetAllocation } from '@/components/AssetAllocation';
import { AdvisorSelection } from '@/components/AdvisorSelection';
import { ConnectWallet } from '@/components/ConnectWallet';
import { FloatingAdvisorChat } from '@/components/FloatingAdvisorChat';
import { MemeMarquee } from '@/components/MemeMarquee';
import { useState } from 'react';

const AVAILABLE_ADVISORS = [
  "conservative",
  "growth",
  "quantitative",
  "meme"
] as const;

type AdvisorType = typeof AVAILABLE_ADVISORS[number];

interface ChatWindow {
  advisorType: AdvisorType;
  isVisible: boolean;
  messages: Message[];
}

export default function Home() {
  const [chatWindows, setChatWindows] = useState<Record<string, ChatWindow>>({});
  const [currentAssets, setCurrentAssets] = useState<TokenBalance[]>([]);

  const handleAdvisorSelect = (advisorType: AdvisorType) => {
    console.log('Home: handleAdvisorSelect called with:', advisorType);
    console.log('Current chatWindows:', chatWindows);
    
    setChatWindows(prev => {
      const newWindows = { ...prev };
      console.log('Processing windows:', newWindows);
      
      // 隐藏其他顾问的窗口
      Object.keys(newWindows).forEach(key => {
        newWindows[key].isVisible = key === advisorType;
      });
      
      // 如果该顾问窗口不存在，创建新窗口
      if (!newWindows[advisorType]) {
        console.log('Creating new window for:', advisorType);
        newWindows[advisorType] = {
          advisorType,
          isVisible: true,
          messages: []
        };
      } else {
        console.log('Showing existing window for:', advisorType);
        newWindows[advisorType].isVisible = true;
      }
      
      console.log('Final windows state:', newWindows);
      return newWindows;
    });
  };

  const handleCloseChat = (advisorType: AdvisorType) => {
    setChatWindows(prev => ({
      ...prev,
      [advisorType]: {
        ...prev[advisorType],
        isVisible: false
      }
    }));
  };

  const handleUpdateMessages = (advisorType: AdvisorType, messages: Message[]) => {
    setChatWindows(prev => ({
      ...prev,
      [advisorType]: {
        ...prev[advisorType],
        messages
      }
    }));
  };

  console.log('Home: Rendering with chatWindows:', chatWindows);

  return (
    <main className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Wallet Advisor</h1>
            <p className="text-muted-foreground">Your intelligent crypto portfolio manager</p>
          </div>
          <ConnectWallet />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <WalletOverview />
          <PortfolioChart />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AssetAllocation onAssetsUpdate={setCurrentAssets} />
          <div className="space-y-6">
            <MemeMarquee />
            <AdvisorSelection onAdvisorSelect={handleAdvisorSelect} />
          </div>
        </div>

        {Object.entries(chatWindows).map(([type, window]) => (
          window.isVisible && (
            <FloatingAdvisorChat
              key={type}
              advisorType={type}
              assets={currentAssets}
              messages={window.messages}
              onMessagesUpdate={(messages) => handleUpdateMessages(type, messages)}
              onClose={() => handleCloseChat(type)}
            />
          )
        ))}
      </div>
    </main>
  );
}