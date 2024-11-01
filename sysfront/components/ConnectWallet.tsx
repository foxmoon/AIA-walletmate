"use client";

import { Button } from "@/components/ui/button";
import { useWallet } from "@/lib/WalletContext";
import { Loader2, Wallet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AIA_NETWORK } from '@/lib/constants';
import { useI18n } from '@/lib/i18n/I18nContext';
import { ThemeToggle } from "./ThemeToggle";

const WALLET_OPTIONS = [
  { name: "MetaMask", id: "metamask" },
  { name: "WalletConnect", id: "walletconnect" },
  { name: "Coinbase Wallet", id: "coinbase" },
] as const;

export function ConnectWallet() {
  const { address, isConnecting, error, connect, disconnect } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();

  const switchToAIANetwork = async () => {
    if (!window.ethereum) return;

    try {
      // Try switching to AIA network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AIA_NETWORK.chainId }],
      });
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [AIA_NETWORK],
          });
        } catch (addError) {
          toast({
            title: "网络添加失败",
            description: "无法添加 AIA 网络，请手动添加",
            variant: "destructive",
          });
        }
      }
    }
  };

  useEffect(() => {
    if (address && window.ethereum) {
      window.ethereum.request({ method: 'eth_chainId' })
        .then((chainId: string) => {
          if (chainId !== AIA_NETWORK.chainId) {
            toast({
              title: "需要切换网络",
              description: "请切换到 AIA 网络以继续操作",
              action: (
                <button
                  onClick={switchToAIANetwork}
                  className="rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                >
                  切换网络
                </button>
              ),
            });
          }
        });
    }
  }, [address]);

  const handleConnect = async (walletId: string) => {
    try {
      if (walletId !== "metamask") {
        toast({
          title: "暂不支持",
          description: "目前仅支持 MetaMask 钱包",
          variant: "destructive",
        });
        return;
      }
      await connect();
      await switchToAIANetwork();
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (address) {
    return (
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="space-x-2"
            >
              <Wallet className="h-4 w-4" />
              <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={disconnect}>
              {t('wallet.disconnect')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <div className="relative">
        {error && <div className="absolute -top-8 right-0 text-sm text-destructive">{error}</div>}
        
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button disabled={isConnecting}>
              {isConnecting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              <span>{t('wallet.connect')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {WALLET_OPTIONS.map(wallet => (
              <DropdownMenuItem key={wallet.id} onClick={() => handleConnect(wallet.id)}>
                {wallet.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 