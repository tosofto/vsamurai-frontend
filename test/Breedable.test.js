const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Breedable", async () => {
    
    let vSamuraiMockFactory, _vsamurai
    let BreedingManagerFactory, BreedingManager
    let yieldTokenMockFactory, _yieldToken
    let BreedManagerMockFactory, _breedManager
    let EDOTokenFactory, EDOToken, EDOTokenAddress
    let BreedableMockFactory, _breedable
    let accounts, contractOwner
    let backendSigner
   
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        contractOwner = accounts[0]
        userA = accounts[1]
        userB = accounts[2]
        backendSigner = accounts[3] 
        vSamuraiMockFactory = await ethers.getContractFactory("vSamuraiMock");
        _vsamurai = await vSamuraiMockFactory.deploy();
        await _vsamurai.deployed()

        BreedingManagerFactory = await ethers.getContractFactory("BreedingManager")
        BreedingManager = await BreedingManagerFactory.deploy(_vsamurai.address, contractOwner.address, backendSigner.address)
        await BreedingManager.deployed()

        BreedableMockFactory = await ethers.getContractFactory("BreedableMock")
        _breedable = await BreedableMockFactory.deploy()
        await _breedable.deployed()

        EDOTokenFactory = await ethers.getContractFactory("EDOToken")

        EDOToken = await EDOTokenFactory.deploy(_vsamurai.address, contractOwner.address, backendSigner.address)
        EDOTokenAddress = EDOToken.address
        
    })

    it("Breeding generates new NFT", async () => {

        BreedManagerMockFactory = await ethers.getContractFactory("BreedManagerMock")
        _breedManager = await BreedManagerMockFactory.deploy()
        const _breedManagerAddress = _breedManager.address 
        await _breedable.setBreedingManagerTest(_breedManagerAddress)


        yieldTokenMockFactory = await ethers.getContractFactory("yieldTokenMock")
        _yieldToken = await yieldTokenMockFactory.deploy()
        await _breedable.setTokenAddress(_yieldToken.address)
       
        let _tokenId = 233 //random NFT selected
        let _tokenId2 = 9 //random NFT selected

        await _breedable.testBreed(_tokenId, _tokenId2)
       
    })
    
    it("Set breedingManager address", async () => {
        await _breedable.setBreedingManagerTest(userA.address)
        expect(await _breedable.breedManager()).to.be.equal(userA.address);
    })

    it("Set breeding price", async () => {
        let breedPrice = 50
        await _breedable.setBreedPriceTest(breedPrice)
      expect(await _breedable.BREED_PRICE()).to.be.equal(breedPrice)
    })

   it("Flip breeding active", async() => {
    const initialState = await _breedable.BREEDING_ACTIVE()
    await _breedable.flipBreedingActiveTest()
    const finalState = await _breedable.BREEDING_ACTIVE()
    expect(initialState).not.equal(finalState)
   })
})