const hre = require("hardhat");
const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  try {
    console.log("Starting deployment...");
    console.log("Network:", hre.network.name);
    console.log("ChainId:", hre.network.config.chainId);

    // 获取部署账户
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // 部署 ADV Token
    console.log("\nDeploying ADVToken...");
    const ADVToken = await hre.ethers.getContractFactory("ADVToken");
    const advToken = await ADVToken.deploy();
    console.log("Waiting for ADVToken deployment transaction:", advToken.target);
    await advToken.waitForDeployment();
    const tokenAddress = await advToken.getAddress();
    console.log("ADVToken deployed to:", tokenAddress);

    // 等待几个区块确认
    console.log("Waiting for confirmations...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 部署 DAO
    console.log("\nDeploying AIAdvisorDAO...");
    const AIAdvisorDAO = await hre.ethers.getContractFactory("AIAdvisorDAO");
    const aiAdvisorDAO = await AIAdvisorDAO.deploy(tokenAddress);
    console.log("Waiting for AIAdvisorDAO deployment transaction:", aiAdvisorDAO.target);
    await aiAdvisorDAO.waitForDeployment();
    const daoAddress = await aiAdvisorDAO.getAddress();
    console.log("AIAdvisorDAO deployed to:", daoAddress);

    // 打印部署信息
    console.log("\nDeployment Summary:");
    console.log("====================");
    console.log("Network:", hre.network.name);
    console.log("ADVToken:", tokenAddress);
    console.log("AIAdvisorDAO:", daoAddress);
    
    // 验证合约已部署
    console.log("\nVerifying deployment...");
    const tokenContract = await hre.ethers.getContractAt("ADVToken", tokenAddress);
    const tokenBalance = await tokenContract.balanceOf(deployer.address);
    // 使用 ethers.formatUnits 替代 formatEther
    console.log("Initial token balance of deployer:", 
      ethers.formatUnits(tokenBalance, 18));

    // 保存部署信息
    const deployData = {
      network: hre.network.name,
      chainId: hre.network.config.chainId,
      contracts: {
        ADVToken: tokenAddress,
        AIAdvisorDAO: daoAddress
      },
      deployer: deployer.address,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
      'deployment.json',
      JSON.stringify(deployData, null, 2)
    );
    console.log("\nDeployment information saved to deployment.json");

  } catch (error) {
    console.error("\nDeployment failed!");
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed!");
    console.error(error);
    process.exit(1);
  });