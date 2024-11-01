import Moralis from 'moralis';

export const initializeMoralis = async () => {
  if (!Moralis.Core.isStarted) {
    const apiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
    if (!apiKey) {
      throw new Error('Moralis API key not found');
    }
    
    await Moralis.start({
      apiKey,
    });
  }
};
