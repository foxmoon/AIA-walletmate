export const CONTRACTS = {
  ADVToken: {
    address: "0xD657cB34E21eac820dd97A1B04d96Cf3fc1B9dEb",
    abi: [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address owner) view returns (uint256)",
      "function transfer(address to, uint256 amount) returns (bool)",
      "function approve(address spender, uint256 amount) returns (bool)",
      "function allowance(address owner, address spender) view returns (uint256)",
      "event Transfer(address indexed from, address indexed to, uint256 value)",
      "event Approval(address indexed owner, address indexed spender, uint256 value)"
    ]
  },
  AIAdvisorDAO: {
    address: "0x6b46bA8F86E27EA1BBBaA138e388b0206CedacB1",
    abi: [
      "function purchaseConsultation() external",
      "function checkAccess(address user) external view returns (bool)",
      "function stake(uint256 amount) external",
      "function unstake(uint256 amount) external",
      "event ConsultationPurchased(address indexed user, uint256 timestamp)",
      "event Staked(address indexed user, uint256 amount)",
      "event Unstaked(address indexed user, uint256 amount)"
    ]
  },
  chainId: 1320
}; 