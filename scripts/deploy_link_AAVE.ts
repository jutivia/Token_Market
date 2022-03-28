/* eslint-disable no-undef */
// import { Signer } from "ethers";
import { Signer } from "ethers";
import { ethers } from "hardhat";
// const AAVE_ETH	=	'0xbE23a3AA13038CfC28aFd0ECe4FdE379fE7fBfc4'
// const LINK_ETH	=	'0xb77fa460604b9C6435A235D057F7D319AC83cb53'
const Link = "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39";
const Aave = "0xd6df932a45c0f255f85145f286ea0b292b21c90b";
const LinkHolder = "0x22561c5931143536309c17e832587b625c390b9a";
const AAVEholder = "0x9b33dd59fa401374f9213d591d0319a9d7e9d2cb";
async function main() {
  // deploting the swapper contract
  const contract = await ethers.getContractFactory("LinkAAVE");
  const swappercontract = await contract.deploy();
  await swappercontract.deployed();

  // -------------getting the chainlink feed price-------------
  await swappercontract.getLatestPrices();
  console.log(await swappercontract.viewPrices());

  // creating instances of LINK and AAVE
  const LinkToken = await ethers.getContractAt("IERC20", Link);

  const AaveToken = await ethers.getContractAt("IERC20", Aave);

  // ------------- impersonating Link holder-------------
  // @ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [LinkHolder], // address to impersonate
  });
  const signer1: Signer = await ethers.getSigner(LinkHolder);
  // console.log(
  //   "Balance of Link holder before transferring to contract",
  //   await LinkToken.connect(signer1).balanceOf(LinkHolder)
  // );
  await LinkToken.connect(signer1).transfer(
    swappercontract.address,
    "1000000000000000000000"
  );
  // console.log(
  //   "Balance of Link holder after transferring to contract",
  //   await LinkToken.connect(signer1).balanceOf(LinkHolder)
  // );
  // console.log(
  //   "Balance of contract Link",
  //   await LinkToken.connect(signer1).balanceOf(swappercontract.address)
  // );
  // ------------- impersonating AAVE holder-------------
  // @ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [AAVEholder], // address to impersonate
  });
  const signer2: Signer = await ethers.getSigner(AAVEholder);
  // console.log(
  //   "Balance Of AAve holder before transferring to contract",
  //   await AaveToken.connect(signer1).balanceOf(AAVEholder)
  // );
  await AaveToken.connect(signer2).transfer(
    swappercontract.address,
    "1000000000000000000000"
  );
  // console.log(
  //   "Balance Of AAve holder after transferring to contract",
  //   await AaveToken.connect(signer1).balanceOf(AAVEholder)
  // );
  // console.log(
  //   "Balance of contract AAve",
  //   await AaveToken.connect(signer1).balanceOf(swappercontract.address)
  // );

  // -------------swapping Link To Aave-------------

  // -------------checking AAVE balance of link holder-------------
  // console.log(
  //   "AAVE Balance Of link holder before swapping",
  //   await AaveToken.connect(signer1).balanceOf(LinkHolder)
  // );

  // -------------checking AAVE balance of link holder-------------
  // console.log(
  //   "Link Balance Of AAVE holder before swapping",
  //   await LinkToken.connect(signer1).balanceOf(AAVEholder)
  // );

  // -------------Doing the swapping-------------
  await LinkToken.connect(signer1).approve(
    swappercontract.address,
    "100000000000000000000000000"
  );
  // console.log(
  //   "AAVE Balance Of link holder before swapping",
  //   await AaveToken.connect(signer1).balanceOf(LinkHolder)
  // );

  await swappercontract.connect(signer1).LinkToAAVE("25000000000000000000");

  // console.log(
  //   "AAVE Balance Of link holder after swapping",
  //   await AaveToken.connect(signer1).balanceOf(LinkHolder)
  // );
  // console.log(
  //   "Link Balance of Link holder after swapping",
  //   await LinkToken.connect(signer1).balanceOf(LinkHolder)
  // );
  // console.log(
  //   "AAVE Balance Of contract after swapping",
  //   await AaveToken.connect(signer1).balanceOf(swappercontract.address)
  // );
  // console.log(
  //   "Balance of contract LINK before swapping",
  //   await LinkToken.connect(signer1).balanceOf(swappercontract.address)
  // );

  // -------------swapping AAVE to LINK-------------
  await AaveToken.connect(signer2).approve(
    swappercontract.address,
    "100000000000000000000000000"
  );
  // console.log(
  //   "Link Balance Of AAVE holder before swapping",
  //   await LinkToken.connect(signer2).balanceOf(AAVEholder)
  // );
  // console.log(
  //   "AAVE Balance of AAVE holder before swapping",
  //   await AaveToken.connect(signer2).balanceOf(AAVEholder)
  // );
  // console.log(
  //   "Link Balance Of contract before swapping",
  //   await LinkToken.connect(signer2).balanceOf(swappercontract.address)
  // );

  await swappercontract.connect(signer2).AAveToLink("25000000000000000000");

  // console.log(
  //   "Link Balance Of AAVE holder after swapping",
  //   await LinkToken.connect(signer2).balanceOf(AAVEholder)
  // );
  // console.log(
  //   "AAVE Balance of AAVE holder after swapping",
  //   await AaveToken.connect(signer2).balanceOf(AAVEholder)
  // );
  // console.log(
  //   "Link Balance Of contract after swapping",
  //   await LinkToken.connect(signer2).balanceOf(swappercontract.address)
  // );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
