const ALPHA_VANTAGE_API_KEY = process.env.ALPHAVANTAGE_API_KEY;

async function getMemeTokenPrice(symbol: string) {
  const url = `https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=${symbol}&market=USD&interval=5min&apikey=${ALPHA_VANTAGE_API_KEY}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching price data:', error);
    throw error;
  }
}

export { getMemeTokenPrice }; 