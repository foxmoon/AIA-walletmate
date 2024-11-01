export default {
  common: {
    error: "错误",
    success: "成功",
    confirm: "确认",
    cancel: "取消",
    loading: "加载中...",
    send: "发送",
    noData: "暂无数据",
  },
  wallet: {
    connect: "连接钱包",
    connectError: "请安装 MetaMask",
    connecting: "连接中...",
    disconnect: "断开连接",
    insufficientBalance: "ADV代币余额不足",
    switchNetwork: "请切换到 AIA 测试网",
    connectionFailed: "连接钱包失败",
    overview: {
      totalValue: "投资组合总价值",
      dayChange: "24小时涨跌",
      noAssets: "您的钱包中暂无资产",
      consultWith: "咨询{{advisor}}",
      analyzing: "AI正在分析您的投资组合...",
      failedToGetAdvice: "获取建议失败，请稍后重试",
      pleaseConnectWallet: "请先连接钱包后再咨询顾问"
    }
  },
  advisor: {
    conservative: {
      name: "稳健理财顾问",
      description: "专注于低风险、稳定收益的投资策略，适合保守型投资者"
    },
    growth: {
      name: "增长型顾问",
      description: "平衡风险与收益，追求中长期稳定增长"
    },
    quantitative: {
      name: "量化交易顾问",
      description: "使用高频交易策略，适合追求高收益的投资者"
    },
    meme: {
      name: "MEME币顾问",
      description: "基于ChainLink价格预言机和AI分析的MEME币投资建议"
    },
    generating: "顾问意见生成中...",
    chat: {
      inputPlaceholder: "输入您的问题...",
      sendButton: "发送",
      thinking: "AI思考中...",
      errorMessage: "获取回复失败，请重试",
      defaultQuestion: "基于我当前的资产配置情况，请给出调整建议以获得更好的收益。"
    },
    unlock: {
      confirm: "需要花费 {{amount}} ADV 来解锁{{advisor}}，是否继续？",
      success: "{{advisor}}已解锁，您现在可以开始使用顾问服务了",
      failed: "解锁失败，请确保您有足够的ADV代币并已授权支付",
      unlocking: "解锁中...",
      connectFirst: "请先连接钱包"
    }
  },
  memeMarket: {
    price: "价格",
    change24h: "24h涨跌",
    aiSentiment: "AI情绪"
  },
  portfolio: {
    performance: "投资组合表现",
    value: "总价值",
    timeRange: "时间范围",
    day: "天",
    week: "周",
    month: "月",
    year: "年"
  }
}; 