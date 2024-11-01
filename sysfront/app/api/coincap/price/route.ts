import { NextResponse } from 'next/server';

// CoinCap API endpoint
const COINCAP_API = 'https://api.coincap.io/v2';

// Map of token symbols to CoinCap IDs
const TOKEN_IDS = {
  'PEPE': 'pepe',
  'WIF': 'dogwifhat',
  'BONK': 'bonk'
};

export async function POST(req: Request) {
  try {
    const { symbol } = await req.json();
    
    if (!TOKEN_IDS[symbol]) {
      return NextResponse.json(
        { error: `No price data available for ${symbol}` },
        { status: 400 }
      );
    }

    const response = await fetch(`${COINCAP_API}/assets/${TOKEN_IDS[symbol]}`);
    
    if (!response.ok) {
      throw new Error(`CoinCap API error: ${response.statusText}`);
    }

    const data = await response.json();
    const asset = data.data;

    return NextResponse.json({
      price: parseFloat(asset.priceUsd),
      change24h: parseFloat(asset.changePercent24Hr)
    });
  } catch (error) {
    console.error('Error fetching price:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price data' },
      { status: 500 }
    );
  }
} 