const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getWhitelistSignature } = require('./signer');

describe("Whitelistable", async () => {
  let WhitelistableMockFactory, WhitelistableMock;
  let accounts, contractOwner, userA, userB, signer;
  let contractAddress;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    contractOwner = accounts[0];
    signer = accounts[1];
    userA = accounts[2];
    userB = accounts[3];

    WhitelistableMockFactory = await ethers.getContractFactory("WhitelistableMock");

    WhitelistableMock = await WhitelistableMockFactory.deploy(signer.address);

    await WhitelistableMock.deployed();

    contractAddress = WhitelistableMock.address;
  })

  it("Shoudln't allow calls with invalid signature", async () => {

    const signature = '0x4489782e91f0caecf88af512efad5f4fca08150e728e5807e0a99f5502b3c05541d76928dc6864e45de5fb2e84256c48a7ad6f0ff6b5575296f7a549959383371b';

    await expect(
      WhitelistableMock.connect(userA).increment(signature)
    ).to.be.revertedWith('ECDSA: invalid signature');
  })

  it("Should allow calls with valid signature", async () => {
    const chainId = 31337;
    const signature = await getWhitelistSignature(contractAddress, chainId, signer, userA.address);

    await WhitelistableMock.connect(userA).increment(signature);
    const xValue = await WhitelistableMock.connect(userA).x();
    expect(xValue).to.be.equal(1);
  })

  it("Shouldn't allow calls with valid signature but invalid sender (Replay Attack)", async () => {

    const chainId = 31337;

    // We know that this yields a valid signature for userA bc of previous test
    const signature = await getWhitelistSignature(contractAddress, chainId, signer, userA.address);

    // But we call the contract from userB
    await expect(
      WhitelistableMock.connect(userB).increment(signature)
    ).to.be.revertedWith('Invalid Signature');
  })

});