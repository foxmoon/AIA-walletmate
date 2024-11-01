import { useEffect, useState } from 'react';
import { useWallet } from '@/lib/WalletContext';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useI18n } from '@/lib/i18n/I18nContext';

interface HistoricalPrice {
  timestamp: number;
  totalValue: number;
}

export function PortfolioPerformance() {
  const { tokens } = useWallet();
  const [historicalPrices, setHistoricalPrices] = useState<HistoricalPrice[]>([]);
  const { t } = useI18n();
  
  useEffect(() => {
    const fetchHistoricalPrices = async () => {
      if (!tokens || tokens.length === 0) return;
      
      // 获取过去30天的时间戳
      const endTime = Math.floor(Date.now() / 1000);
      const startTime = endTime - 30 * 24 * 60 * 60;
      
      try {
        // 并行获取所有代币的历史价格
        const pricePromises = tokens.map(async (token) => {
          const response = await fetch(`/api/chainlink/historical-price`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token: token.symbol,
              startTime,
              endTime
            })
          });
          
          const prices = await response.json();
          return {
            symbol: token.symbol,
            balance: parseFloat(token.balance_formatted),
            prices: prices.map((p: any) => ({
              timestamp: p.timestamp,
              price: p.price
            }))
          };
        });
        
        const tokenPrices = await Promise.all(pricePromises);
        
        // 计算每个时间点的总价值
        const timePoints = new Set<number>();
        tokenPrices.forEach(token => {
          token.prices.forEach(p => timePoints.add(p.timestamp));
        });
        
        const sortedTimePoints = Array.from(timePoints).sort();
        const portfolioValues = sortedTimePoints.map(timestamp => {
          const totalValue = tokenPrices.reduce((sum, token) => {
            const price = token.prices.find(p => p.timestamp === timestamp)?.price || 0;
            return sum + (token.balance * price);
          }, 0);
          
          return {
            timestamp,
            totalValue
          };
        });
        
        setHistoricalPrices(portfolioValues);
      } catch (error) {
        console.error('Failed to fetch historical prices:', error);
      }
    };
    
    fetchHistoricalPrices();
  }, [tokens]);
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };
  
  const formatValue = (value: number) => {
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">{t('portfolio.performance')}</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalPrices}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatDate}
              interval="preserveStartEnd"
            />
            <YAxis 
              tickFormatter={formatValue}
              width={80}
            />
            <Tooltip 
              labelFormatter={formatDate}
              formatter={(value: number) => [formatValue(value), t('portfolio.value')]}
            />
            <Line 
              type="monotone" 
              dataKey="totalValue" 
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
} 