const { expect } = require("chai");

describe("Smart Wallet", function () {
  let smartWallet;
  let owner;
  let owner1;
  let owner2;

  before(async function () {
    [owner, owner1, owner2] = await ethers.getSigners();
    const SmartWallet = await ethers.getContractFactory("SmartWallet");
    const owners = [owner.address, owner1.address, owner2.address];
    smartWallet = await SmartWallet.deploy(owners, 3);
    await smartWallet.deployed();
  });
});
