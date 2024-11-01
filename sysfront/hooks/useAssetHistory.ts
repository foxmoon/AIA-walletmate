"use client";

import { useState, useEffect } from 'react';
import { calculateMACD } from '@/lib/indicators';

export function useAssetHistory(symbol: string) {
  const [priceData, setPriceData] = useState<any[]>([]);
  const [macdData, setMacdData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch('/api/chainlink/historical-price', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: symbol,
            interval: '1h',
            limit: 168 // 7 days of hourly data
          })
        });

        const data = await response.json();
        
        // 格式化价格数据
        const formattedPrices = data.map((item: any) => ({
          time: new Date(item.timestamp * 1000).toISOString().split('T')[0],
          value: item.price
        }));

        // 计算 MACD
        const macd = calculateMACD(formattedPrices.map(p => p.value));
        const formattedMacd = formattedPrices.map((price, i) => ({
          time: price.time,
          macd: macd.macdLine[i] || 0,
          signal: macd.signalLine[i] || 0,
          histogram: macd.histogram[i] || 0
        }));

        setPriceData(formattedPrices);
        setMacdData(formattedMacd);
      } catch (error) {
        console.error('Error fetching price history:', error);
      }
    }

    fetchHistory();
    const interval = setInterval(fetchHistory, 60000); // 每分钟更新一次
    
    return () => clearInterval(interval);
  }, [symbol]);

  return { priceData, macdData };
} 