// import { Signer } from "ethers";
import { ethers } from "hardhat";
// const AAVE_ETH	=	'0xbE23a3AA13038CfC28aFd0ECe4FdE379fE7fBfc4'
// const LINK_ETH	=	'0xb77fa460604b9C6435A235D057F7D319AC83cb53'

async function main() {
  // deploting the swapper contract
  const contract = await ethers.getContractFactory("LINK_AAVE");
  const swappercontract = await contract.deploy();
  await swappercontract.deployed();

  // getting the chainlink feed price
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
