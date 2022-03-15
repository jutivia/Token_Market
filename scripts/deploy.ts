import { Signer } from "ethers";
import { ethers, network } from "hardhat";
// const BTC_USD	=	'0x007A22900a3B98143368Bd5906f8E17e9867581b'
// const ETH_USD	=	'0x0715A7794a1dc8e42615F059dD6e406A6594651A'
// const LINK_MATIC	= '0x12162c3E810393dEC01362aBf156D7ecf6159528'
// const MATIC_USD	=	'0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada'
// const SAND_USD	=	'0x9dd18534b8f456557d11B9DDB14dA89b2e52e308'
// const USDC_USD	=	'0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0'
// const USDT_USD	=	'0x92C09849638959196E976289418e5973CC96d645'
// const cxLink_PoR	=	'0xc9db631b47B5F711Ca3a694f601Aa1108422c6E5'
// const cxUni_PoR	=	'0xEb3F14F6D3d8f541bA597dBB92A5bFF284a05D45'
// const fxADA_PoR = '0x0855428B493637726090003eD12Dd224715CA217'
const DAI_USD = '0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046'
const USDT = "0x55c18d10ded7968Cd980AbfE0547B410DF284413"
const DAI = "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F"
const DAITokenHolder = "0x75d46b9f6a8ff92da784be6a763050f848551483";
const USDTTokenHolder = "0xffeac40c46db67aad2f02a5fe0ae283c1cb257dd";
const exchangerPerson = "0xc6f0303df68cdab5fa5338a9706f51225fd728dd"
async function main() {
  // deploying the whole contract
  const tokenPrice = await ethers.getContractFactory("PriceConsumerV3");
  const feedPrice = await tokenPrice.deploy(DAI_USD);
  await feedPrice.deployed();
  // getting the chainlink feed price
  await feedPrice.getLatestPrice()
  console.log(await feedPrice.viewPrice());
 
  //deploying the dai token contract
  const DaiToken = await ethers.getContractAt("IERC20", DAI);

  const USDToken = await ethers.getContractAt("IERC20", USDT);

  console.log("DAI balance before:", await DaiToken.balanceOf(feedPrice.address))
  console.log("usdt balance before:", await USDToken.balanceOf(feedPrice.address))

  //setting dai token holder's balance so he can send tokens to my contract 

  await network.provider.send("hardhat_setBalance", [
    DAITokenHolder,
    "0x16345785D8A0000",
  ]);

   //impersonating a DAI account in order to get the account to be a liquidity pool for the contract
// @ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [DAITokenHolder], // address to impersonate
  });
  const signer1: Signer = await ethers.getSigner(DAITokenHolder);
  await DaiToken
    .connect(signer1)
    .transfer(
      feedPrice.address,
      "1820342231150"
  );
  console.log("DAI balance:", await DaiToken.balanceOf(feedPrice.address))
    //impersonating a USDT account in order to get the account to be a liquidity pool for the contract
// @ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [USDTTokenHolder], // address to impersonate
  });
  const signer2: Signer = await ethers.getSigner(USDTTokenHolder);
  await USDToken
    .connect(signer2)
    .transfer(
      feedPrice.address,
      "14200"
  );
  console.log("usdt balance:", await USDToken.balanceOf(feedPrice.address))
  console.log("Greeter deployed to:", feedPrice.address);

    //swapping from DAI to USDT
  console.log('person about to be impersonated')
  // @ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [exchangerPerson], // address to impersonate
  });
  const signer3: Signer = await ethers.getSigner(exchangerPerson)
  await USDToken.connect(signer3).approve(feedPrice.address,
    "100000000")
  console.log('person about to swap')
  await feedPrice.connect(signer3).checkTokens(USDT, DAI, 2)
  console.log("DAI balance after swap:", await DaiToken.balanceOf(feedPrice.address))
  console.log("usdt balance after swap:", await USDToken.balanceOf(feedPrice.address))

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
