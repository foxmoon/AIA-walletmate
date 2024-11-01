import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { token, startTime, endTime, interval } = await req.json();
    const apiKey = process.env.CRYPTOCOMPARE_API_KEY;

    if (!apiKey) {
      throw new Error('未配置 CRYPTOCOMPARE_API_KEY');
    }

    // 使用 CryptoCompare API 获取历史数据
    const limit = Math.ceil((endTime - startTime) / (interval === '1h' ? 3600 : 86400));
    const endpoint = interval === '1h' ? 'histohour' : 'histoday';
    
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/v2/${endpoint}?fsym=${token}&tsym=USD&limit=${limit}&api_key=${apiKey}`
    );

    const data = await response.json();
    
    if (data.Response === 'Error') {
      console.log('API Response:', data);
      // 返回空数组而不是抛出错误
      return NextResponse.json([]);
    }

    const prices = data.Data.Data.map((item: any) => ({
      timestamp: item.time,
      price: item.close
    })).filter((item: any) => 
      item.timestamp >= startTime && item.timestamp <= endTime
    );

    return NextResponse.json(prices);
    
  } catch (error) {
    console.error('Error in historical price API:', error);
    return NextResponse.json([]); // 出错时返回空数组
  }
} 