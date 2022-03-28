/* eslint-disable no-undef */
import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { IERC20, LinkAAVE } from "../typechain";
const Link = "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39";
const Aave = "0xd6df932a45c0f255f85145f286ea0b292b21c90b";
const LinkHolder = "0x22561c5931143536309c17e832587b625c390b9a";
const AAVEholder = "0x9b33dd59fa401374f9213d591d0319a9d7e9d2cb";
let swapper: LinkAAVE;
let linkContract: IERC20;
let AaveContract: IERC20;
let signer1: Signer;
let signer2: Signer;
describe("Testing the swapper contract", function () {
  this.beforeEach(async () => {
    // -------------deploy Swapper contract-------------
    const a = await ethers.getContractFactory("LinkAAVE");
    swapper = await a.deploy();
    await swapper.deployed();

    // -------------Instance of Link -------------
    linkContract = await ethers.getContractAt("IERC20", Link);

    // -------------Instance of AAVE -------------
    AaveContract = await ethers.getContractAt("IERC20", Aave);

    // ------------- impersonating Link holder-------------
    // @ts-ignore
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [LinkHolder], // address to impersonate
    });
    signer1 = await ethers.getSigner(LinkHolder);

    // ------------- transfering some LINK to swapper contract-------------
    await linkContract
      .connect(signer1)
      .transfer(swapper.address, "100000000000000000000");

    // ------------- impersonating AAVE holder-------------
    // @ts-ignore
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [AAVEholder], // address to impersonate
    });
    signer2 = await ethers.getSigner(AAVEholder);

    // ------------- transfering some AAVE to swapper contract-------------
    await AaveContract.connect(signer2).transfer(
      swapper.address,
      "100000000000000000000"
    );
    await swapper.getLatestPrices();
  });
  it("Swapper Contract balance should be the same as the amount transfered into", async function () {
    expect(await AaveContract.balanceOf(swapper.address)).to.equal(
      "100000000000000000000"
    );
    expect(await linkContract.balanceOf(swapper.address)).to.equal(
      "100000000000000000000"
    );
  });

  it("should successfully swap LINK Tokens to AAVE", async function () {
    const balanceBefore = await linkContract
      .connect(signer1)
      .balanceOf(LinkHolder);

    await linkContract
      .connect(signer1)
      .approve(swapper.address, "100000000000000000000000000");

    await swapper.connect(signer1).LinkToAAVE("250000000000000000");
    const AAVEBalance = await AaveContract.connect(signer1).balanceOf(
      LinkHolder
    );
    expect(Number(AAVEBalance.toString())).to.greaterThan(250000000000000000);

    const balanceAfter = await linkContract
      .connect(signer1)
      .balanceOf(LinkHolder);
    expect(Number(balanceAfter.toString())).to.equal(
      Number(balanceBefore.toString()) - 250000000000000000
    );
  });

  it("should successfully swap AAVE Tokens to LINK", async function () {
    await AaveContract.connect(signer2).approve(
      swapper.address,
      "100000000000000000000000000"
    );

    await swapper.connect(signer2).AAveToLink("250000000000000000");
    const LinkBalance = await linkContract.balanceOf(AAVEholder);
    expect(Number(LinkBalance.toString())).to.lessThan(250000000000000000);
  });
});
