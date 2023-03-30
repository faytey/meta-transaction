import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  const SwapperContract = require("../deploy.json").Swapper;

  const TokenA = "0x0d79df66BE487753B02D015Fb622DED7f0E9798d"; //Dai
  const TokenB = "0x48731cF7e84dc94C5f84577882c14Be11a5B7456"; //Link
  const DAIcontract = "0x65a5ba240CBd7fD75700836b683ba95EBb2F32bd";
  const LINKcontract = "0xA0Fe6077A4994eedd3e1d0358A1afcDb9fcF3A6b";
  const TokenAAggr = await ethers.getContractAt(
    "AggregatorV3Interface",
    TokenA
  );
  const TokenBAggr = await ethers.getContractAt(
    "AggregatorV3Interface",
    TokenB
  );
  const TokenAerc = await ethers.getContractAt("IToken", DAIcontract);
  const TokenBerc = await ethers.getContractAt("IToken", LINKcontract);
  const Swapper = await ethers.getContractAt("ISwap", SwapperContract);
  const DaiFeed = await Swapper.daiToLink().toString();
  const LinkFeed = await (await Swapper.linkToDai()).toString();
  const name = await TokenAAggr.description();
  const name2 = await TokenBAggr.description();

  console.log(`Price of dai to link is currently $${await DaiFeed}`);
  console.log(`Price of link to dai is currently $${await LinkFeed}`);

  // const impersonatedSigner = await ethers.getImpersonatedSigner("0xe8fFEddEf81eF467B9566Ec1BF57Da9Dde2aa6f5");

  const helpers = require("@nomicfoundation/hardhat-network-helpers");
  const helpers1 = require("@nomicfoundation/hardhat-network-helpers");

  const addressName = "0xaC72905626c913a3225b233aFd3fAD382a7e5eFa";
  await helpers.impersonateAccount(addressName);
  const impersonatedSigner = await ethers.getSigner(addressName);

  const address2 = "0x61E5E1ea8fF9Dc840e0A549c752FA7BDe9224e99";
  await helpers1.impersonateAccount(address2);
  const impersonatedSigner2 = await ethers.getSigner(address2);
  // await impersonatedSigner.sendTransaction(...);

  const balanceA = await TokenAerc.balanceOf(addressName);
  console.log(`Person A Balance of Dai before swap is ${balanceA}`);

  const balanceAA = await TokenBerc.balanceOf(addressName);
  console.log(`Person A Balance of Link before swap is ${balanceAA}`);

  await helpers1.setBalance(address2, 1000000000000000000);
  const balanceB = await TokenAerc.balanceOf(address2);
  console.log(`Person B Balance of Dai before swap is ${balanceB}`);
  const balance1 = await TokenBerc.balanceOf(address2);
  console.log(`Person B Balance of Link before swap is ${balance1}`);

  await TokenAerc.connect(impersonatedSigner).approve(
    swap.address,
    ethers.utils.parseEther("1000")
  );
  // const allowance = await TokenAerc.connect(impersonatedSigner).allowance(addressName, swap.address);
  await TokenBerc.connect(impersonatedSigner2).approve(
    swap.address,
    ethers.utils.parseEther("100")
  );
  const amount = ethers.utils.parseEther("50");
  await TokenAerc.connect(impersonatedSigner).transfer(swap.address, amount);
  await TokenBerc.connect(impersonatedSigner2).transfer(swap.address, amount);

  // await TokenBerc.connect(impersonatedSigner2).transferFrom(impersonatedSigner2.address, swap.address, ethers.utils.parseEther("50"));
  // console.log(`allowance information is ${allowance}`);
  console.log(
    `Contract balance of Dai is ${await TokenAerc.balanceOf(swap.address)}`
  );
  console.log(
    `Contract balance of Addex is ${await TokenBerc.balanceOf(swap.address)}`
  );

  const swapTokens = await swap.connect(impersonatedSigner).swapDaiToLink(100);
  const swapToken1 = await swap.connect(impersonatedSigner2).swapLinkToDai(200);

  const balance = await TokenAerc.balanceOf(addressName);
  console.log(`Person A Balance of Dai after swap is ${balance}`);

  const balanceA1 = await TokenBerc.balanceOf(addressName);
  console.log(`Person A Balance of Link after swap is ${balanceA1}`);

  const balanceB1 = await TokenAerc.balanceOf(address2);
  console.log(`Person B Balance of Dai after swap is ${balanceB1}`);

  const balance1B = await TokenBerc.balanceOf(address2);
  console.log(`Person B Balance of Link after swap is ${balance1B}`);

  console.log(
    `Contract balance of Dai after is ${await TokenAerc.balanceOf(
      swap.address
    )}`
  );
  console.log(
    `Contract balance of Addex after is ${await TokenBerc.balanceOf(
      swap.address
    )}`
  );
}

// 1,415,003,016,891,437,636
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
