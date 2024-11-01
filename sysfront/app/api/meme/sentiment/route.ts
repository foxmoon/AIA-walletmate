import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai-config';

export async function POST(req: Request) {
  try {
    const { tokenSymbol, price, priceChange } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "yi-large",
      messages: [
        {
          role: "system",
          content: "You are a cryptocurrency market analyst specializing in MEME tokens.",
        },
        {
          role: "user",
          content: `Analyze the market sentiment for ${tokenSymbol} with current price $${price} and 24h change ${priceChange}%. Provide a brief sentiment analysis in Chinese.`,
        },
      ],
    });

    return NextResponse.json({ sentiment: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error getting sentiment:", error);
    return NextResponse.json(
      { error: "Failed to get sentiment analysis" },
      { status: 500 }
    );
  }
} 