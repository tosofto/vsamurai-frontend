 const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { getRarityRegistrationSignature } = require('./signer');

async function waitForADay(network) {
  const dayInSeconds = 86400;
  const numOfDays = 1;
  await network.provider.send("evm_increaseTime", [dayInSeconds * numOfDays]);
  await network.provider.send("evm_mine");
}

describe("EDO Token", async () => {
  let EDOTokenFactory, EDOToken;
  let vSamuraiMockFactory, _vsamurai;
  let accounts, contractOwner, userA, userB;
  let backendSigner, contractAddress;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    contractOwner = accounts[0];
    userA = accounts[1];
    userB = accounts[2];
    backendSigner = accounts[3];

    const vSamuraiMockFactory = await ethers.getContractFactory("vSamuraiMock");
    _vsamurai = await vSamuraiMockFactory.deploy();
    await _vsamurai.deployed();

    EDOTokenFactory = await ethers.getContractFactory("EDOToken");
    
    EDOToken = await EDOTokenFactory.deploy(_vsamurai.address, contractOwner.address, backendSigner.address);

    await EDOToken.deployed();

    contractAddress = EDOToken.address;
  })

  it("Should set token rates if called by admin", async () => {
    let _common = 0;
    let _rare = 5;
    let _legendary = 10;
    let _god = 20;
    await EDOToken.connect(contractOwner).setTokenRates(_common, _rare, _legendary, _god);
    const tokenRates = await EDOToken.tokenRates();
    expect(tokenRates.common).to.be.equal(_common);
    expect(tokenRates.rare).to.be.equal(_rare);
    expect(tokenRates.legendary).to.be.equal(_legendary);
    expect(tokenRates.god).to.be.equal(_god);
  });

  it("Shouldn't set token rates if not called by admin", async () => {
    let _common = 0;
    let _rare = 5;
    let _legendary = 10;
    let _god = 20;
    await expect(
      EDOToken.connect(userA).setTokenRates(_common, _rare, _legendary, _god)
    ).to.be.reverted;
  });
  it("Should return token rates for a given nft id", async () => {
    const tokenRates = await EDOToken.tokenRates()
    let tokenId = 1994;
    let rarity = 2;

    await EDOToken.connect(contractOwner).adminRarityRegistration(tokenId, rarity);

    expect(
      await EDOToken.rarities(tokenId)
    ).to.be.equal(rarity);
    expect(
      await EDOToken.getTokenRates(tokenId)
    ).to.be.equal(
      tokenRates.rare
    )
  });
  it("Should set signing address if called by admin", async () => {
    await EDOToken.connect(contractOwner).setSigningAddress(userA.address);
    expect(
      await EDOToken.signingKey()
    ).to.be.equal(userA.address);
  });
  it("Shouldn't set signing address if not called by admin", async () => {
    await expect(
      EDOToken.connect(userB).setSigningAddress(userA.address)
    ).to.be.reverted;
  });
  it("Should set NFT contract address if called by admin", async () => {
    await EDOToken.connect(contractOwner).setNFTContract(userA.address);
    expect(
      await EDOToken.vSamuraiContract()
    ).to.be.equal(userA.address);
  });
  it("Shouldn't set NFT contract address if not called by admin", async () => {
    await expect(
      EDOToken.connect(userB).setNFTContract(userA.address)
    ).to.be.reverted;
  });
  it("Should register an NFT for rewards given an nft id and rarity id with a valid signature", async () => {
    const tokenRates = await EDOToken.tokenRates()
    let tokenId = 3737;
    let rarity = 4;
    const chainId = 31337;

    const signature = await getRarityRegistrationSignature(contractAddress, chainId, backendSigner, userA.address, rarity, tokenId);

    await EDOToken.connect(userA).registerForRewards(signature, tokenId, rarity);

    expect(await EDOToken.rarities(tokenId)).to.be.equal(rarity);

    expect(await EDOToken.getTokenRates(tokenId)).to.be.equal(tokenRates.god);

  });
  it("Shouldn't register an NFT for rewards if signature is valid but called from other account (replay attack)", async () => {
    let tokenId = 3737;
    let rarity = 4;
    const chainId = 31337;

    const signature = await getRarityRegistrationSignature(contractAddress, chainId, backendSigner, userA.address, rarity, tokenId);

    await expect(
      EDOToken.connect(userB).registerForRewards(signature, tokenId, rarity)
    ).to.be.revertedWith('Invalid Signature');
    
  });
  it('Should return total claimable for a given NFT and user wallet', async () => {
    const tokenRates = await EDOToken.tokenRates()
    // 1. Register NFT for rewards
    
    let tokenId = 3737;
    let rarity = 4;
    const chainId = 31337;
    const signature = await getRarityRegistrationSignature(contractAddress, chainId, backendSigner, userA.address, rarity, tokenId);
    await EDOToken.connect(userA).registerForRewards(signature, tokenId, rarity);
    await _vsamurai.setOwner(userA.address, tokenId)
    
    // 2. Assert total claimable to be equal the initial issuance
    const INITIAL_ISSUANCE = await EDOToken.INITIAL_ISSUANCE();
    let result = await EDOToken.getTotalClaimable(userA.address, tokenId);
    expect(result).to.be.at.least(INITIAL_ISSUANCE);

    // 3. Wait 1 day and assert total claimable to be equal INITIAL ASSUANCE + NFT Rate * 1 day
    let dayInSeconds = 86400;
    let numOfDays = 1;
    // These instructions increase the block timestamp in 1 day
    await network.provider.send("evm_increaseTime", [dayInSeconds * numOfDays]);
    await network.provider.send("evm_mine");
    result = await EDOToken.getTotalClaimable(userA.address, tokenId);
    expect(result).to.be.at.least(tokenRates.god.mul(numOfDays).add(INITIAL_ISSUANCE));

    // 4. Wait a random amount of days and assert 
    numOfDays += Math.ceil(Math.random() * 100);
    await network.provider.send("evm_increaseTime", [dayInSeconds * (numOfDays - 1)]);
    await network.provider.send("evm_mine");
    result = await EDOToken.getTotalClaimable(userA.address, tokenId);
    expect(result).to.be.at.least(tokenRates.god.mul(numOfDays).add(INITIAL_ISSUANCE));
  });
  it('Should be able to claim rewards when calling from vSamurai NFT contract', async () => {
    const tokenRates = await EDOToken.tokenRates()
    const INITIAL_ISSUANCE = await EDOToken.INITIAL_ISSUANCE();
    // 1. Register NFT for rewards
    let tokenId = 3737;
    let rarity = 4;
    const chainId = 31337;
    // Set ownership of 3737 to userA
    await _vsamurai.setOwner(userA.address, 3737)

    const signature = await getRarityRegistrationSignature(contractAddress, chainId, backendSigner, userA.address, rarity, tokenId);
    await EDOToken.connect(userA).registerForRewards(signature, tokenId, rarity);

    // 2. Claim rewards and assert events
    const claimable = await EDOToken.getTotalClaimable(userA.address, tokenId);
    await expect(
      EDOToken.connect(userA).claimRewards(tokenId)
    )
    .to
    .emit(EDOToken, "RewardClaimed")
    .to
    .emit(EDOToken, "Transfer")
    // .withArgs(userA.address, claimable)

    expect(
      await EDOToken.balanceOf(userA.address)
    ).to.be.at.least(claimable);

    // 3. Wait 1 day and assert total claimable to be equal INITIAL ASSUANCE + NFT Rate * 1 day
    let dayInSeconds = 86400;
    let numOfDays = 1;
    // These instructions increase the block timestamp in 1 day
    await network.provider.send("evm_increaseTime", [dayInSeconds * numOfDays]);
    await network.provider.send("evm_mine");
    result = await EDOToken.getTotalClaimable(userA.address, tokenId);
    expect(result).to.be.at.least(
      tokenRates.god.mul(numOfDays)
    );
    await EDOToken.connect(userA).claimRewards(tokenId)
    expect(
      await EDOToken.balanceOf(userA.address)
    ).to.be.at.least(
      tokenRates.god.mul(numOfDays).add(INITIAL_ISSUANCE)
    );

  })

  it('Should update the rewards when interacting with the contract from vSamurai NFT contract', async () => {
    const tokenRates = await EDOToken.tokenRates()
    const INITIAL_ISSUANCE = await EDOToken.INITIAL_ISSUANCE();
    // 1. Register NFT for rewards for user A
    let tokenId = 3737;
    let rarity = 4;
    const chainId = 31337;
    await _vsamurai.setOwner(userA.address, 3737)
    const signature = await getRarityRegistrationSignature(contractAddress, chainId, backendSigner, userA.address, rarity, tokenId);
    // Pause automining
    await ethers.provider.send("evm_setAutomine", [false]);
    await EDOToken.connect(userA).registerForRewards(signature, tokenId, rarity);
    // 2. Claim rewards for user A
    await EDOToken.connect(userA).claimRewards(tokenId)
    // 3. Transfer NFT to user B
    await _vsamurai.transfer(EDOToken.address, userA.address, userB.address, tokenId);
    await ethers.provider.send("evm_mine", []);
    await ethers.provider.send("evm_setAutomine", [true]);

    // 4. Wait for a day
    await waitForADay(network);

    // 5. Assert:
    //   a. user B has claimable tokens for 1 day * token rates
    //   b. user A doens't have tokens to claim
    let claimableA = await EDOToken.getTotalClaimable(userA.address, tokenId);
    let claimableB = await EDOToken.getTotalClaimable(userB.address, tokenId);

    expect(claimableA).to.be.equal(0);
    expect(claimableB).to.be.equal(tokenRates.god.mul(1));
    // Claim userB tokens

    await ethers.provider.send("evm_setAutomine", [false]);
    await EDOToken.connect(userB).claimRewards(tokenId)
    // 6. Transfer nft back to user A
    await _vsamurai.transfer(EDOToken.address, userB.address, userA.address, tokenId);
    await ethers.provider.send("evm_mine", []);
    await ethers.provider.send("evm_setAutomine", [true]);

    // 7. Wait for a day
    await waitForADay(network);

    // 8. Assert: 
    //   a. User A only has token to claim for 1 day.
    //   b. User B doesn't have tokens to claim
    claimableA = await EDOToken.getTotalClaimable(userA.address, tokenId);
    claimableB = await EDOToken.getTotalClaimable(userB.address, tokenId);

    expect(claimableA).to.be.equal(tokenRates.god.mul(1));
    expect(claimableB).to.be.equal(0);

  })
  it('Should burn tokens when called from NFT contract', async () => {
    const tokenRates = await EDOToken.tokenRates()
    const INITIAL_ISSUANCE = await EDOToken.INITIAL_ISSUANCE();
    // 1. Register NFT for rewards
    let tokenId = 3737;
    let rarity = 4;
    const chainId = 31337;
    await _vsamurai.setOwner(userA.address, 3737)
    const signature = await getRarityRegistrationSignature(contractAddress, chainId, backendSigner, userA.address, rarity, tokenId);
    await EDOToken.connect(userA).registerForRewards(signature, tokenId, rarity);

    // 2. Wait 1 day and assert total claimable to be equal INITIAL ASSUANCE + NFT Rate * 1 day
    let dayInSeconds = 86400;
    let numOfDays = 1;
    // These instructions increase the block timestamp in 1 day
    await network.provider.send("evm_increaseTime", [dayInSeconds * numOfDays]);
    await network.provider.send("evm_mine");
    // 2a. Claim rewards
    await EDOToken.connect(userA).claimRewards(tokenId)

    // 3. Burn tokens and assert balances
    const balance = await EDOToken.balanceOf(userA.address);
    expect(
      balance
    ).to.be.at.least(
      tokenRates.god.mul(numOfDays).add(INITIAL_ISSUANCE)
    );
    await _vsamurai.doBurnsEDO(userA.address, balance, EDOToken.address)
    expect(
      await EDOToken.balanceOf(userA.address)
    ).to.be.equal(0);
  })
  it("Should register any NFT for rewards given an nft id and rarity id if called by admin", async () => {
    const tokenRates = await EDOToken.tokenRates()
    let tokenId = 3737;
    let rarity = 4;

    await EDOToken.connect(contractOwner).adminRarityRegistration(tokenId, rarity);

    expect(
      await EDOToken.rarities(tokenId)
    ).to.be.equal(rarity);
    expect(
      await EDOToken.getTokenRates(tokenId)
    ).to.be.equal(
      tokenRates.god
    )
    tokenId = 1234;
    rarity = 2;
    await EDOToken.connect(contractOwner).adminRarityRegistration(tokenId, rarity);

    expect(
      await EDOToken.rarities(tokenId)
    ).to.be.equal(rarity);
    expect(
      await EDOToken.getTokenRates(tokenId)
    ).to.be.equal(
      tokenRates.rare
    )

    tokenId = 1337;
    rarity = 3;
    await EDOToken.connect(contractOwner).adminRarityRegistration(tokenId, rarity);

    expect(
      await EDOToken.rarities(tokenId)
    ).to.be.equal(rarity);
    expect(
      await EDOToken.getTokenRates(tokenId)
    ).to.be.equal(
      tokenRates.legendary
    )

    tokenId = 420;
    rarity = 0;
    await EDOToken.connect(contractOwner).adminRarityRegistration(tokenId, rarity);
    expect(
      await EDOToken.rarities(tokenId)
    ).to.be.equal(rarity);
    expect(
      await EDOToken.getTokenRates(tokenId)
    ).to.be.equal(
      0
    )

    tokenId = 61;
    rarity = 1;
    await EDOToken.connect(contractOwner).adminRarityRegistration(tokenId, rarity);
    expect(
      await EDOToken.rarities(tokenId)
    ).to.be.equal(rarity);
    expect(
      await EDOToken.getTokenRates(tokenId)
    ).to.be.equal(
      tokenRates.common
    )

    tokenId = 666;
    rarity = 1111112;
    await EDOToken.connect(contractOwner).adminRarityRegistration(tokenId, rarity);
    expect(
      await EDOToken.rarities(tokenId)
    ).to.be.equal(rarity);
    expect(
      await EDOToken.getTokenRates(tokenId)
    ).to.be.equal(
      0
    )
  });
});