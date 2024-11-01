import { useState, useEffect } from 'react';

interface MemeToken {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  aiSentiment: string;
  riskLevel: string;
}

const MEME_TOKENS = [
  { name: "Pepe", symbol: "PEPE" },
  { name: "Dogwifhat", symbol: "WIF" },
  { name: "BONK", symbol: "BONK" }
];

export function useMemeMarket() {
  const [memeTokens, setMemeTokens] = useState<MemeToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMemeTokens() {
      try {
        const updatedTokens = await Promise.all(
          MEME_TOKENS.map(async (token) => {
            let retries = 3;
            while (retries > 0) {
              try {
                const priceResponse = await fetch('/api/cryptocompare/price', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ symbol: token.symbol })
                });
                
                if (priceResponse.status === 429) {
                  retries--;
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  continue;
                }
                
                if (!priceResponse.ok) {
                  throw new Error(`Price API error: ${priceResponse.statusText}`);
                }
                
                const priceData = await priceResponse.json();
                
                const sentimentResponse = await fetch('/api/meme/sentiment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    tokenSymbol: token.symbol,
                    price: priceData.price,
                    priceChange: priceData.change24h
                  })
                });
                
                if (!sentimentResponse.ok) {
                  throw new Error(`Sentiment API error: ${sentimentResponse.statusText}`);
                }
                
                const sentimentData = await sentimentResponse.json();

                return {
                  name: token.name,
                  symbol: token.symbol,
                  price: priceData.price,
                  change24h: priceData.change24h,
                  aiSentiment: sentimentData.sentiment || "无法获取AI分析",
                  riskLevel: Math.abs(priceData.change24h) > 10 ? "High" : "Medium"
                };
              } catch (error) {
                if (retries === 1) throw error;
                retries--;
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          })
        );

        setMemeTokens(updatedTokens);
        setError(null);
      } catch (error) {
        console.error('Error fetching meme tokens:', error);
        setError('获取MEME代币数据失败');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMemeTokens();
    const interval = setInterval(fetchMemeTokens, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { memeTokens, isLoading, error };
} 