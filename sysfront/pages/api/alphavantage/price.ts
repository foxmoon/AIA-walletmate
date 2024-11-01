import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { symbol } = req.body;
  const apiKey = process.env.CRYPTOCOMPARE_API_KEY;

  try {
    const response = await axios.get('https://min-api.cryptocompare.com/data/v2/histoday', {
      params: {
        fsym: symbol,
        tsym: 'USD',
        limit: 1,  // We only need today and yesterday's data
        api_key: apiKey
      }
    });

    const data = response.data;
    
    if (data.Response === 'Error') {
      throw new Error(data.Message);
    }

    const latestPrice = data.Data.Data[1].close;  // Today's close price
    const previousPrice = data.Data.Data[0].close; // Yesterday's close price
    const change24h = ((latestPrice - previousPrice) / previousPrice) * 100;

    return res.status(200).json({
      price: latestPrice,
      change24h: change24h
    });
  } catch (error) {
    console.error('Error fetching price from CryptoCompare:', error);
    return res.status(500).json({ message: 'Failed to fetch price data' });
  }
} 