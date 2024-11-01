# AI Wallet Advisor

An intelligent cryptocurrency portfolio manager powered by AI advisors, built on the AIAdviser network.

## Overview

AI Wallet Advisor is a decentralized application (dApp) that provides AI-powered investment advice for cryptocurrency portfolios. The platform features multiple specialized AI advisors:

- 🛡️ Conservative Advisor - Focus on stable returns and risk management
- 📈 Growth Advisor - Balance risk and reward for medium to long-term growth  
- 🤖 Quantitative Advisor - Technical analysis and algorithmic trading strategies
- 🚀 MEME Advisor - Analysis of MEME tokens and social sentiment

## Features

- Real-time portfolio tracking and analysis
- AI-powered investment recommendations
- Interactive 3D portfolio visualization
- Price charts with technical indicators
- Multi-language support (English/Chinese)
- Dark/Light theme support

## Technology Stack

- Frontend: Next.js 13.5
- Smart Contracts: Solidity
- Blockchain: AIAdviser Network (ChainID: 1320)
- UI Components: shadcn/ui
- Wallet Integration: RainbowKit
- Charts: ECharts
- AI: OpenAI API

## Smart Contracts

The platform utilizes two main smart contracts deployed on the AIAdviser network:

### ADVToken (0xD657cB34E21eac820dd97A1B04d96Cf3fc1B9dEb)
- ERC20 token used for platform access
- Required for unlocking advisor features

### AIAdvisorDAO (0x6b46bA8F86E27EA1BBBaA138e388b0206CedacB1)
- Manages access control for AI advisors
- Handles staking and consultation purchases

## Installation

1. Clone the repository:
git clone https://github.com/your-username/aiwallet-super.git
cd sysfront

2.:
bash
npm install

3. Create a `.env` file with required environment variables:

4. Start the development server:
npm run dev


## Network Configuration

To connect to the AIAdviser network, add these network details to your wallet:

- Network Name: AIAdviser Testnet
- RPC URL: https://testnet-rpc.aiadviser.com
- Chain ID: 1320
- Currency Symbol: AIA
- Block Explorer: https://scan.aiadviser.com

## Usage

1. Connect your wallet using MetaMask
2. Switch to AIAdviser network
3. Purchase ADV tokens for advisor access
4. Select an AI advisor based on your investment strategy
5. Receive personalized portfolio analysis and recommendations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Wallet integration by [RainbowKit](https://www.rainbowkit.com/)
- Charts powered by [ECharts](https://echarts.apache.org/)
