"use client";

import { useMemeMarket } from '@/hooks/useMemeMarket';
import { useI18n } from '@/lib/i18n/I18nContext';
import { Loader2 } from 'lucide-react';

export function MemeAdvisor() {
  const { memeTokens, isLoading, error } = useMemeMarket();
  const { t } = useI18n();
  
  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-destructive/10 text-destructive">
        {error}
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {memeTokens.map(token => (
        <div key={token.symbol} className="p-4 border rounded-lg">
          <h3>{token.name} ({token.symbol})</h3>
          <p>{t('memeMarket.price')}: ${token.price.toFixed(4)}</p>
          <p>{t('memeMarket.change24h')}: {token.change24h.toFixed(2)}%</p>
          <p>{t('memeMarket.aiSentiment')}: {token.aiSentiment}</p>
        </div>
      ))}
    </div>
  );
}