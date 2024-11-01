"use client";

import { useMemeMarket } from '@/hooks/useMemeMarket';
import { useI18n } from '@/lib/i18n/I18nContext';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MemeMarquee() {
  const { memeTokens, isLoading, error } = useMemeMarket();
  const { t } = useI18n();
  
  if (error) {
    return (
      <div className="p-2 text-sm text-destructive bg-destructive/10 rounded">
        {error}
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative h-[120px] overflow-hidden bg-muted/30 rounded-lg">
      <div className="animate-scroll-up">
        {[...memeTokens, ...memeTokens].map((token, index) => (
          <div
            key={`${token.symbol}-${index}`}
            className="py-2 px-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-primary">
                {token.name} ({token.symbol})
              </span>
              <span className="font-mono text-muted-foreground">
                ${token.price.toFixed(4)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1 text-sm">
              <span className={cn(
                "font-medium",
                token.change24h > 0 ? "text-green-500" : "text-red-500"
              )}>
                {token.change24h > 0 ? "↑" : "↓"}
                {Math.abs(token.change24h).toFixed(2)}%
              </span>
              <span className="text-muted-foreground">
                {t('memeMarket.aiSentiment')}: {token.aiSentiment}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 