"use client";

import { Card } from "@/components/ui/card";
import { Shield, TrendingUp, Binary, Sparkles, Loader2 } from "lucide-react";
import { useEthersContract } from "@/hooks/useEthersContract";
import { Button } from "@/components/ui/button";
import { AdvisorType } from "@/types/advisor";

const advisors = [
  {
    name: "稳健理财顾问" as AdvisorType,
    description: "专注于低风险、稳定收益的投资策略，适合保守型投资者",
    cost: "10 ADV",
    icon: Shield,
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
  },
  {
    name: "增长型顾问",
    description: "平衡风险与收益，追求中长期稳定增长",
    cost: "200 AIA",
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    name: "量化交易顾问",
    description: "使用高频交易策略，适合追求高收益的投资者",
    cost: "500 AIA",
    icon: Binary,
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
  },
  {
    name: "MEME顾问",
    description: "基于ChainLink价格预言机和AI分析的MEME币投资建议",
    cost: "300 AIA",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
  },
];

interface AdvisorSelectionProps {
  onAdvisorSelect: (advisorType: AdvisorType) => void;
}

export function AdvisorSelection({ onAdvisorSelect }: AdvisorSelectionProps) {
  const { address, unlockAdvisor, unlockingAdvisor, checkAccess, unlockedAdvisors } = useEthersContract();

  const handleAdvisorClick = async (advisorType: AdvisorType) => {
    console.log('Clicking advisor:', advisorType);
    try {
      if (!address) {
        console.log('No wallet connected');
        alert("请先连接钱包");
        return;
      }

      console.log('Checking access for:', advisorType);
      const hasAccess = await checkAccess(advisorType);
      console.log('Has access:', hasAccess);
      
      if (!hasAccess) {
        console.log('Unlocking advisor:', advisorType);
        await unlockAdvisor(advisorType);
        console.log('Checking access again for:', advisorType);
        const accessGranted = await checkAccess(advisorType);
        console.log('Access granted:', accessGranted);
        if (!accessGranted) {
          return;
        }
      }
      onAdvisorSelect(advisorType);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 max-w-2xl mx-auto">
      {advisors.map((advisor) => {
        const isUnlocked = unlockedAdvisors.includes(advisor.name);
        const isCurrentlyUnlocking = unlockingAdvisor === advisor.name;
        
        return (
          <Card
            key={advisor.name}
            className="p-6 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={advisor.image}
                  alt={advisor.name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <advisor.icon className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">{advisor.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {advisor.description}
                  </p>
                  {!isUnlocked && (
                    <span className="text-sm text-muted-foreground block mt-1">
                      解锁费用: 10 ADV
                    </span>
                  )}
                </div>
              </div>
              <Button
                className="ml-4"
                onClick={() => handleAdvisorClick(advisor.name)}
                disabled={isCurrentlyUnlocking}
              >
                {isCurrentlyUnlocking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    解锁中...
                  </>
                ) : (
                  isUnlocked ? "开始咨询" : "解锁顾问"
                )}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}