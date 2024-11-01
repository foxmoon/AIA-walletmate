import { ethers } from 'ethers';

const CHAINLINK_FEED_REGISTRY = "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf";

const ABI = [
  "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
];

export async function getTokenPrice(tokenAddress: string, provider: ethers.Provider) {
  const contract = new ethers.Contract(CHAINLINK_FEED_REGISTRY, ABI, provider);
  try {
    const data = await contract.latestRoundData();
    return ethers.formatUnits(data.answer, 8);
  } catch (error) {
    console.error("Error fetching price:", error);
    return null;
  }
}