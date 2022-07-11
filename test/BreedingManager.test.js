const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getBreedingManagerSignature } = require('./signer')


describe("BreedingManager", async () => {
    
    let vSamuraiMockFactory, _vsamurai
    let BreedingManagerFactory, BreedingManager
    let EDOTokenFactory, EDOToken, EDOTokenAddress
    let accounts, contractOwner
    let backendSigner
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        contractOwner = accounts[0]
        userA = accounts[1]
        userB = accounts[2]
        backendSigner = accounts[3] 
       /*  _newOwner = contractOwner */ //force not changing owner
        vSamuraiMockFactory = await ethers.getContractFactory("vSamuraiMock");
        _vsamurai = await vSamuraiMockFactory.deploy();
        await _vsamurai.deployed()

        BreedingManagerFactory = await ethers.getContractFactory("BreedingManager")
        BreedingManager = await BreedingManagerFactory.deploy(_vsamurai.address, contractOwner.address, backendSigner.address)
        await BreedingManager.deployed()
        EDOTokenFactory = await ethers.getContractFactory("EDOToken")
        EDOToken = await EDOTokenFactory.deploy(_vsamurai.address, contractOwner.address, backendSigner.address)
        EDOTokenAddress = EDOToken.address
        
    })

    it("Cannot register gender (bad signature)", async () => {
        let _tokenId = 233
        let _gender = 1 //male
        const chainId = 31337;
        await _vsamurai.connect(contractOwner).transfer(EDOTokenAddress, _vsamurai.address, userA.address, _tokenId)
        const incorrectSigner = userB
        const signature = await getBreedingManagerSignature(BreedingManager.address, chainId, incorrectSigner, userA.address, _gender, _tokenId)
    
        await expect(BreedingManager.connect(userA).registerGender(signature, _tokenId, _gender)).to.be.revertedWith('Invalid Signature');
    })

    it("Can register gender with correct signature", async () => {
        let _tokenId = 233 //random NFT selected
        let _gender = 1 //male
        const chainId = 31337;
        await _vsamurai.connect(contractOwner).transfer(EDOTokenAddress, _vsamurai.address, userA.address, _tokenId)

        const signature = await getBreedingManagerSignature(BreedingManager.address, chainId, backendSigner, userA.address, _gender, _tokenId)
    
        await BreedingManager.connect(userA).registerGender(signature, _tokenId, _gender)
    })


    it("Can breed", async () => {
        let _tokenId = 233 //random NFT selected
        let _tokenId2 = 9 //random NFT selected
        let _gender = 1 //male
        let _gender2 = 2 //female
        const chainId = 31337;
        await _vsamurai.connect(contractOwner).transfer(EDOTokenAddress, _vsamurai.address, userA.address, _tokenId)
        await _vsamurai.connect(contractOwner).transfer(EDOTokenAddress, _vsamurai.address, userA.address, _tokenId2)

        const signatureForTokenId = await getBreedingManagerSignature(BreedingManager.address, chainId, backendSigner, userA.address, _gender, _tokenId)
        const signatureForTokenId2 = await getBreedingManagerSignature(BreedingManager.address, chainId, backendSigner, userA.address, _gender2, _tokenId2)
        await BreedingManager.connect(userA).registerGender(signatureForTokenId, _tokenId, _gender)
        await BreedingManager.connect(userA).registerGender(signatureForTokenId2, _tokenId2, _gender2)

        const breedingResult = await BreedingManager.connect(userA).breed(_tokenId, _tokenId2)
        expect(breedingResult).to.be.true
    }) 

    it("Cannot breed (two males)", async () => {
        let _tokenId = 233 //random NFT selected
        let _tokenId2 = 9 //random NFT selected
        let _gender = 1 //male
        let _gender2 = 1 //male
        const chainId = 31337;
        await _vsamurai.connect(contractOwner).transfer(EDOTokenAddress, _vsamurai.address, userA.address, _tokenId)
        await _vsamurai.connect(contractOwner).transfer(EDOTokenAddress, _vsamurai.address, userA.address, _tokenId2)

        const signatureForTokenId = await getBreedingManagerSignature(BreedingManager.address, chainId, backendSigner, userA.address, _gender, _tokenId)
        const signatureForTokenId2 = await getBreedingManagerSignature(BreedingManager.address, chainId, backendSigner, userA.address, _gender2, _tokenId2)
        await BreedingManager.connect(userA).registerGender(signatureForTokenId, _tokenId, _gender)
        await BreedingManager.connect(userA).registerGender(signatureForTokenId2, _tokenId2, _gender2)

        await expect(BreedingManager.connect(userA).breed(_tokenId, _tokenId2)).to.be.revertedWith('NFT is not female')
    })

    it("Cannot breed (two females)", async () => {
        let _tokenId = 233 //random NFT selected
        let _tokenId2 = 9 //random NFT selected
        let _gender = 2 //female
        let _gender2 = 2 //female
        const chainId = 31337;
        await _vsamurai.connect(contractOwner).transfer(EDOTokenAddress, _vsamurai.address, userA.address, _tokenId)
        await _vsamurai.connect(contractOwner).transfer(EDOTokenAddress, _vsamurai.address, userA.address, _tokenId2)

        const signatureForTokenId = await getBreedingManagerSignature(BreedingManager.address, chainId, backendSigner, userA.address, _gender, _tokenId)
        const signatureForTokenId2 = await getBreedingManagerSignature(BreedingManager.address, chainId, backendSigner, userA.address, _gender2, _tokenId2)
        await BreedingManager.connect(userA).registerGender(signatureForTokenId, _tokenId, _gender)
        await BreedingManager.connect(userA).registerGender(signatureForTokenId2, _tokenId2, _gender2)

        await expect(BreedingManager.connect(userA).breed(_tokenId, _tokenId2)).to.be.revertedWith('NFT is not male')
    })
})