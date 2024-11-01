// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;  // 更新版本

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AIAdvisorDAO is Ownable {
    IERC20 public advToken;
    uint256 public constant CONSULTATION_FEE = 100 * 10**18; // 100 ADV tokens
    
    struct User {
        bool hasActivePlan;
        uint256 planExpiry;
    }
    
    mapping(address => User) public users;
    mapping(address => uint256) public stakingBalance;
    uint256 public totalStaked;
    
    event ConsultationPurchased(address indexed user, uint256 timestamp);
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    
    constructor(address _tokenAddress) Ownable(msg.sender) {  // 更新构造函数
        advToken = IERC20(_tokenAddress);
    }
    
    function purchaseConsultation() external {
        require(advToken.transferFrom(msg.sender, address(this), CONSULTATION_FEE), 
                "Transfer failed");
                
        users[msg.sender].hasActivePlan = true;
        users[msg.sender].planExpiry = block.timestamp + 30 days;
        
        emit ConsultationPurchased(msg.sender, block.timestamp);
    }
    
    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");
        require(advToken.transferFrom(msg.sender, address(this), amount), 
                "Transfer failed");
        
        stakingBalance[msg.sender] += amount;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
    
    function unstake(uint256 amount) external {
        require(stakingBalance[msg.sender] >= amount, "Insufficient balance");
        
        stakingBalance[msg.sender] -= amount;
        totalStaked -= amount;
        
        require(advToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit Unstaked(msg.sender, amount);
    }
    
    function checkAccess(address user) external view returns (bool) {
        return users[user].hasActivePlan && users[user].planExpiry > block.timestamp;
    }
}