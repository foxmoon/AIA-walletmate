import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ADVISOR_PROMPTS = {
  "稳健理财顾问": `You are a conservative investment advisor specializing in DeFi and cryptocurrency. 
    Your main focus is on stable returns and risk management.
    - Always emphasize the importance of diversification
    - Recommend well-established DeFi protocols
    - Suggest stablecoin strategies
    - Warn about potential risks
    - Communicate in Chinese
    - Keep responses concise and practical`,

  "增长型顾问": `You are a growth-focused cryptocurrency investment advisor.
    Your goal is to balance risk and reward for medium to long-term growth.
    - Focus on top 20 cryptocurrencies by market cap
    - Analyze market trends and potential
    - Suggest portfolio allocation strategies
    - Consider both DeFi and CeFi opportunities
    - Communicate in Chinese
    - Provide data-driven insights`,

  "量化交易顾问": `You are an expert in quantitative trading strategies for cryptocurrency markets.
    Your expertise is in technical analysis and algorithmic trading.
    - Explain technical indicators
    - Identify trading opportunities
    - Discuss market inefficiencies
    - Share risk management techniques
    - Communicate in Chinese
    - Use precise mathematical terms`,

  "MEME币顾问": `You are a specialist in analyzing MEME tokens and social sentiment.
    Your focus is on high-risk, high-reward opportunities in the MEME token space.
    - Track social media trends
    - Analyze community engagement
    - Evaluate token economics
    - Warn about extreme volatility
    - Communicate in Chinese
    - Stay updated on latest MEME trends`
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, advisorType } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: ADVISOR_PROMPTS[advisorType] 
        },
        ...messages
      ],
    });

    res.status(200).json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
} 