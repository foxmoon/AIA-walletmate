import { openai } from './openai-config';

export async function getTokenSentiment(
  tokenSymbol: string,
  price: number,
  priceChange: number
) {
  try {
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

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error getting sentiment:", error);
    return "无法获取AI分析";
  }
}