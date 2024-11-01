"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, Loader2 } from "lucide-react";
import { useWallet } from "@/lib/WalletContext";
import { useEffect, useState } from "react";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import * as ethers from "ethers";
import { AssetPriceChart } from "./AssetPriceChart";

interface TokenBalance {
  symbol: string;
  balance: string;
  price: number;
  value: number;
  thumbnail?: string;
  name?: string;
  priceHistory?: {
    time: string;
    value: number;
  }[];
}

export function AssetAllocation({ onAssetsUpdate }: { onAssetsUpdate?: (assets: TokenBalance[]) => void }) {
  const { address, getMoralis } = useWallet();
  const [assets, setAssets] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

  useEffect(() => {
    async function loadAssets() {
      if (!address) return;
      
      const now = Date.now();
      if (now - lastFetch < REFRESH_INTERVAL && assets.length > 0) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const Moralis = getMoralis();
        const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
          chain: "0x1",
          address: address,
        });

        const balances = response.json.result;

        if (!balances || balances.length === 0) {
          setError('未找到任何代币资产');
        } else {
          const assetsWithHistory = await Promise.all(
            balances.map(async (token) => {
              try {
                const endTime = Math.floor(Date.now() / 1000);
                const startTime = endTime - 7 * 24 * 60 * 60; // 7 days

                const historyResponse = await fetch('/api/chainlink/historical-price', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    token: token.symbol,
                    startTime,
                    endTime,
                    interval: '1h'
                  })
                });

                const historyData = await historyResponse.json();
                
                // 即使没有历史数据，也返回基本信息
                return {
                  symbol: token.symbol,
                  name: token.name || token.symbol,
                  balance: token.balance_formatted || '0',
                  price: token.usd_price || 0,
                  value: token.usd_value || 0,
                  thumbnail: token.thumbnail || '/default-token-icon.png',
                  priceHistory: Array.isArray(historyData) && historyData.length > 0 
                    ? (() => {
                        const sortedData = historyData
                          .map(item => ({
                            time: new Date(item.timestamp * 1000).toISOString().split('T')[0],
                            value: item.price || 0
                          }))
                          .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
                        
                        // 使用 Map 去重
                        return [...new Map(
                          sortedData.map(item => [item.time, item])
                        ).values()];
                      })()
                    : undefined
                };
              } catch (error) {
                console.error(`Error processing token ${token.symbol}:`, error);
                return {
                  symbol: token.symbol,
                  name: token.name || token.symbol,
                  balance: token.balance_formatted || '0',
                  price: token.usd_price || 0,
                  value: token.usd_value || 0,
                  thumbnail: token.thumbnail || '/default-token-icon.png'
                };
              }
            })
          );

          setAssets(assetsWithHistory);
          onAssetsUpdate?.(assetsWithHistory);
          setLastFetch(now);
        }
      } catch (err) {
        console.error('Error loading assets:', err);
        setError('加载资产失败，请确保连接到以太坊主网');
      } finally {
        setIsLoading(false);
      }
    }

    loadAssets();
    const interval = setInterval(loadAssets, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [address, onAssetsUpdate, getMoralis, assets.length, lastFetch]);

  if (!address) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          请连接钱包查看资产
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">资产分配</h2>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
        
        {error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : (
          <div className="space-y-6">
            {assets.map((asset) => (
              <div
                key={asset.symbol}
                className="overflow-hidden rounded-xl border bg-card shadow-sm"
              >
                <div className="p-4 flex items-center space-x-4">
                  <div className="flex items-center space-x-4 min-w-[200px]">
                    <div className="h-10 w-10 overflow-hidden rounded-full">
                      <img
                        src={asset.thumbnail || '/default-token-icon.png'}
                        alt={asset.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{asset.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{asset.symbol}</span>
                        <span>•</span>
                        <span>{parseFloat(asset.balance || '0').toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right min-w-[120px]">
                    <p className="text-lg font-semibold">
                      ${(asset.price || 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${(asset.value || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>

                  {asset.priceHistory && (
                    <div className="flex-1">
                      <AssetPriceChart
                        symbol={asset.symbol}
                        priceData={asset.priceHistory}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}