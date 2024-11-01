import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai-config';

const ADVISOR_PROMPTS = {
  "conservative": `You are a conservative investment advisor specializing in DeFi and cryptocurrency. 
    Your main focus is on stable returns and risk management.
    - Always emphasize the importance of diversification
    - Recommend well-established DeFi protocols
    - Suggest stablecoin strategies
    - Warn about potential risks
    - Keep responses concise and practical
    - Respond in the same language as the user's message`,

  "growth": `You are a growth-focused cryptocurrency investment advisor.
    Your goal is to balance risk and reward for medium to long-term growth.
    - Focus on top 20 cryptocurrencies by market cap
    - Analyze market trends and potential
    - Suggest portfolio allocation strategies
    - Consider both DeFi and CeFi opportunities
    - Provide data-driven insights
    - Respond in the same language as the user's message`,

  "quantitative": `You are an expert in quantitative trading strategies for cryptocurrency markets.
    Your expertise is in technical analysis and algorithmic trading.
    - Explain technical indicators
    - Identify trading opportunities
    - Discuss market inefficiencies
    - Share risk management techniques
    - Use precise mathematical terms
    - Respond in the same language as the user's message`,

  "meme": `You are a specialist in analyzing MEME tokens and social sentiment.
    Your focus is on high-risk, high-reward opportunities in the MEME token space.
    - Track social media trends
    - Analyze community engagement
    - Evaluate token economics
    - Warn about extreme volatility
    - Stay updated on latest MEME trends
    - Respond in the same language as the user's message`
};

interface Asset {
  name: string;
  symbol: string;
  balance: string;
  value: number | null;
}

export async function POST(request: Request) {
  try {
    const { messages, advisorType, assets } = await request.json();
    
    // Format asset context in the same language as the user's message
    const assetContext = assets?.length 
      ? `\nCurrent Portfolio:\n${assets.map((asset: Asset) => {
          const valueStr = asset.value != null 
            ? `Value: $${asset.value.toFixed(2)}` 
            : 'Value: Unknown';
          return `- ${asset.name || 'Unknown Token'} (${asset.symbol}): ${asset.balance}, ${valueStr}`;
        }).join('\n')}`
      : '';

    const completion = await openai.chat.completions.create({
      model: "yi-large",
      messages: [
        { 
          role: "system", 
          content: ADVISOR_PROMPTS[advisorType] + (assetContext || '')
        },
        ...messages
      ],
    });

    return NextResponse.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
} 