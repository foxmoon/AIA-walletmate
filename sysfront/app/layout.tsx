import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClientProviders } from './ClientProviders';
import { I18nProvider } from '@/lib/i18n/I18nContext';
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Wallet Advisor',
  description: 'Your intelligent crypto portfolio manager',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <ClientProviders>{children}</ClientProviders>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
