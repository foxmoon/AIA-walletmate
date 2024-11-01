// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;  // 更新版本

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ADVToken is ERC20, Ownable {
    constructor() ERC20("AI Advisor", "ADV") Ownable(msg.sender) {  // 更新构造函数
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}