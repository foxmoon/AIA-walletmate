import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Chainlink Price Feed addresses for MEME tokens
const PRICE_FEEDS = {
  'PEPE': '0x75A52c0e32397A3FC0c052E2CeB3479802713Cf4',
  'WIF': '0x4B531A318B0e44B549F3b2f824721b3D0d51930A',
  'BONK': '0x3D5Cc4A45C2075e5ac9e4c53B9D8789CE6c3bD2C'
};

const ABI = [
  "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)"
];

export async function POST(req: Request) {
  try {
    const { symbol } = await req.json();
    
    if (!PRICE_FEEDS[symbol]) {
      return NextResponse.json(
        { error: `No price feed available for ${symbol}` },
        { status: 400 }
      );
    }

    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const priceFeed = new ethers.Contract(PRICE_FEEDS[symbol], ABI, provider);

    const roundData = await priceFeed.latestRoundData();
    const price = Number(ethers.formatUnits(roundData.answer, 8));
    
    // Calculate 24h change (mock data for now)
    const change24h = Math.random() * 20 - 10; // Random value between -10 and 10

    return NextResponse.json({
      price,
      change24h
    });
  } catch (error) {
    console.error('Error fetching price:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price data' },
      { status: 500 }
    );
  }
} 