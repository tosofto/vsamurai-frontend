const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getWhitelistSignature } = require('./signer');

describe("vSamurai", async () => {
  let vSamuraiFactory, vSamurai;
  let accounts, contractOwner, userA, userB;
  let developerAddress, developerFee;
  let proxyRegistryAddress;
  let backendSigner;
  let baseURL;
  let maxBatchSize;
  let contractAddress;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    contractOwner = accounts[0];
    userA = accounts[1];
    userB = accounts[2];
    backendSigner = accounts[3];

    vSamuraiFactory = await ethers.getContractFactory("vSamurai");

    baseURL = 'ipfs://QmXCEv3rqNuaUDExMXLZNrkD41ZBYKsNjtH6SvBMBKH9zB/';
    maxBatchSize = 2;
    developerAddress = "0x9D7a3F970Bbc7aB9C8537dc9637051b824A9eD0C";
    developerFee = 10;
    proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";

    vSamurai = await vSamuraiFactory.deploy(baseURL, maxBatchSize, 5, developerAddress, developerFee, proxyRegistryAddress, contractOwner.address, backendSigner.address);

    await vSamurai.deployed();

    contractAddress = vSamurai.address;

  })

  it("Owner account should be able to call devMint", async () => {
    const quantity = 2;

    const res = await vSamurai.connect(contractOwner).devMint(userA.address, quantity);
    const supply = await vSamurai.connect(contractOwner).totalSupply();

    expect(supply).to.be.equal(quantity);
  })

  it("Owner account should be able to call devMint with even number", async () => {
    const quantity = 7;

    const res = await vSamurai.connect(contractOwner).devMint(userA.address, quantity);
    const supply = await vSamurai.connect(contractOwner).totalSupply();

    expect(supply).to.be.equal(quantity);
  })

  it("OwnerOf should attribute proper ownership of each nft", async () => { 
    await vSamurai.connect(contractOwner).devMint(userB.address, 1);  // ID 1
    await vSamurai.connect(contractOwner).devMint(userA.address, 10); // ID 2-11
    await vSamurai.connect(contractOwner).devMint(userB.address, 1);  // ID 12
    await vSamurai.connect(contractOwner).devMint(userA.address, 2);  // ID 13-14
    await vSamurai.connect(contractOwner).devMint(userB.address, 8);  // ID 15-23



    const ownerOfTokenOne = await vSamurai.ownerOf(1);
    const ownerOfTokenTwo = await vSamurai.ownerOf(2);
    const ownerOfTokenSeven = await vSamurai.ownerOf(7);
    const ownerOfTokenEleven = await vSamurai.ownerOf(11);
    const ownerOfTokenFourteen = await vSamurai.ownerOf(14);
    const ownerOfTokenTwenty = await vSamurai.ownerOf(20);

    expect(ownerOfTokenOne).to.be.equal(userB.address);
    expect(ownerOfTokenTwo).to.be.equal(userA.address);
    expect(ownerOfTokenSeven).to.be.equal(userA.address);
    expect(ownerOfTokenEleven).to.be.equal(userA.address);
    expect(ownerOfTokenFourteen).to.be.equal(userA.address);
    expect(ownerOfTokenTwenty).to.be.equal(userB.address);

    const supply = await vSamurai.totalSupply();

    expect(supply).to.be.equal(22);
  })

  it("Should return correct nft metadata url", async () => {
    const baseExpectedFullURI = "ipfs://QmXCEv3rqNuaUDExMXLZNrkD41ZBYKsNjtH6SvBMBKH9zB/";

    await vSamurai.connect(contractOwner).devMint(userA.address, 1);  // ID 1 
    let tokenURI = await vSamurai.tokenURI(1);
    expect(tokenURI).to.be.equal(baseExpectedFullURI + "1");

    await vSamurai.connect(contractOwner).devMint(userA.address, 1);  // ID 2
    tokenURI = await vSamurai.tokenURI(2);
    expect(tokenURI).to.be.equal(baseExpectedFullURI + "2");

    await vSamurai.connect(contractOwner).devMint(userA.address, 1);  // ID 3 
    tokenURI = await vSamurai.tokenURI(3);
    expect(tokenURI).to.be.equal(baseExpectedFullURI + "3");
  })

  it("Admin account shouldn't be able to mint after reaching max DEV_CLAIMS", async () => {
    const quantity = 400;

    await expect(
      vSamurai.connect(contractOwner).devMint(userA.address, quantity)
    ).to.be.revertedWith('Exceeds max claims');

  }),
  
  it("Admin should be able to switch sale state to active", async () => {
    await vSamurai.connect(contractOwner).flipSaleState();
    const saleState = await vSamurai.hasSaleStarted();
    expect(saleState).to.be.equal(true);
  }),

  it("Any account should be able to call public mint when sale is active", async () => {

    // 1. Open sale
    await vSamurai.connect(contractOwner).flipSaleState();
    
    // 2. Mint some tokens
    const quantity = 2;
    const price = 0.08;
    const value = ethers.utils.parseEther((quantity * price).toString());
    await vSamurai.connect(userB).publicSaleMint(quantity, { value });

    const supply = await vSamurai.totalSupply();

    expect(supply).to.be.equal(quantity);
  }),

  it("Should revert if public mint is called without enough ether", async () => {
    // 1. Turn it on
    await vSamurai.connect(contractOwner).flipSaleState();

    // 3. Mint as whitelisted user
    const quantity = 2;
    const price = 0.034;
    const value = ethers.utils.parseEther((quantity * price).toString());

    await expect(
      vSamurai.connect(userA).publicSaleMint(quantity, { value })
    ).to.be.revertedWith('Incorrect ether value');
  }),

  it("Should revert if public mint is called with exceeded quantity", async () => {
    // 1. Turn it on
    await vSamurai.connect(contractOwner).flipSaleState();

    // 3. Mint as whitelisted user
    const quantity = 3;
    const price = 0.08;
    const value = ethers.utils.parseEther((quantity * price).toString());

    await expect(
      vSamurai.connect(userA).publicSaleMint(quantity, { value })
    ).to.be.revertedWith('Exceeds max per tx');
  }),


  it("Admin should be able to switch sale state to off", async () => {
    // 1. Set open sale to true
    await vSamurai.connect(contractOwner).flipSaleState();
    // 2. Set open sale to false
    await vSamurai.connect(contractOwner).flipSaleState();
    const saleState = await vSamurai.hasSaleStarted();
    expect(saleState).to.be.equal(false);
  }),

  it("No account should be able to mint if sale is closed", async () => {
    
    // 1. Try to mint some tokens
    const quantity = 2;
    const price = 0.08;
    const value = ethers.utils.parseEther((quantity * price).toString());
    
    await expect(
      vSamurai.connect(userB).publicSaleMint(quantity, { value })
    ).to.be.revertedWith('Sale has not started');

  }),

  it("Admin should be able to switch sale prestate to active", async () => {
    await vSamurai.connect(contractOwner).flipPreSaleState();
    const preSaleState = await vSamurai.hasPreSaleStarted();
    expect(preSaleState).to.be.equal(true);
  }),

  it("Whitelisted account should be able to mint with withlist proof", async () => {
    // 1. Open presale as admin
    await vSamurai.connect(contractOwner).flipPreSaleState();

    // 2. Call presale with userA signature
    const chainId = 31337;
    const signature = await getWhitelistSignature(contractAddress, chainId, backendSigner, userA.address);

    // 3. Mint as whitelisted user
    const quantity = 2;
    const price = 0.08;
    const value = ethers.utils.parseEther((quantity * price).toString());
    await vSamurai.connect(userA).whitelistMint(signature, quantity, { value });

    const supply = await vSamurai.totalSupply();

    expect(supply).to.be.equal(quantity);
  }),

  it("Not whitelisted account shouldn't be able to mint", async () => {
    // 1. Open presale as admin
    await vSamurai.connect(contractOwner).flipPreSaleState();

    // 2. Call presale with userA signature
    const chainId = 31337;
    const signature = await getWhitelistSignature(contractAddress, chainId, backendSigner, userA.address);

    // 3. Mint as whitelisted user
    const quantity = 2;
    const price = 0.08;
    const value = ethers.utils.parseEther((quantity * price).toString());
    await expect(
      vSamurai.connect(userB).whitelistMint(signature, quantity, { value })
    ).to.be.revertedWith('Invalid Signature');
  }),

  it("Admin should be able to switch sale prestate to off", async () => {
    // 1. Turn it on
    await vSamurai.connect(contractOwner).flipPreSaleState();
    let preSaleState = await vSamurai.hasPreSaleStarted();
    expect(preSaleState).to.be.equal(true);
    // 2. Turn it off
    await vSamurai.connect(contractOwner).flipPreSaleState();
    preSaleState = await vSamurai.hasPreSaleStarted();
    expect(preSaleState).to.be.equal(false);
  }),

  it("Whitelisted account shouldn't be able to mint if presale is closed", async () => {
    // 1. Call presale with userA signature
    const chainId = 31337;
    const signature = await getWhitelistSignature(contractAddress, chainId, backendSigner, userA.address);

    // 2. Mint as whitelisted user
    const quantity = 2;
    const price = 0.08;
    const value = ethers.utils.parseEther((quantity * price).toString());

    await expect(
      vSamurai.connect(userA).whitelistMint(signature, quantity, { value })
    ).to.be.revertedWith('Presale has not started');
  })

  it("Should revert if public mint is called with exceeded quantity", async () => {
    // 1. Turn it on
    await vSamurai.connect(contractOwner).flipSaleState();

    // 2. Mint as whitelisted user
    const quantity = 3;
    const price = 0.08;
    const value = ethers.utils.parseEther((quantity * price).toString());

    await expect(
      vSamurai.connect(userA).publicSaleMint(quantity, { value })
    ).to.be.revertedWith('Exceeds max per tx');
  }),

  it("Should allow public mint to buy several in separated transactions", async () => {
    // 1. Turn it on
    await vSamurai.connect(contractOwner).flipSaleState();

    // 2. Mint as a user
    const quantity = 2;
    const price = 0.08;
    const value = ethers.utils.parseEther((quantity * price).toString());
    let iterations = 6;
    for (let i = 0; i< iterations; i++) {
      await vSamurai.connect(userA).publicSaleMint(quantity, { value })
    }

    const supply = await vSamurai.totalSupply();

    expect(supply).to.be.equal(iterations * quantity);
  }),

  it("Should revert if public mint is called with exceeded quantity", async () => {
    // 1. Turn it on
    await vSamurai.connect(contractOwner).flipPreSaleState();

    // 2. Call presale with userA signature
    const chainId = 31337;
    const signature = await getWhitelistSignature(contractAddress, chainId, backendSigner, userA.address);

    // 3. Mint as whitelisted user
    const quantity = 3;
    const price = 0.08;
    const value = ethers.utils.parseEther((quantity * price).toString());

    await expect(
      vSamurai.connect(userA).whitelistMint(signature, quantity, { value })
    ).to.be.revertedWith('Exceeds max per tx');
  }),

  it("Whitelisted account shouldn't be able to mint if it doesn't provide enough ether", async () => {
    // 1. Turn it on
    await vSamurai.connect(contractOwner).flipPreSaleState();
    // 2. Call presale with userA signature
    const chainId = 31337;
    const signature = await getWhitelistSignature(contractAddress, chainId, backendSigner, userA.address);

    // 3. Mint as whitelisted user
    const quantity = 2;
    const price = 0.01;
    const value = ethers.utils.parseEther((quantity * price).toString());

    await expect(
      vSamurai.connect(userA).whitelistMint(signature, quantity, { value })
    ).to.be.revertedWith('Incorrect ether value');
  })

  it("Whitelisted account shouldn't be able to mint more than allowed", async () => {
    // 1. Turn it on
    await vSamurai.connect(contractOwner).flipPreSaleState();
    // 2. Call presale with userA signature
    const chainId = 31337;
    const signature = await getWhitelistSignature(contractAddress, chainId, backendSigner, userA.address);

    // 3. Mint as whitelisted user
    const quantity = 2;
    const price = 0.08;
    const value = ethers.utils.parseEther((quantity * price).toString());

    await vSamurai.connect(userA).whitelistMint(signature, quantity, { value })

    await expect(
      vSamurai.connect(userA).whitelistMint(signature, quantity, { value })
    ).to.be.revertedWith("Exceeds whitelist supply");
  })
});