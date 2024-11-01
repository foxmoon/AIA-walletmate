'use client';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { http, createConfig, WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import { CONTRACTS } from '@/config/contracts';
import { WalletProvider } from '@/lib/WalletContext';

const aiadviserChain = {
  id: CONTRACTS.chainId,
  name: 'AIAdviser',
  network: 'aiadviser',
  nativeCurrency: {
    decimals: 18,
    name: 'AIA',
    symbol: 'AIA',
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.aiadviser.com'] },
  },
  blockExplorers: {
    default: { name: 'AIAdviserScan', url: 'https://scan.aiadviser.com' },
  },
  testnet: true,
};

const { wallets } = getDefaultWallets({
  appName: 'AI Advisor',
  projectId: 'YOUR_PROJECT_ID',
  chains: [aiadviserChain]
});

const config = createConfig({
  chains: [aiadviserChain],
  transports: {
    [aiadviserChain.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={[aiadviserChain]}>
          <WalletProvider>
            {children}
          </WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
} 