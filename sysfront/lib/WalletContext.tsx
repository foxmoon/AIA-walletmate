"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';

interface WalletContextType {
  address: string | null;
  balance: string | null;
  isConnecting: boolean;
  error: string | null;
  tokens: any[];
  connect: () => Promise<void>;
  disconnect: () => void;
  getMoralis: () => typeof Moralis;
}

const WalletContext = createContext<WalletContextType | null>(null);

interface CachedData {
  timestamp: number;
  data: any;
}

interface TokenCache {
  [address: string]: CachedData;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [isMoralisInitialized, setIsMoralisInitialized] = useState(false);
  const [tokenCache, setTokenCache] = useState<TokenCache>({});

  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

  const getCachedTokens = (address: string) => {
    const cached = tokenCache[address];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  };

  const setCachedTokens = (address: string, data: any) => {
    setTokenCache(prev => ({
      ...prev,
      [address]: {
        timestamp: Date.now(),
        data
      }
    }));
  };

  const initializeMoralis = async () => {
    if (!Moralis.Core.isStarted) {
      const apiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
      if (!apiKey) {
        throw new Error('Moralis API key not found');
      }
      await Moralis.start({
        apiKey,
      });
      setIsMoralisInitialized(true);
    }
  };

  const getMoralis = () => {
    if (!isMoralisInitialized) {
      throw new Error('Moralis not initialized');
    }
    return Moralis;
  };

  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
      connect();
    }
  }, []);

  const connect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('请安装 MetaMask');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      const balance = await provider.getBalance(address);
      
      setAddress(address);
      setBalance(ethers.formatEther(balance));
      
      localStorage.setItem('walletAddress', address);

      await fetchTokens(address);

      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAddress(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : '连接钱包失败');
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchTokens = async (walletAddress: string) => {
    try {
      const cached = getCachedTokens(walletAddress);
      if (cached) {
        setTokens(cached);
        return;
      }

      await initializeMoralis();
      const Moralis = getMoralis();
      const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
        chain: "0x1",
        address: walletAddress,
      });
      
      const tokenData = response.json.result;
      console.log('Fetched token data:', tokenData);
      setTokens(tokenData);
      setCachedTokens(walletAddress, tokenData);
    } catch (error) {
      console.error("Error fetching token balances:", error);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setBalance(null);
    setTokens([]);
    localStorage.removeItem('walletAddress');
    
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
  };

  return (
    <WalletContext.Provider 
      value={{ 
        address, 
        balance, 
        isConnecting, 
        error,
        tokens,
        connect,
        disconnect,
        getMoralis 
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}; 