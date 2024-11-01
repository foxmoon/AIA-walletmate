require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// 确保环境变量存在
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

if (!PRIVATE_KEY || !RPC_URL) {
  throw new Error("请在 .env 文件中设置 PRIVATE_KEY 和 RPC_URL");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    aiadviser: {
      url: RPC_URL,
      chainId: 1320,
      accounts: [PRIVATE_KEY],
      timeout: 60000,
      gas: "auto",
      gasPrice: "auto",
      confirmations: 2,
      gasMultiplier: 1.2
    }
  },
  mocha: {
    timeout: 60000
  }
};