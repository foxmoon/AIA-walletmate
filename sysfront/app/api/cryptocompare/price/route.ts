import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { symbol } = await req.json();
    const apiKey = process.env.CRYPTOCOMPARE_API_KEY;

    if (!apiKey) {
      throw new Error('未配置 CRYPTOCOMPARE_API_KEY');
    }

    // Get current price
    const priceResponse = await axios.get(`https://min-api.cryptocompare.com/data/price`, {
      params: {
        fsym: symbol,
        tsyms: 'USD',
        api_key: apiKey
      }
    });

    // Get 24h historical price for calculating change
    const historicalResponse = await axios.get('https://min-api.cryptocompare.com/data/v2/histohour', {
      params: {
        fsym: symbol,
        tsym: 'USD',
        limit: 24,
        api_key: apiKey
      }
    });

    const currentPrice = priceResponse.data.USD;
    const historicalPrice = historicalResponse.data.Data.Data[0].open;
    const change24h = ((currentPrice - historicalPrice) / historicalPrice) * 100;

    return NextResponse.json({
      price: currentPrice,
      change24h: change24h
    });

  } catch (error) {
    console.error('从 CryptoCompare 获取价格失败:', error);
    return NextResponse.json(
      { error: '获取价格数据失败' },
      { status: 500 }
    );
  }
} 