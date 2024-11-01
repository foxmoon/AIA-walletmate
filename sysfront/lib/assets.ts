import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { initializeMoralis } from './moralisInit';

export async function getAllTokenBalancesWithPrices(address: string) {
  try {
    // Initialize Moralis
    await initializeMoralis();

    // Specify the chain you want to query
    const chain = EvmChain.ETHEREUM;

    // Fetch token balances with prices using Moralis API
    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      address,
      chain,
      token_addresses: [],
    });

    console.log(response.raw);
    return response.raw;
  } catch (error) {
    console.error("Error fetching token balances with prices:", error);
    throw error;
  }
} 