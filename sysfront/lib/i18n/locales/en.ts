export default {
  common: {
    error: "Error",
    success: "Success",
    confirm: "Confirm",
    cancel: "Cancel",
    loading: "Loading...",
    send: "Send",
    noData: "No data available",
  },
  wallet: {
    connect: "Connect Wallet",
    connectError: "Please install MetaMask",
    connecting: "Connecting...",
    disconnect: "Disconnect",
    insufficientBalance: "Insufficient ADV token balance",
    switchNetwork: "Please switch to AIA Testnet",
    connectionFailed: "Failed to connect wallet",
    overview: {
      totalValue: "Total Portfolio Value",
      dayChange: "24h Change",
      noAssets: "No assets data",
      consultWith: "Consult with {{advisor}}",
      analyzing: "AI is analyzing your portfolio...",
      failedToGetAdvice: "Failed to get advice, please try again later",
    }
  },
  advisor: {
    conservative: {
      name: "Conservative Advisor",
      description: "Focus on low-risk, stable returns, suitable for conservative investors"
    },
    growth: {
      name: "Growth Advisor",
      description: "Balance risk and return, pursue stable medium to long-term growth"
    },
    quantitative: {
      name: "Quantitative Advisor",
      description: "Use high-frequency trading strategies, suitable for investors seeking high returns"
    },
    meme: {
      name: "MEME Advisor",
      description: "MEME token investment advice based on ChainLink price oracle and AI analysis"
    },
    chat: {
      inputPlaceholder: "Enter your question...",
      sendButton: "Send",
      thinking: "AI is thinking...",
      errorMessage: "Failed to get response, please try again",
      defaultQuestion: "Based on my current asset allocation, please provide adjustment suggestions for better returns."
    },
    unlock: {
      confirm: "It costs {{amount}} ADV to unlock {{advisor}}, continue?",
      success: "{{advisor}} has been unlocked, you can now use the advisor service",
      failed: "Failed to unlock, please ensure you have enough ADV tokens and approved payment",
      unlocking: "Unlocking...",
      connectFirst: "Please connect wallet first"
    }
  },
  memeMarket: {
    price: "Price",
    change24h: "24h Change",
    aiSentiment: "AI Sentiment"
  }
}; 