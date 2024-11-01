export function calculateMACD(prices: number[]) {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  
  const macdLine = ema12.map((value, i) => value - ema26[i]);
  const signalLine = calculateEMA(macdLine, 9);
  const histogram = macdLine.map((value, i) => value - signalLine[i]);

  return { macdLine, signalLine, histogram };
}

function calculateEMA(prices: number[], period: number) {
  const k = 2 / (period + 1);
  const ema = [prices[0]];
  
  for (let i = 1; i < prices.length; i++) {
    ema[i] = prices[i] * k + ema[i-1] * (1 - k);
  }
  
  return ema;
} 