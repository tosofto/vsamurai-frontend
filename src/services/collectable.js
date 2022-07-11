import Collectable from '../../build/contracts/vSamurai.sol/vSamurai.json';
import wallet from './wallet';

import NetworkService from './network';

const CollectableContractABI = {
  async getContractInstance() {
    try {
      if (window.CollectableInstance) {
        return window.CollectableInstance;
      } else {
        // Get contract instance
        // Get Network ID where contract is deployed
        // This will get you the contract address
        const networkId = await window.web3.eth.net.getId();
        const contractAddress = NetworkService.getContractAddress(networkId);
        if (!contractAddress) {
          throw new Error(`Contract not found - Check that you are in the correct network, network detected: ${NetworkService.networks[networkId]}`);
        }
        const CollectableInstance = new window.web3.eth.Contract(
          Collectable.abi,
          contractAddress,
        );
        window.CollectableInstance = CollectableInstance
        return window.CollectableInstance;
      }
    } catch(e) {
      console.log('Error getting contract instance!');
      throw e;
    }
  },
  async claimNfts(address, quantity) {
    const CollectableInstance = await this.getContractInstance();
    let gas
    try {
      gas = await CollectableInstance.methods.devMint(address, quantity).estimateGas({ from: wallet.address, gas: 900000 })
      console.log('Estimated gas: ', gas);
    } catch(e) {
      console.log('Error estimating gas: ', e);
      gas = 805185
    }

    return CollectableInstance.methods.devMint(address, quantity).send({
      from: wallet.address,
      gas
    });
  },
  async mintNfts(quantity, nftPrice) {
    const ether = quantity * nftPrice
    const CollectableInstance = await this.getContractInstance();
    let gas
    try {
      gas = await CollectableInstance.methods.publicSaleMint(quantity).estimateGas({ from: wallet.address, value: ether, gas: 900000 })
      console.log('Estimated gas: ', gas);
    } catch(e) {
      console.log('Error estimating gas: ', e);
      gas = 805185
    }

    return CollectableInstance.methods.publicSaleMint(quantity).send({
      from: wallet.address,
      value: ether,
      gas
    });
  },
  async mintWhitelist(signature, quantity, nftPrice) {
    console.log('Inside service!!');
    const ether = quantity * nftPrice
    const CollectableInstance = await this.getContractInstance();

    let gas
    try {
      console.log('Before gas calculation!', signature, quantity);
      gas = await CollectableInstance.methods.whitelistMint(signature, quantity).estimateGas({ from: wallet.address, value: ether, gas: 900000 })
      console.log('Estimated gas: ', gas);
    } catch(e) {
      console.log('Error estimating gas: ', e);
      gas = 805185
    }
    console.log('After gas calculation!', signature, quantity);
    return CollectableInstance.methods.whitelistMint(signature, quantity).send({
      from: wallet.address,
      value: ether,
      gas
    });
  },
  async getTotalSupply() {  
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.totalSupply().call();
  },
  async isTheOwner(){
    const CollectableInstance = await this.getContractInstance();
    const ownerAddress = await CollectableInstance.methods.owner().call();
    return ownerAddress === wallet.address
  },
  async getOwner(){
    const CollectableInstance = await this.getContractInstance();
    const ownerAddress = await CollectableInstance.methods.owner().call();
    return ownerAddress;
  },
  async withdraw() {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.withdraw().send({
      from: wallet.address,
    });
  },
  async transferOwnership(newOwner) {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.transferOwnership(newOwner).send({
      from: wallet.address,
    });
  },
  async setBaseURI(newBaseURI) {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.setBaseURI(newBaseURI).send({
      from: wallet.address,
    });
  },
  async getBaseURI() {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.getBaseURI().call();
  },
  async setWhitelist(whitelist) {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.setWhitelist(whitelist).send({
      from: wallet.address,
    });
  },
  async getWhitelist() {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.getWhitelist().call();
  },
  async getBalance() {
    const CollectableInstance = await this.getContractInstance();
    return web3.eth.getBalance(CollectableInstance._address);
  },

  async flipSaleState() {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.flipSaleState().send({
      from: wallet.address,
    });
  },

  async flipPreSaleState() {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.flipPreSaleState().send({
      from: wallet.address,
    });
  },

  async getWhitelistMintPrice() {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.NFT_PRICE_PRESALE().call();
  },

  async getMintPrice() {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.NFT_PRICE().call();
  },

  async setWhitelistMintPrice(nftPrice) {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.setPresalePrice(nftPrice).send({
      from: wallet.address,
    });
  },

  async setMintPrice(nftPrice) {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.setMintPrice(nftPrice).send({
      from: wallet.address,
    });
  },

  async getBreedingState() {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.BREEDING_ACTIVE().call();
  },

  async flipBreedingState() {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.flipBreedingActive().send({
      from: wallet.address,
    });
  },

  async getBreedingPrice() {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.BREED_PRICE().call();
  },

  async setBreedingPrice(breedingPrice) {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.setBreedPrice(breedingPrice).send({
      from: wallet.address,
    });
  },

  async getMaxNFTClaims() {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.MAX_NFT_CLAIMS().call();
  },
  async getNFTClaimed() {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.NFT_CLAIMED().call();
  },
  async getSaleState() {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.hasSaleStarted().call();
  },
  async getPreSaleState() {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.hasPreSaleStarted().call();
  },
  async getHolders(){
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.getPastEvents('Transfer', {from: CollectableInstance._address })
      .then(events => {
        let holders = {}
        events.forEach(event => {
          if( holders[event.returnValues.to] ){
            holders[event.returnValues.to].push(event.returnValues.tokenId)
          } else {
            holders[event.returnValues.to] = [event.returnValues.tokenId]
          }          
        }) 
        return holders
      })
  },
  async getUserTokenAmount(address){
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.balanceOf(address).call();
  },
  async getTokensOfOwner(address) {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.tokensOfOwner(address).call();
  },
  async getTokenURIById(id) {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.tokenURI(id).call();
  },
  async setWhitelistSigningAddress(newSigner) {
    const CollectableInstance = await this.getContractInstance();
    try {
      gas = await CollectableInstance.methods.setWhitelistSigningAddress(newSigner).estimateGas({ from: wallet.address, gas: 900000 })
      console.log('Estimated gas: ', gas);
    } catch(e) {
      console.log('Error estimating gas: ', e);
      gas = 805185
    }
    return CollectableInstance.methods.setWhitelistSigningAddress(newSigner).send({
      from: wallet.address,
    });
  },
  async getBaseTokenURI() {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.baseTokenURI().call();
  },

  async breed(nftMale, nftFemale) {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.breed(nftMale, nftFemale).send({
      from: wallet.address,
    });
  },

  async setBreedingManager(address) {
    const networkId = await window.web3.eth.net.getId();
    const contractBreedingManagerAddress = NetworkService.getContractBreedingManagerAddress(networkId);
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.setBreedingManager(address || contractBreedingManagerAddress).send({
      from: wallet.address,
    });
  },

  async setWhitelistSigningAddress(address) {
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.setWhitelistSigningAddress(address).send({
      from: wallet.address,
    });
  },

  async setYieldToken(address) {
    const networkId = await window.web3.eth.net.getId();
    const contractEDOTokenAddress = NetworkService.getContractEDOTokenAddress(networkId);
    const CollectableInstance = await this.getContractInstance();
    return CollectableInstance.methods.setYieldToken(address || contractEDOTokenAddress).send({
      from: wallet.address,
    });
  }
}
export default CollectableContractABI;
