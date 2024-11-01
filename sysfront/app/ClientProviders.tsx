"use client";

import { I18nProvider } from '@/lib/i18n/I18nContext';
import { Providers } from './providers';
import { WalletProvider } from '@/lib/WalletContext';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <WalletProvider>
        <Providers>{children}</Providers>
      </WalletProvider>
    </I18nProvider>
  );
} 