import { ethers } from "hardhat";

const BTC_USD	=	'0x007A22900a3B98143368Bd5906f8E17e9867581b'
const DAI_USD	=	'0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046'
const ETH_USD	=	'0x0715A7794a1dc8e42615F059dD6e406A6594651A'
const LINK_MATIC	= '0x12162c3E810393dEC01362aBf156D7ecf6159528'
const MATIC_USD	=	'0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada'
const SAND_USD	=	'0x9dd18534b8f456557d11B9DDB14dA89b2e52e308'
const USDC_USD	=	'0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0'
const USDT_USD	=	'0x92C09849638959196E976289418e5973CC96d645'
const cxLink_PoR	=	'0xc9db631b47B5F711Ca3a694f601Aa1108422c6E5'
const cxUni_PoR	=	'0xEb3F14F6D3d8f541bA597dBB92A5bFF284a05D45'
const fxADA_PoR	=	'0x0855428B493637726090003eD12Dd224715CA217'
async function main() {
  // We get the contract to deploy
  const tokenPrice = await ethers.getContractFactory("PriceConsumerV3");
  const feedPrice = await tokenPrice.deploy(BTC_USD);

  await feedPrice.deployed();
  console.log(await feedPrice.getLatestPrice())
  console.log("Greeter deployed to:", feedPrice.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
